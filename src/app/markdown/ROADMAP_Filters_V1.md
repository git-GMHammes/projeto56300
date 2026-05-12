# ROADMAP — Filtros V1 (AuthFilter + LoginRateLimitFilter)

> **Público-alvo:** Desenvolvedor júnior que precisa entender como a autenticação JWT e o rate limiting protegem a API V1, como os filtros são registrados e como criar novos filtros seguindo o padrão do projeto.
>
> **Pasta documentada:** `src/app/Filters/V1/UserManagement/`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é um Filter no CodeIgniter 4](#1-o-que-é-um-filter-no-codeigniter-4)
2. [Filtros desta pasta](#2-filtros-desta-pasta)
3. [Como o CI4 processa filtros](#3-como-o-ci4-processa-filtros)
4. [AuthFilter — Autenticação JWT Bearer](#4-authfilter--autenticação-jwt-bearer)
5. [LoginRateLimitFilter — Rate Limiting no Login](#5-loginratelimitfilter--rate-limiting-no-login)
6. [Registro em Config/Filters.php](#6-registro-em-configfiltersphp)
7. [Rotas Públicas (sem autenticação)](#7-rotas-públicas-sem-autenticação)
8. [Fluxo Completo de uma Requisição Protegida](#8-fluxo-completo-de-uma-requisição-protegida)
9. [Como criar um novo Filtro](#9-como-criar-um-novo-filtro)
10. [Erros Comuns](#10-erros-comuns)
11. [Sobre o Autor](#11-sobre-o-autor)

---

## 1. O que é um Filter no CodeIgniter 4

Um **Filter** é uma classe que intercepta requisições HTTP **antes** ou **depois** do controller ser executado. É o equivalente a um middleware.

```
Requisição HTTP
    │
    ▼
[before filters]  ← intercepta ANTES (ex: verifica autenticação)
    │
    ▼
Controller / Action
    │
    ▼
[after filters]   ← intercepta DEPOIS (ex: adiciona headers de resposta)
    │
    ▼
Resposta HTTP
```

Todo filtro implementa a interface `CodeIgniter\Filters\FilterInterface`, que exige dois métodos:

| Método                                                                      | Quando executa      | O que faz neste projeto            |
| --------------------------------------------------------------------------- | ------------------- | ---------------------------------- |
| `before(RequestInterface $request, $arguments)`                             | Antes do controller | Valida JWT / verifica rate limit   |
| `after(RequestInterface $request, ResponseInterface $response, $arguments)` | Após o controller   | Nenhuma ação (vazio neste projeto) |

Se o método `before` retornar uma `ResponseInterface`, **o controller não é executado** — a resposta retornada pelo filtro vai direto para o cliente.

---

## 2. Filtros desta pasta

| Arquivo                    | Alias            | Responsabilidade                                       |
| -------------------------- | ---------------- | ------------------------------------------------------ |
| `AuthFilter.php`           | `authFilter`     | Valida o JWT Bearer Token em toda requisição protegida |
| `LoginRateLimitFilter.php` | `loginRateLimit` | Limita tentativas de login a 10 por minuto por IP      |

Ambos estão no namespace `App\Filters\V1\UserManagement` e registrados em `src/app/Config/Filters.php`.

---

## 3. Como o CI4 processa filtros

O CI4 aplica filtros em 4 camadas, nesta ordem:

```
1. $required['before']   → filtros obrigatórios (sempre executam, mesmo em rota 404)
2. $globals['before']    → filtros globais (com suporte a 'except')
3. $methods['before']    → filtros por método HTTP (GET, POST, etc.)
4. $filters['before']    → filtros por padrão de URI
```

Neste projeto:

- `authFilter` está em `$globals['before']` com lista de exceções (`except`)
- `loginRateLimit` está em `$filters['before']` vinculado só ao padrão `api/v1/auth/login`

---

## 4. AuthFilter — Autenticação JWT Bearer

**Arquivo:** `src/app/Filters/V1/UserManagement/AuthFilter.php`

### O que faz

Intercepta **toda requisição** (exceto rotas públicas) e valida o JWT Bearer Token informado no header `Authorization`. Se o token for inválido, ausente ou revogado, a requisição é rejeitada com HTTP 401 antes de chegar ao controller.

### Fluxo de validação

```
Requisição recebida
    │
    ▼
1. Lê o header Authorization
    │
    ├── Ausente ou não começa com "Bearer " → HTTP 401 "Token não informado"
    │
    ▼
2. Extrai o token (remove "Bearer ")
    │
    ▼
3. JwtHelper::decode($token)
    │
    ├── Assinatura inválida    → RuntimeException → HTTP 401
    ├── Token expirado         → RuntimeException → HTTP 401
    │
    ▼
4. Verifica revogação no cache
    │  cache()->get('jwt_revoked_' . hash('sha256', $token))
    │
    ├── Chave encontrada (token revogado via logout) → HTTP 401 "Token revogado"
    │
    ▼
5. Token válido → passa para o controller
```

### Exemplo de requisição válida

```http
GET /api/v1/mec/vehicle-brand/get-all HTTP/1.1
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Resposta 401 — Token ausente ou inválido

```json
{
  "statusCode": 401,
  "message": "Token de autenticação não informado",
  "success": false,
  "data": null
}
```

### Resposta 401 — Token revogado (após logout)

```json
{
  "statusCode": 401,
  "message": "Token revogado. Faça login novamente.",
  "success": false,
  "data": null
}
```

### Como a revogação funciona

Quando o usuário faz logout, o token é marcado como revogado no cache com a chave:

```
jwt_revoked_ + SHA-256(token)
```

O AuthFilter verifica essa chave a cada requisição. Se encontrar, o token é recusado mesmo que ainda não tenha expirado — garantindo que o logout seja imediato e efetivo.

---

## 5. LoginRateLimitFilter — Rate Limiting no Login

**Arquivo:** `src/app/Filters/V1/UserManagement/LoginRateLimitFilter.php`

### O que faz

Aplica **rate limiting** ao endpoint `POST /api/v1/auth/login`. Limita cada endereço IP a **10 tentativas por 60 segundos**. Se o limite for atingido, a requisição é bloqueada com HTTP 429 e o cliente recebe o tempo de espera no header `Retry-After`.

### Constantes

```php
private const MAX_ATTEMPTS   = 10;   // máximo de tentativas na janela
private const WINDOW_SECONDS = 60;   // duração da janela em segundos
```

### Fluxo de rate limiting

```
Requisição POST /api/v1/auth/login
    │
    ▼
1. Obtém IP do cliente: $request->getIPAddress()
    │
    ▼
2. Monta chave do cache: 'login_attempts_' . md5($ip)
    │
    ▼
3. CI4 Throttler::check($cacheKey, 10, 60)
    │
    ├── Dentro do limite → passa para o controller (login é processado)
    │
    └── Limite atingido →
            $retryAfter = WINDOW_SECONDS - $throttler->getTokenTime()
            HTTP 429 + header Retry-After: {segundos}
```

### Resposta 429 — Limite atingido

```json
{
  "statusCode": 429,
  "message": "Muitas tentativas de login. Aguarde 42 segundos.",
  "success": false,
  "data": null,
  "retry_after": 42
}
```

**Header da resposta:**

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 42
Content-Type: application/json
```

### Por que rate limiting no login?

Sem esse filtro, um atacante pode fazer milhares de tentativas de senha por segundo (ataque de força bruta). O filtro limita a 10 tentativas/minuto por IP, tornando ataques automatizados inviáveis.

---

## 6. Registro em Config/Filters.php

**Arquivo:** `src/app/Config/Filters.php`

### Passo 1 — Aliases

Cada filtro recebe um alias curto para ser referenciado no restante da configuração:

```php
public array $aliases = [
    // ... filtros do CI4 ...
    'authFilter'     => AuthFilter::class,
    'loginRateLimit' => LoginRateLimitFilter::class,
];
```

### Passo 2 — Aplicação global (authFilter)

O `authFilter` é aplicado **antes de toda requisição** via `$globals['before']`. A chave `except` lista as rotas públicas que ficam fora da autenticação:

```php
public array $globals = [
    'before' => [
        'cors',
        'authFilter' => [
            'except' => [
                '/',
                'api/v1/auth/login',
                'api/v1/user-management/create',
                'api/v1/user-customer/create',
                'api/v1/user-customer/upload-avatar*',
                'api/v1/user-customer_files/create',
                'api/v1/auth/recover-password',
                'api/v1/auth/reset-password',
                'api/v1/auth/refresh',
            ],
        ],
    ],
    'after' => ['cors'],
];
```

### Passo 3 — Aplicação por URI (loginRateLimit)

O `loginRateLimit` é aplicado **somente** ao padrão `api/v1/auth/login` via `$filters`:

```php
public array $filters = [
    'loginRateLimit' => [
        'before' => ['api/v1/auth/login'],
    ],
];
```

---

## 7. Rotas Públicas (sem autenticação)

As seguintes rotas **não exigem** o header `Authorization`:

| Rota                                       | Motivo                         |
| ------------------------------------------ | ------------------------------ |
| `/`                                        | Página inicial / health check  |
| `POST api/v1/auth/login`                   | Login — onde o token é obtido  |
| `POST api/v1/auth/recover-password`        | Solicitar recuperação de senha |
| `POST api/v1/auth/reset-password`          | Redefinir senha com token      |
| `POST api/v1/auth/refresh`                 | Renovar token expirado         |
| `POST api/v1/user-management/create`       | Criar conta de usuário         |
| `POST api/v1/user-customer/create`         | Criar perfil de cliente        |
| `POST api/v1/user-customer/upload-avatar*` | Upload de avatar (curinga `*`) |
| `POST api/v1/user-customer_files/create`   | Upload de arquivo do cliente   |

> Qualquer outra rota **exige** o header `Authorization: Bearer {token}`.

---

## 8. Fluxo Completo de uma Requisição Protegida

Exemplo: `GET /api/v1/mec/vehicle-brand/get-all`

```
Cliente
    │  GET /api/v1/mec/vehicle-brand/get-all
    │  Authorization: Bearer eyJ0eXA...
    ▼
CI4 — $required['before']
    │  cors (CORS preflight)
    │  pagecache
    ▼
CI4 — $globals['before']
    │  cors
    │  authFilter → rota NÃO está em 'except' → executa validação
    │      ├── header Authorization presente? ✅
    │      ├── JwtHelper::decode(token) → válido? ✅
    │      └── cache jwt_revoked_? → não encontrado ✅
    ▼
Controller — VehicleBrandController::getAll()
    │  $this->processor->getAll($pagination)
    ▼
CI4 — $required['after']
    │  pagecache, performance, toolbar, cors
    ▼
HTTP 200 — JSON com data[] + pagination{}
```

---

## 8. Fluxo Completo — Tentativa de Login com Rate Limit

Exemplo: `POST /api/v1/auth/login` (11ª tentativa no mesmo minuto)

```
Cliente
    │  POST /api/v1/auth/login
    ▼
CI4 — $required['before']
    │  cors, pagecache
    ▼
CI4 — $globals['before']
    │  cors
    │  authFilter → rota está em 'except' → PULA (não valida JWT)
    ▼
CI4 — $filters['before'] (por URI)
    │  loginRateLimit → padrão 'api/v1/auth/login' → executa
    │      ├── IP: 203.0.113.42
    │      ├── cache key: 'login_attempts_' . md5('203.0.113.42')
    │      └── Throttler::check → 11 > 10 → BLOQUEADO
    │
    └── Retorna HTTP 429 (controller NÃO é chamado)
```

---

## 9. Como criar um novo Filtro

Siga o padrão do projeto em 4 passos:

### Passo 1 — Criar a classe do filtro

```php
<?php

namespace App\Filters\V1\UserManagement;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class MeuFiltro implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // Lógica de validação
        // Se deve bloquear, retorne uma ResponseInterface:
        if ($condicaoDeBloqueo) {
            return service('response')
                ->setStatusCode(403)
                ->setContentType('application/json')
                ->setBody(json_encode([
                    'statusCode' => 403,
                    'message'    => 'Acesso negado',
                    'success'    => false,
                    'data'       => null,
                ]));
        }
        // Se não bloquear, não retorne nada (ou retorne $request)
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Sem ação pós-resposta (deixe vazio se não precisar)
    }
}
```

### Passo 2 — Registrar o alias em Config/Filters.php

```php
public array $aliases = [
    // ...
    'meuFiltro' => MeuFiltro::class,
];
```

### Passo 3 — Aplicar o filtro

**Opção A — Global (todas as rotas, com exceções):**

```php
public array $globals = [
    'before' => [
        'meuFiltro' => ['except' => ['rota/publica']],
    ],
];
```

**Opção B — Por URI específica:**

```php
public array $filters = [
    'meuFiltro' => [
        'before' => ['api/v1/modulo/rota-especifica'],
    ],
];
```

**Opção C — Por método HTTP:**

```php
public array $methods = [
    'POST' => ['meuFiltro'],
];
```

### Passo 4 — Adicionar o `use` no topo do Filters.php

```php
use App\Filters\V1\UserManagement\MeuFiltro;
```

---

## 10. Erros Comuns

| Erro                                           | Causa                                                                       | Solução                                                                                  |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| HTTP 401 em rota que deveria ser pública       | Rota não está na lista `except` do `authFilter`                             | Adicionar a rota em `$globals['before']['authFilter']['except']` em `Config/Filters.php` |
| HTTP 401 mesmo com token válido                | Token foi revogado no logout e está no cache                                | Fazer login novamente para obter um novo token                                           |
| HTTP 401 `Token de autenticação não informado` | Header `Authorization` ausente ou sem prefixo `Bearer `                     | Enviar `Authorization: Bearer {token}` na requisição                                     |
| HTTP 429 durante testes                        | IP atingiu 10 tentativas em 60 segundos                                     | Aguardar 60 segundos ou limpar o cache de rate limit                                     |
| Filtro não executa                             | Alias não registrado em `$aliases` ou não aplicado em `$globals`/`$filters` | Verificar os dois locais em `Config/Filters.php`                                         |
| `Cannot use ... as FilterInterface`            | Classe não implementa `FilterInterface`                                     | Adicionar `implements FilterInterface` na declaração da classe                           |

---

## 11. Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
