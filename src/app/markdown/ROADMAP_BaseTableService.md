# ROADMAP — BaseTableService (Template Method + Escrita + Exclusão)

> **Público-alvo:** Desenvolvedor júnior que precisa entender como funciona a camada de serviço (Processor) dos módulos com tabela física — onde colocar regras de negócio, como os dados fluem do controller até o banco e como os hooks permitem personalizar o comportamento sem duplicar código.
>
> **Arquivo documentado:** `src/app/Services/V1/BaseTableService.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é o BaseTableService](#1-o-que-é-o-basetableservice)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [O que é herdado de BaseViewService](#3-o-que-é-herdado-de-baseviewservice)
4. [Métodos de Leitura — Tabela](#4-métodos-de-leitura--tabela)
5. [Template Method — create()](#5-template-method--create)
6. [Template Method — update()](#6-template-method--update)
7. [Os 4 Hooks — Onde o Processor age](#7-os-4-hooks--onde-o-processor-age)
8. [Métodos de Exclusão](#8-métodos-de-exclusão)
9. [Como o Processor herda esta classe](#9-como-o-processor-herda-esta-classe)
10. [Fluxo Ponta a Ponta — Diagrama ASCII](#10-fluxo-ponta-a-ponta--diagrama-ascii)
11. [Erros Comuns](#11-erros-comuns)
12. [Sobre o Autor](#12-sobre-o-autor)

---

## 1. O que é o BaseTableService

`BaseTableService` é a **classe abstrata de serviço** para todos os módulos que possuem tabela física no banco. Ela é a peça central da arquitetura: fica entre o controller (que recebe a requisição HTTP) e o model (que executa o SQL).

```
Controller HTTP
    ↓
Processor (filho do BaseTableService)
    ↓
BaseTableService — lógica genérica de leitura, escrita e exclusão
    ↓
BaseTableModel — SQL (findPaginated, insert, update, delete...)
```

O Processor de cada módulo **não reimplementa** as operações de banco. Ele apenas:

- Declara qual model usar (`$this->tableModel`)
- Sobrescreve os **hooks** para adicionar regras específicas do domínio

Todo o restante — fluxo de create, update, exclusão, sanitização — vem pronto do `BaseTableService`.

---

## 2. Hierarquia de Classes

```
abstract BaseViewService          ← utilitários + leitura de view
    └── abstract BaseTableService ← leitura de tabela + escrita + exclusão
            └── Processor         ← regras de negócio do módulo (filho concreto)
```

| Classe             | Papel                                                               |
| ------------------ | ------------------------------------------------------------------- |
| `BaseViewService`  | Sanitização, formatação, paginação e leitura de views SQL           |
| `BaseTableService` | Herda tudo acima + leitura de tabela + `create`/`update` + exclusão |
| `Processor`        | Declara models + implementa apenas os hooks necessários             |

> `BaseTableService` é `abstract` — nunca é instanciada diretamente. Só o Processor do módulo é instanciado.

---

## 3. O que é herdado de BaseViewService

Antes de entrar nos métodos de tabela e escrita, é importante saber o que já está disponível por herança.

### Utilitários de Sanitização

#### `sanitizeString(string $value): string`

Remove tags HTML e espaços em branco nas extremidades. Útil para evitar XSS no banco.

```php
// Entrada: "  <b>Toyota</b>  "
// Saída:   "Toyota"
$this->sanitizeString("  <b>Toyota</b>  ");
```

#### `sanitizeData(array $data): array`

Aplica `sanitizeString` em todos os campos string e **descarta chaves com valor `null` ou string vazia**.

```php
// Entrada:
['name' => ' Toyota ', 'color' => '', 'year' => 2020, 'notes' => null]

// Saída (null e vazio removidos, string limpa):
['name' => 'Toyota', 'year' => 2020]
```

> **Por que remover nulos e vazios?** O CI4 `allowedFields` já protege o model, mas remover antes evita UPDATE que zere campos não intencionalmente.

#### `removeMasks(array $data): array`

Remove máscaras de formatação (parênteses, traços, pontos, espaços) dos campos sensíveis, mantendo apenas dígitos.

**Campos cobertos:**

| Campo original (tabela) | Campo com prefixo (view) |
| ----------------------- | ------------------------ |
| `cpf`                   | `uc_cpf`                 |
| `whatsapp`              | `uc_whatsapp`            |
| `phone`                 | `uc_phone`               |
| `zip_code`              | `uc_zip_code`            |

```php
// Entrada:
['cpf' => '123.456.789-00', 'whatsapp' => '(51) 9 9999-8888', 'name' => 'Ana']

// Saída:
['cpf' => '12345678900', 'whatsapp' => '51999998888', 'name' => 'Ana']
```

Funciona também quando o campo é um array de valores (para filtros multivalorados):

```php
// Filtro de múltiplos CPFs:
['cpf' => ['123.456.789-00', '987.654.321-00']]
// Resultado: ['cpf' => ['12345678900', '98765432100']]
```

### Utilitários de Formatação

#### `formatDate(?string $date): ?string`

Converte qualquer formato de data para `Y-m-d` (padrão MySQL DATE).
Retorna `null` se o valor estiver vazio ou não puder ser parseado.

```php
$this->formatDate('10/05/2026');  // → '2026-05-10'
$this->formatDate('2026-05-10'); // → '2026-05-10'
$this->formatDate('');            // → null
$this->formatDate('invalido');    // → null
```

#### `formatDatetime(?string $datetime): ?string`

Converte para `Y-m-d H:i:s` (padrão MySQL DATETIME).
Aceita o formato `datetime-local` do HTML (`Y-m-d\TH:i`).

```php
$this->formatDatetime('2026-05-10T14:30'); // → '2026-05-10 14:30:00'
$this->formatDatetime('');                  // → null
```

### Parâmetros de Paginação

#### `buildPaginationParams(array $params): array`

Normaliza os parâmetros de paginação recebidos da query string, aplicando limites seguros.

```php
// Entrada (da query string):
['page' => '2', 'limit' => '500', 'sort' => 'name', 'order' => 'asc']

// Saída (normalizada):
['page' => 2, 'limit' => 100, 'sort' => 'name', 'order' => 'asc']
//                     ↑ capped em 100
```

| Parâmetro | Padrão   | Regra           |
| --------- | -------- | --------------- |
| `page`    | `1`      | Mínimo 1        |
| `limit`   | `20`     | Entre 1 e 100   |
| `sort`    | `'id'`   | Trim de espaços |
| `order`   | `'desc'` | Trim de espaços |

### Leitura de View (8 métodos `*View`)

Estes métodos delegam para o `$this->viewModel`. São usados pelo `BaseResourceViewController` e pelo `BaseResourceTableController` nos endpoints de view.

| Método                                 | Endpoint                 | Descrição                                |
| -------------------------------------- | ------------------------ | ---------------------------------------- |
| `findView(filters, params)`            | `POST /find`             | Busca paginada com filtros na view       |
| `getGroupedView(multiFilters, params)` | `POST /get-grouped`      | Busca com filtros multivalorados na view |
| `searchView(term, params)`             | `POST /search`           | Busca textual paginada na view           |
| `getView(id)`                          | `GET /get/{id}`          | Busca registro ativo por ID na view      |
| `getAllView(params)`                   | `GET /get-all`           | Lista paginada de ativos na view         |
| `getNoPaginationView(sort, order)`     | `GET /get-no-pagination` | Lista completa sem paginação na view     |
| `getDeletedView(id)`                   | `GET /get-deleted/{id}`  | Busca soft-deleted por ID na view        |
| `getDeletedAllView(params)`            | `GET /get-deleted-all`   | Lista paginada de soft-deleted na view   |

---

## 4. Métodos de Leitura — Tabela

Estes métodos delegam para o `$this->tableModel`. São usados pelo `BaseResourceTableController` nos endpoints de tabela física.

### Tabela de métodos

| Método                             | Endpoint                     | Fonte de dados                     |
| ---------------------------------- | ---------------------------- | ---------------------------------- |
| `find(filters, params)`            | `POST /find`                 | `tableModel->findPaginated`        |
| `getGrouped(multiFilters, params)` | `POST /get-grouped`          | `tableModel->findGrouped`          |
| `search(term, params)`             | `POST /search`               | `tableModel->searchByTerm`         |
| `get(id)`                          | `GET /get/{id}`              | `tableModel->find`                 |
| `getAll(params)`                   | `GET /get-all`               | `tableModel->findPaginated([])`    |
| `getNoPagination(sort, order)`     | `GET /get-no-pagination`     | `tableModel->getOrdered`           |
| `getDeleted(id)`                   | `GET /get-deleted/{id}`      | `tableModel->findOnlyDeleted`      |
| `getWithDeleted(id)`               | `GET /get-with-deleted/{id}` | `tableModel->findWithDeleted`      |
| `getDeletedAll(params)`            | `GET /get-deleted-all`       | `tableModel->findDeletedPaginated` |

### Diferença entre `getDeleted` e `getWithDeleted`

| Método               | O que retorna                                 |
| -------------------- | --------------------------------------------- |
| `getDeleted(id)`     | Apenas registros com `deleted_at IS NOT NULL` |
| `getWithDeleted(id)` | Qualquer registro — ativo ou soft-deleted     |

`getWithDeleted` é usado internamente pelo `update()` e pelo `deleteSoft()` para verificar se o registro existe antes de operar.

### Como `find` aplica os filtros

```php
public function find(array $filters, array $params): array
{
    $p = $this->buildPaginationParams($params);

    return $this->tableModel->findPaginated(
        $this->removeMasks($filters),  // ← remove máscaras dos filtros
        $p['page'],
        $p['limit'],
        $p['sort'],
        $p['order']
    );
}
```

Os filtros passam por `removeMasks` automaticamente — então buscar por `cpf = '123.456.789-00'` funciona mesmo com máscara.

---

## 5. Template Method — create()

O `create()` implementa o padrão **Template Method**: define o algoritmo fixo e deixa pontos de extensão (hooks) para o Processor personalizar.

### Fluxo completo

```
Dados brutos da requisição (array $data)
        │
        ▼
① sanitizeData($data)
   └── remove null/vazio, strip_tags, trim em strings
        │
        ▼
② removeMasks($sanitized)
   └── remove máscara de cpf, whatsapp, phone, zip_code
        │
        ▼
③ validateOnCreate($sanitized)   ← HOOK (Processor sobrescreve)
   └── null → prosseguir
   └── array de erro → retorna imediatamente
        │
        ▼
④ prepareData($sanitized)        ← HOOK (Processor sobrescreve)
   └── uuid(), bcrypt(), formatDate(), etc.
        │
        ▼
⑤ tableModel->insert($prepared)
   ├── falhou → ['success' => false, 'message' => '...', 'code' => 500]
   └── sucesso → tableModel->find($id)
        │
        ▼
⑥ ['success' => true, 'data' => $registro]
```

### Código do BaseTableService

```php
public function create(array $data): array
{
    $sanitized = $this->removeMasks($this->sanitizeData($data));

    $conflict = $this->validateOnCreate($sanitized);
    if ($conflict !== null) {
        return $conflict;  // ← erro de negócio, sem tocar no banco
    }

    $sanitized = $this->prepareData($sanitized);

    try {
        $id = $this->tableModel->insert($sanitized);

        if (!$id) {
            return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
        }

        return ['success' => true, 'data' => $this->tableModel->find($id)];
    } catch (DatabaseException $e) {
        log_message('error', '[' . static::class . '::create] DatabaseException: ' . $e->getMessage());

        return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
    }
}
```

### Formato de retorno

```php
// Sucesso:
['success' => true, 'data' => ['id' => 1, 'uuid' => '...', 'name' => 'Toyota', ...]]

// Conflito de negócio (validateOnCreate):
['success' => false, 'message' => 'Já existe uma marca com este nome', 'code' => 409]

// Erro de banco:
['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500]
```

---

## 6. Template Method — update()

O `update()` segue o mesmo padrão, mas com ordem diferente dos hooks: a **preparação dos dados** acontece **antes** da validação — pois é comum precisar dos dados preparados para validar unicidade.

### Fluxo completo

```
int $id, array $data (dados brutos)
        │
        ▼
① tableModel->find($id)
   └── null → ['success' => false, ..., 'code' => 404]
        │
        ▼
② sanitizeData($data) + removeMasks()
        │
        ▼
③ prepareUpdateData($id, $sanitized)   ← HOOK (Processor sobrescreve)
   └── por padrão delega para prepareData()
   └── Processor pode remover campos imutáveis (ex: uuid, email)
        │
        ▼
④ validateOnUpdate($id, $sanitized)    ← HOOK (Processor sobrescreve)
   └── null → prosseguir
   └── array de erro → retorna imediatamente
        │
        ▼
⑤ tableModel->update($id, $prepared)
   └── DatabaseException → log + erro 500
        │
        ▼
⑥ ['success' => true, 'data' => tableModel->find($id)]
```

> **Atenção na ordem:** no `create`, `prepareData` vem depois de `validateOnCreate`. No `update`, `prepareUpdateData` vem **antes** de `validateOnUpdate`. Isso é intencional — permite usar os dados já preparados (ex: com máscara removida) na validação de unicidade.

### Código do BaseTableService

```php
public function update(int $id, array $data): array
{
    if (!$this->tableModel->find($id)) {
        return ['success' => false, 'message' => 'Registro não encontrado ou foi excluído', 'code' => 404];
    }

    $sanitized = $this->removeMasks($this->sanitizeData($data));
    $sanitized = $this->prepareUpdateData($id, $sanitized);

    $conflict = $this->validateOnUpdate($id, $sanitized);
    if ($conflict !== null) {
        return $conflict;
    }

    try {
        $this->tableModel->update($id, $sanitized);

        return ['success' => true, 'data' => $this->tableModel->find($id)];
    } catch (DatabaseException $e) {
        log_message('error', '[' . static::class . '::update] DatabaseException: ' . $e->getMessage());

        return ['success' => false, 'message' => 'Erro ao atualizar registro', 'code' => 500];
    }
}
```

---

## 7. Os 4 Hooks — Onde o Processor age

Os hooks são métodos `protected` com implementação padrão vazia no `BaseTableService`. O Processor sobrescreve apenas os que precisar.

### Visão geral dos 4 hooks

| Hook                                      | Usado em                                          | Retorno  | Propósito                            |
| ----------------------------------------- | ------------------------------------------------- | -------- | ------------------------------------ |
| `validateOnCreate(array $data)`           | `create()`                                        | `?array` | Regras de negócio antes do INSERT    |
| `prepareData(array $data)`                | `create()` e (via `prepareUpdateData`) `update()` | `array`  | Transformações antes de persistir    |
| `prepareUpdateData(int $id, array $data)` | `update()`                                        | `array`  | Transformações específicas de UPDATE |
| `validateOnUpdate(int $id, array $data)`  | `update()`                                        | `?array` | Regras de negócio antes do UPDATE    |

---

### Hook 1 — `validateOnCreate(array $data): ?array`

**Quando usar:** verificar unicidade, FK obrigatória, regra de negócio que exige consulta ao banco antes do INSERT.

**Retorno:**

- `null` → tudo certo, prosseguir para `prepareData`
- `array` de erro → interrompe o `create()` e retorna o erro ao controller

**Implementação padrão (BaseTableService):**

```php
protected function validateOnCreate(array $data): ?array
{
    return null; // sem restrição — Processor sobrescreve se necessário
}
```

**Exemplo real — verificar unicidade do nome:**

```php
// No Processor (filho):
protected function validateOnCreate(array $data): ?array
{
    $exists = $this->tableModel
        ->where('name', $data['name'])
        ->first();

    if ($exists) {
        return [
            'success' => false,
            'message' => 'Já existe um registro com este nome',
            'code'    => 409,
        ];
    }

    return null; // sem conflito → prosseguir
}
```

---

### Hook 2 — `prepareData(array $data): array`

**Quando usar:** transformações que devem ocorrer antes de qualquer persistência — tanto no INSERT quanto no UPDATE (via `prepareUpdateData`).

**Implementação padrão (BaseTableService):**

```php
protected function prepareData(array $data): array
{
    return $data; // sem transformação — Processor sobrescreve
}
```

**Exemplo real — gerar UUID e hashear senha:**

```php
// No Processor do módulo User:
protected function prepareData(array $data): array
{
    if (!isset($data['uuid'])) {
        $data['uuid'] = uuid();  // helper global: gera UUID v4
    }

    if (isset($data['password'])) {
        $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT);
    }

    if (isset($data['birth_date'])) {
        $data['birth_date'] = $this->formatDate($data['birth_date']);
    }

    return $data;
}
```

---

### Hook 3 — `prepareUpdateData(int $id, array $data): array`

**Quando usar:** UPDATE que deve **ignorar campos imutáveis** (uuid, email, criado_em) ou aplicar lógica diferente da criação.

**Implementação padrão (BaseTableService):**

```php
protected function prepareUpdateData(int $id, array $data): array
{
    return $this->prepareData($data); // delega para prepareData por padrão
}
```

> Por padrão, `prepareUpdateData` chama `prepareData`. Se você sobrescrever `prepareData`, o UPDATE também será afetado, a menos que você sobrescreva `prepareUpdateData` separadamente.

**Exemplo real — remover campo imutável e não regenerar UUID:**

```php
// No Processor:
protected function prepareUpdateData(int $id, array $data): array
{
    unset($data['uuid']);   // UUID nunca muda após criação
    unset($data['email']);  // Email é imutável — requer fluxo próprio

    // Aplica apenas as transformações que fazem sentido no update
    if (isset($data['birth_date'])) {
        $data['birth_date'] = $this->formatDate($data['birth_date']);
    }

    return $data;
}
```

---

### Hook 4 — `validateOnUpdate(int $id, array $data): ?array`

**Quando usar:** verificar unicidade excluindo o próprio registro (`excludeId`), ou regras de negócio que dependem do ID.

**Implementação padrão (BaseTableService):**

```php
protected function validateOnUpdate(int $id, array $data): ?array
{
    return null; // sem restrição
}
```

**Exemplo real — unicidade com `excludeId`:**

```php
// No Processor:
protected function validateOnUpdate(int $id, array $data): ?array
{
    if (!isset($data['name'])) {
        return null;
    }

    $exists = $this->tableModel
        ->where('name', $data['name'])
        ->where('id !=', $id)   // exclui o próprio registro
        ->first();

    if ($exists) {
        return [
            'success' => false,
            'message' => 'Já existe outro registro com este nome',
            'code'    => 409,
        ];
    }

    return null;
}
```

---

## 8. Métodos de Exclusão

O `BaseTableService` implementa **3 estratégias** de exclusão e **1 método de limpeza**, cada um com suas próprias verificações de guarda.

### `deleteSoft(int $id): array` — Exclusão Lógica

Marca o registro com `deleted_at = NOW()`. O registro continua no banco mas não aparece nas listagens normais.

**Verificações:**

1. Registro não existe (nem mesmo deletado) → HTTP 404
2. Registro já tem `deleted_at` preenchido → HTTP 409 (Conflict)

```php
public function deleteSoft(int $id): array
{
    $existing = $this->tableModel->findWithDeleted($id);

    if (!$existing) {
        return ['success' => false, 'message' => 'Registro não encontrado', 'code' => 404];
    }

    if ($existing['deleted_at'] !== null) {
        return ['success' => false, 'message' => 'Registro já está excluído logicamente', 'code' => 409];
    }

    $this->tableModel->delete($id); // soft delete via CI4

    return ['success' => true, 'message' => 'Registro excluído logicamente com sucesso'];
}
```

---

### `deleteRestore(int $id): array` — Restauração

Remove o `deleted_at` (retorna o registro para a listagem normal).

**Verificação:** O registro deve estar em soft delete — se não existe ou está ativo → HTTP 404.

```php
public function deleteRestore(int $id): array
{
    if (!$this->tableModel->findOnlyDeleted($id)) {
        return ['success' => false, 'message' => 'Registro deletado não encontrado', 'code' => 404];
    }

    $this->tableModel->restore($id);

    return ['success' => true, 'message' => 'Registro restaurado com sucesso'];
}
```

---

### `deleteHard(int $id): array` — Exclusão Permanente

Remove fisicamente o registro do banco (`DELETE` real). Irreversível.

**Verificação:** O registro deve existir — ativo ou soft-deleted → HTTP 404 se não encontrado.

```php
public function deleteHard(int $id): array
{
    if (!$this->tableModel->findWithDeleted($id)) {
        return ['success' => false, 'message' => 'Registro não encontrado', 'code' => 404];
    }

    $this->tableModel->delete($id, true); // true = force delete (CI4)

    return ['success' => true, 'message' => 'Registro excluído permanentemente'];
}
```

---

### `clearDeleted(?int $id = null): array` — Purga de Soft-Deleted

Remove permanentemente **todos** os registros soft-deleted — ou um específico se `$id` for informado.

```php
public function clearDeleted(?int $id = null): array
{
    return ['affected' => $this->tableModel->clearDeleted($id)];
}
```

| Chamada           | Comportamento                                          |
| ----------------- | ------------------------------------------------------ |
| `clearDeleted()`  | Remove todos os registros com `deleted_at IS NOT NULL` |
| `clearDeleted(5)` | Remove apenas o registro de ID 5 (se soft-deleted)     |
| Retorno           | `['affected' => N]` onde N = linhas removidas          |

---

### Tabela comparativa das 4 exclusões

| Método          | Endpoint                       | Irreversível | Verificações                        |
| --------------- | ------------------------------ | ------------ | ----------------------------------- |
| `deleteSoft`    | `DELETE /delete-soft/{id}`     | Não          | 404 (não existe), 409 (já deletado) |
| `deleteRestore` | `PATCH /delete-restore/{id}`   | — (restaura) | 404 (não está deletado)             |
| `deleteHard`    | `DELETE /delete-hard/{id}`     | **Sim**      | 404 (não existe)                    |
| `clearDeleted`  | `DELETE /clear-deleted[/{id}]` | **Sim**      | Nenhuma — purga diretamente         |

---

## 9. Como o Processor herda esta classe

O Processor é o filho concreto. Ele **não reimplementa** nenhuma lógica de banco — apenas declara os models e sobrescreve os hooks necessários.

### Implementação mínima (sem regras de negócio)

```php
<?php

namespace App\Services\V1\Mec\VehicleBrand;

use App\Models\V1\Mec\VehicleBrand\SqlTableModel;
use App\Models\V1\Mec\VehicleBrand\SqlViewModel;
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }
    // Sem hooks → BaseTableService cuida de tudo
}
```

Com apenas isso, o Processor já possui todos os 9 reads de tabela, 8 reads de view, `create`, `update` e 4 exclusões funcionando.

### Implementação com regras de negócio

```php
<?php

namespace App\Services\V1\Mec\VehicleBrand;

use App\Services\V1\BaseTableService;
use App\Models\V1\Mec\VehicleBrand\SqlTableModel;
use App\Models\V1\Mec\VehicleBrand\SqlViewModel;

class Processor extends BaseTableService
{
    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    // Verifica unicidade antes do INSERT
    protected function validateOnCreate(array $data): ?array
    {
        if ($this->tableModel->where('name', $data['name'])->first()) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }
        return null;
    }

    // Adiciona UUID antes do INSERT
    protected function prepareData(array $data): array
    {
        $data['uuid'] = uuid();
        return $data;
    }

    // No UPDATE: remove uuid (imutável) e verifica unicidade excluindo o próprio id
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['uuid']);
        return $data;
    }

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!isset($data['name'])) {
            return null;
        }

        if ($this->tableModel->where('name', $data['name'])->where('id !=', $id)->first()) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }

        return null;
    }
}
```

---

## 10. Fluxo Ponta a Ponta — Diagrama ASCII

### POST /api/v1/mec/vehicle-brand/create

```
Cliente HTTP
    │
    │  POST /api/v1/mec/vehicle-brand/create
    │  Body: {"name": "  <b>Toyota</b>  "}
    │  Header: Authorization: Bearer eyJ...
    ▼
[AuthFilter]
    │  JwtHelper::decode() → válido → continua
    ▼
[ResourceTableController::create()]
    │  $rules = $this->getCreateRules() → (new CreateRequest())->rules()
    │  CI4 valida → "name" required|string|max_length[100] → OK
    │  $data = $this->getJsonBody() → ['name' => '  <b>Toyota</b>  ']
    ▼
[Processor::create($data)]     ← herdado de BaseTableService
    │
    │  ① sanitizeData(['name' => '  <b>Toyota</b>  '])
    │     → ['name' => 'Toyota']   (strip_tags + trim)
    │
    │  ② removeMasks(['name' => 'Toyota'])
    │     → sem mudança (name não está em MASKED_FIELDS)
    │
    │  ③ validateOnCreate(['name' => 'Toyota'])  ← HOOK
    │     → tableModel->where('name','Toyota')->first() → null
    │     → return null  (sem conflito)
    │
    │  ④ prepareData(['name' => 'Toyota'])        ← HOOK
    │     → $data['uuid'] = uuid()
    │     → ['name' => 'Toyota', 'uuid' => '3f25...']
    │
    │  ⑤ tableModel->insert(['name' => 'Toyota', 'uuid' => '3f25...'])
    │     → SQL: INSERT INTO mec_01_vehicle_brand (name, uuid) VALUES (...)
    │     → $id = 42
    │
    │  ⑥ tableModel->find(42)
    │     → ['id' => 42, 'uuid' => '3f25...', 'name' => 'Toyota', ...]
    ▼
[ResourceTableController]
    │  return respondCreated(['success' => true, 'data' => [...]])
    ▼
Cliente HTTP ← HTTP 201
    {
        "success": true,
        "data": {
            "id": 42,
            "uuid": "3f2504e0-...",
            "name": "Toyota",
            "created_at": "2026-05-10 09:00:00",
            "updated_at": "2026-05-10 09:00:00",
            "deleted_at": null
        }
    }
```

---

## 11. Erros Comuns

| Erro                                                               | Causa                                                            | Solução                                                                         |
| ------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `Call to undefined method $this->tableModel->...`                  | `$this->tableModel` não foi declarado no construtor do Processor | Declarar `$this->tableModel = new SqlTableModel()` no `__construct`             |
| `Call to undefined method $this->viewModel->...`                   | `$this->viewModel` não foi declarado                             | Declarar `$this->viewModel = new SqlViewModel()` no `__construct`               |
| `validateOnCreate` nunca impede duplicidade                        | Hook não foi sobrescrito no Processor                            | Sobrescrever `validateOnCreate` no Processor filho                              |
| UUID sendo regenerado no update                                    | `prepareData` gera UUID sem verificar se já existe               | Sobrescrever `prepareUpdateData` e remover `uuid` antes de chamar `prepareData` |
| Campo imutável sendo sobrescrito no UPDATE                         | `prepareUpdateData` não foi sobrescrito                          | Sobrescrever `prepareUpdateData` e aplicar `unset($data['campo_imutavel'])`     |
| `validateOnUpdate` valida duplicidade incluindo o próprio registro | Faltou `->where('id !=', $id)`                                   | Adicionar `->where('id !=', $id)` antes do `->first()`                          |
| `DatabaseException` não logada                                     | Exceção tratada fora do `try/catch` do BaseTableService          | Deixar o BaseTableService tratar — não relançar a exceção no Processor          |
| `sanitizeData` removendo campo necessário                          | Campo chegou como string vazia `""`                              | Enviar `null` explícito ou não enviar o campo na requisição                     |

---

## 12. Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
