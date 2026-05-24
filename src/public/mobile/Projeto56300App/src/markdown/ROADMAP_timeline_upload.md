# ROADMAP — Timeline Upload: Diagnóstico e Solução Completa

Data: 2026-05-24  
Planos: `plan_2026_05_24_001`, `plan_2026_05_24_002`, `plan_2026_05_24_003`

---

## Contexto

O botão **Publicar** da tela de Nova Publicação abortava silenciosamente ao tentar criar um post na timeline (com ou sem arquivo). Via Postman o endpoint retornava 201. Via app retornava erro.

---

## Bug 1 — Campo `tenant_id` rejeitado pelo backend (HTTP 422)

### Causa

O backend (`CreateRequest.php`) valida o campo `user_saas_tenants_id` como obrigatório.  
O mobile enviava `tenant_id` — campo que não existe nas regras de validação.

| Camada                                           | Antes                                               | Depois                                                         |
| ------------------------------------------------ | --------------------------------------------------- | -------------------------------------------------------------- |
| `TimelineDto.ts` — `CreateTimelineDtoRequest`    | `tenant_id: number`                                 | `user_saas_tenants_id: number`                                 |
| `TimelineRepositoryImpl.ts` — `create()`         | `this.ds.create(payload)` (payload com `tenant_id`) | objeto explícito com `user_saas_tenants_id: payload.tenant_id` |
| `TimelineRepositoryImpl.ts` — `createWithFile()` | `formData.append('tenant_id', ...)`                 | `formData.append('user_saas_tenants_id', ...)`                 |

### Arquivos alterados

- `src/features/messaging/V1/messageTimeline/data/dto/TimelineDto.ts`
- `src/features/messaging/V1/messageTimeline/data/repositories/TimelineRepositoryImpl.ts`

### Nota de arquitetura

O domínio (`CreateTimelinePayload`) mantém `tenant_id` internamente — o mapeamento para `user_saas_tenants_id` acontece na camada de repositório (fronteira de dados), sem vazar para a camada de domínio.

---

## Bug 2 — `files` vs `files[]` causa TypeError no PHP (HTTP 500)

### Causa

`MsgFileUploadService::uploadFiles()` declara `array $files` (PHP 8, tipagem estrita).

Quando o campo no FormData é nomeado `files` (sem colchetes), o PHP/CodeIgniter 4 entrega um único `UploadedFile` — não um array. PHP 8 lança `TypeError`, o controller captura e retorna 500.

O Postman enviava `files[]` (com colchetes) → CI4 entrega `UploadedFile[]` → funciona.

| Onde                                             | Antes                            | Depois                             |
| ------------------------------------------------ | -------------------------------- | ---------------------------------- |
| `TimelineRepositoryImpl.ts` — `createWithFile()` | `formData.append('files', blob)` | `formData.append('files[]', blob)` |

### Arquivo alterado

- `src/features/messaging/V1/messageTimeline/data/repositories/TimelineRepositoryImpl.ts`

### Regra geral

Sempre usar `files[]` (com colchetes) no FormData quando o backend PHP espera `array` na assinatura. `files` entrega objeto único; `files[]` entrega array.

---

## Bug 3 — AbortController 10s mata o upload antes de concluir (HTTP 400 Nginx)

### Causa

O arquivo de galeria (`1000000019.jpg`) trafega pelo adaptador de rede virtual do emulador Android (`10.0.2.2`). Esse caminho introduz latência extra comparado ao Postman, que corre no host com acesso direto ao localhost.

| Origem                       | Tempo de upload | Resultado                             |
| ---------------------------- | --------------- | ------------------------------------- |
| Postman (host → localhost)   | ~5s             | HTTP 201 ✅                           |
| Mobile (emulador → 10.0.2.2) | ~9s             | AbortController dispara → HTTP 400 ❌ |

O `API_TIMEOUT_MS = 10_000` (10s) é suficiente para requisições JSON, mas não para uploads de arquivo via emulador.

**Diagnóstico pelo log do Nginx:**

```
17:14:05  [warn] body buffered to temp file   ← upload começou
17:14:14  POST /api/v1/msg-timeline/create 400 0 bytes  ← cliente desconectou (9s)
```

O `0 bytes` no corpo da resposta confirma que é o Nginx retornando erro de conexão fechada — nunca chegou ao PHP.

### Solução

Adicionar parâmetro `timeoutMs` opcional ao `httpClientFormData`, mantendo `API_TIMEOUT_MS` como default para todos os outros callers.

```typescript
// HttpClient.ts
export async function httpClientFormData<T>(
  path: string,
  formData: FormData,
  timeoutMs = API_TIMEOUT_MS,   // ← parâmetro adicionado
): Promise<T> {
  ...
  const timer = setTimeout(() => controller.abort(), timeoutMs)  // ← usa timeoutMs
```

```typescript
// TimelineRemoteDataSource.ts
createMultipart(formData: FormData): Promise<ApiEnvelope<TimelineDto>> {
  return httpClientFormData(`${TABLE_BASE}/create`, formData, 60_000)  // ← 60s para upload
}
```

### Arquivos alterados

- `src/core/services/HttpClient.ts`
- `src/features/messaging/V1/messageTimeline/data/datasources/TimelineRemoteDataSource.ts`

---

## Estado final dos arquivos após os 3 fixes

### `TimelineDto.ts`

```typescript
export interface CreateTimelineDtoRequest {
  user_saas_tenants_id: number; // era: tenant_id
  user_management_id: number;
  content: string;
  is_pinned?: 0 | 1;
}
```

### `TimelineRepositoryImpl.ts`

```typescript
async create(payload: CreateTimelinePayload): Promise<Timeline> {
  const env = await this.ds.create({
    user_saas_tenants_id: payload.tenant_id,   // mapeamento explícito
    user_management_id: payload.user_management_id,
    content: payload.content,
    is_pinned: payload.is_pinned,
  })
  ...
}

async createWithFile(payload: CreateTimelinePayload, file?: FileAsset): Promise<Timeline> {
  ...
  formData.append('user_saas_tenants_id', String(payload.tenant_id))  // era: tenant_id
  formData.append('files[]', { uri, name, type } as unknown as Blob)   // era: 'files'
  ...
}
```

### `TimelineRemoteDataSource.ts`

```typescript
createMultipart(formData: FormData): Promise<ApiEnvelope<TimelineDto>> {
  return httpClientFormData(`${TABLE_BASE}/create`, formData, 60_000)  // era: sem timeout
}
```

### `HttpClient.ts`

```typescript
export async function httpClientFormData<T>(
  path: string,
  formData: FormData,
  timeoutMs = API_TIMEOUT_MS,   // era: sem parâmetro, fixo em API_TIMEOUT_MS
): Promise<T> {
  ...
  const timer = setTimeout(() => controller.abort(), timeoutMs)
```

---

## Critérios de sucesso

- POST `/api/v1/msg-timeline/create` via app com texto retorna 201
- POST `/api/v1/msg-timeline/create` via app com texto + arquivo retorna 201 com `_upload.success: true`
- Nginx não registra mais `400 0 bytes` para esse endpoint a partir do mobile
- Endpoints JSON continuam com timeout de 10s
