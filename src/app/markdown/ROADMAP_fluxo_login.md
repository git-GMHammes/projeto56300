# ROADMAP — Módulo de Autenticação (AuthUser)

> **Público-alvo:** Desenvolvedor júnior que está estudando o sistema do zero.
> **Objetivo:** Entender completamente como funciona o login, logout, recuperação de senha e renovação de token — do banco de dados até a resposta HTTP.

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [Visão Geral do Módulo](#1-visão-geral-do-módulo)
2. [Diagrama ASCII — Tabelas e Relacionamentos](#2-diagrama-ascii--tabelas-e-relacionamentos)
3. [Diagrama ASCII — Fluxo de Login passo a passo](#3-diagrama-ascii--fluxo-de-login-passo-a-passo)
4. [Documentação dos Endpoints](#4-documentação-dos-endpoints)
5. [Arquitetura de Classes](#5-arquitetura-de-classes)
6. [Regras de Segurança — O Porquê de Cada Decisão](#6-regras-de-segurança--o-porquê-de-cada-decisão)
7. [Armadilhas Comuns — Bugs Reais (sessão 09/05/2026)](#7-armadilhas-comuns--bugs-reais-sessão-09052026)
8. [Glossário](#8-glossário)

---

## 1. Visão Geral do Módulo

O módulo **AuthUser** é o portão de entrada de todo o sistema. Ele é responsável por:

- **Autenticar** o usuário (verificar login e senha) e emitir um **JWT** de 10 horas.
- **Renovar** o JWT expirado sem forçar novo login, usando um **refresh token** de 7 dias.
- **Encerrar** a sessão do usuário (logout), revogando o JWT imediatamente via cache.
- **Recuperar** senhas esquecidas por e-mail em 3 passos seguros.

O sistema usa arquitetura **SaaS multi-tenant**: cada usuário pertence a uma ou mais empresas (tenants). O tenant é informado no login, e toda a autenticação considera esse vínculo.

### Onde fica o código?

```
src/app/
├── Controllers/Api/V1/User/AuthUser/
│   └── ResourceViewController.php           ← Recebe HTTP, valida request, chama Processor
│
├── Services/V1/User/AuthUser/
│   ├── Processor.php                        ← Toda a lógica de autenticação e senha
│   └── RefreshProcessor.php                 ← Exclusivo para renovar o access token
│
├── Models/V1/User/
│   ├── AuthUser/SqlViewModel.php            ← Leitura da view_auth_user (read-only)
│   ├── UserManagement/SqlTableModel.php     ← Escrita em user_001_management
│   ├── UserPasswordResets/SqlTableModel.php ← Escrita em user_006_password_resets
│   └── UserRefreshTokens/SqlTableModel.php  ← Escrita em user_007_refresh_tokens
│
├── Requests/V1/User/AuthUser/
│   ├── LoginRequest.php
│   ├── RecoverPasswordRequest.php
│   ├── ResetPasswordRequest.php
│   └── RefreshRequest.php
│
├── Filters/V1/UserManagement/
│   └── AuthFilter.php                       ← Middleware JWT (intercepta todas as rotas)
│
├── Libraries/
│   └── JwtHelper.php                        ← Gera e valida tokens JWT (HMAC-SHA256)
│
└── Config/Routes/Api/v1/User/AuthUser/
    └── EndPointView.php                     ← Definição das rotas do módulo
```

---

## 2. Diagrama ASCII — Tabelas e Relacionamentos

Estas são as **6 tabelas físicas** do módulo de usuários, mais a **view** que une as principais:

```
┌─────────────────────────────────┐
│    user_001_management          │ ← Credenciais de login
│─────────────────────────────────│
│ id (PK)                         │
│ uuid                            │
│ user          ← login digitado  │
│ password      ← hash bcrypt     │
│ last_login                      │
│ created_at / updated_at         │
│ deleted_at    ← soft delete     │
└──────────────┬──────────────────┘
               │ 1:1 (user_002.user_id = user_001.id)
               ▼
┌─────────────────────────────────┐
│    user_002_customer            │ ← Perfil estendido do usuário
│─────────────────────────────────│
│ id (PK)                         │
│ user_id (FK → user_001.id)      │
│ name          ← nome completo   │
│ cpf                             │
│ mail          ← e-mail          │
│ whatsapp / phone                │
│ address / zip_code              │
│ profile                         │
│ created_at / updated_at         │
│ deleted_at                      │
└──────────────┬──────────────────┘
               │ N:N via user_005_tenants
               ▼
┌─────────────────────────────────┐        ┌──────────────────────────────┐
│    user_005_tenants             │ ──────►│    user_004_saas_tenants     │
│─────────────────────────────────│        │──────────────────────────────│
│ id (PK)                         │        │ id (PK)                      │
│ user_id (FK → user_001.id)      │        │ name   ← nome da empresa     │
│ user_saas_tenants_id (FK →      │        │ slug                         │
│   user_004_saas_tenants.id)     │        │ plan                         │
│ role          ← papel no tenant │        │ active                       │
│ deleted_at                      │        └──────────────────────────────┘
└─────────────────────────────────┘

┌────────────────────────────────────┐
│    user_006_password_resets        │ ← Tokens de recuperação de senha
│────────────────────────────────────│
│ id (PK)                            │
│ user_id (FK → user_001.id)         │
│ token_hash    ← SHA-256 do token   │
│ expires_at    ← validade 1h        │
│ used_at       ← preenchido ao usar │
│ ip_address / user_agent            │
│ created_at / updated_at            │
│ deleted_at                         │
└────────────────────────────────────┘

┌───────────────────────────────────────┐
│    user_007_refresh_tokens            │ ← Refresh tokens para renovar JWT
│───────────────────────────────────────│
│ id (PK)                               │
│ user_id (FK → user_001.id)            │
│ user_saas_tenants_id (FK →            │
│   user_004_saas_tenants.id)           │
│ token_hash    ← SHA-256 do token      │
│ expires_at    ← validade 7d           │
│ used_at       ← preenchido na rotação │
│ ip_address / user_agent               │
│ created_at / updated_at               │
│ deleted_at                            │
└───────────────────────────────────────┘

╔════════════════════════════════════╗
║    view_auth_user                  ║ ← VIEW (JOIN de user_001 + user_002 + user_005)
║════════════════════════════════════║
║ Prefixo um_ = user_001_management  ║
║ Prefixo uc_ = user_002_customer    ║
║ Prefixo ut_ = user_005_tenants     ║
║                                    ║
║ Usada SOMENTE para leitura.        ║
║ O Processor NUNCA escreve na view  ║
╚════════════════════════════════════╝
```

> ⚠️ **Importante:** Não existe `user_003`. O prefixo salta de `user_002` para `user_004` por design do projeto.

### Campos da view_auth_user

| Campo                     | Origem                                | Descrição                           |
| ------------------------- | ------------------------------------- | ----------------------------------- |
| `id`                      | user_002_customer.id                  | PK da view (= uc_user_id)           |
| `um_user`                 | user_001_management.user              | Login do usuário                    |
| `um_password`             | user_001_management.password          | Hash bcrypt (hidden nas respostas)  |
| `um_is_active`            | user_001_management.is_active         | 1 = ativo, 0 = bloqueado            |
| `uc_user_id`              | user_002_customer.id                  | ID do perfil                        |
| `uc_name`                 | user_002_customer.name                | Nome completo                       |
| `uc_cpf`                  | user_002_customer.cpf                 | CPF sem máscara                     |
| `uc_mail`                 | user_002_customer.mail                | E-mail                              |
| `uc_whatsapp`             | user_002_customer.whatsapp            | WhatsApp sem máscara                |
| `uc_phone`                | user_002_customer.phone               | Telefone sem máscara                |
| `ut_user_saas_tenants_id` | user_005_tenants.user_saas_tenants_id | ID do tenant atual                  |
| `ut_deleted_at`           | user_005_tenants.deleted_at           | Indica se vínculo com tenant existe |
| `deleted_at`              | user_001_management.deleted_at        | Soft delete do usuário              |

---

## 3. Diagrama ASCII — Fluxo de Login passo a passo

```
CLIENTE (app mobile/web)              SERVIDOR (CodeIgniter 4)
        │                                       │
        │  POST /api/v1/auth/login              │
        │  Body: { um_user, um_password,        │
        │          ut_user_saas_tenants_id }    │
        │──────────────────────────────────────►│
        │                                       │
        │                          ┌────────────┴──────────────┐
        │                          │  AuthFilter (middleware)  │
        │                          │  ROTA PÚBLICA → ignora    │
        │                          └────────────┬──────────────┘
        │                                       │
        │                          ┌────────────┴───────────────┐
        │                          │  ResourceViewController    │
        │                          │  1. Lê body JSON           │
        │                          │  2. Valida via LoginRequest│
        │                          │     - um_user obrigatório  │
        │                          │     - um_password obrig.   │
        │                          │     - tenantId > 0         │
        │                          └────────────┬───────────────┘
        │                                       │ chama Processor.authenticate()
        │                          ┌────────────┴──────────────────┐
        │                          │  Processor                    │
        │                          │  3. Sanitiza strings          │
        │                          │  4. Consulta view_auth_user   │
        │                          │     WHERE um_user = ?         │
        │                          │     AND tenant_id = ?         │
        │                          │     AND um_is_active = 1      │
        │                          │     AND deleted_at IS NULL    │
        │                          │  5. password_verify()         │
        │                          │     (bcrypt comparison)       │
        │                          │  6. Gera JWT 10h              │
        │                          │     payload: sub, cpf, iat    │
        │                          │  7. Gera refresh token 7d     │
        │                          │     (64 bytes hex aleatório)  │
        │                          │  8. Salva refresh token       │
        │                          │     em user_007 (hash SHA-256)│
        │                          └────────────┬──────────────────┘
        │                                       │
        │  HTTP 200 OK                          │
        │  { token, token_type, expires_in,     │
        │    refresh_token, refresh_expires_in, │
        │    user: { dados da view } }          │
        │◄──────────────────────────────────────│
        │                                       │
        │  (guarda token e refresh_token)       │
        │                                       │

    --- PRÓXIMAS REQUISIÇÕES (rotas protegidas) ---

        │  GET /api/v1/qualquer-recurso         │
        │  Authorization: Bearer eyJ...         │
        │──────────────────────────────────────►│
        │                          ┌────────────┴───────────────┐
        │                          │  AuthFilter                │
        │                          │  a) Extrai token do header │
        │                          │  b) Decodifica JWT         │
        │                          │  c) Verifica assinatura    │
        │                          │  d) Verifica expiração     │
        │                          │  e) Verifica blocklist     │
        │                          │     (cache revogado?)      │
        │                          │  OK → passa ao controller  │
        │                          └────────────┬───────────────┘
        │                                       │
        │  (resposta normal do recurso)         │
        │◄──────────────────────────────────────│
```

---

## 4. Documentação dos Endpoints

### Base URL

```
POST/GET http://localhost:56300/index.php/api/v1/auth/{endpoint}
```

---

### 4.1 POST /api/v1/auth/login

**Descrição:** Autentica o usuário com login, senha e tenant. Retorna JWT de 10h e refresh token de 7d.

**Rota pública:** SIM (sem Authorization header)

#### Request Body

```json
{
  "um_user": "gustavo",
  "um_password": "Senha@123",
  "ut_user_saas_tenants_id": 1
}
```

| Campo                     | Tipo    | Obrigatório | Validação            |
| ------------------------- | ------- | ----------- | -------------------- |
| `um_user`                 | string  | SIM         | Não pode ser vazio   |
| `um_password`             | string  | SIM         | Não pode ser vazio   |
| `ut_user_saas_tenants_id` | integer | SIM         | Deve ser maior que 0 |

#### Fluxo interno (passo a passo)

1. Controller recebe o JSON e passa pelo `LoginRequest` (validação de campos)
2. Se inválido → retorna 422 com detalhes dos erros
3. Chama `Processor::authenticate($user, $password, $tenantId)`
4. Processor sanitiza os strings (trim, remove caracteres perigosos)
5. Consulta `view_auth_user` filtrando por `um_user`, `ut_user_saas_tenants_id`, `um_is_active = 1` e `deleted_at IS NULL`
6. Se não encontrado → `InvalidArgumentException('Credenciais inválidas')` → retorna 401
7. Executa `password_verify($password, $record['um_password'])` (verifica bcrypt)
8. Se senha errada → mesma exceção "Credenciais inválidas" (não revela qual campo está errado)
9. Gera JWT com `JwtHelper::encode(['sub' => id, 'cpf' => cpf], 36000)`
10. Gera refresh token: `bin2hex(random_bytes(32))` = 64 chars hexadecimais
11. Salva na tabela `user_007_refresh_tokens` o **hash SHA-256** do refresh token (nunca o plain)
12. Retorna response com token, dados do usuário (sem a senha)

#### Response 200 — Sucesso

```json
{
  "statusCode": 200,
  "message": "Autenticacao realizada com sucesso",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 36000,
    "refresh_token": "a3f2b1c8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
    "refresh_expires_in": 604800,
    "user": {
      "id": 1,
      "um_user": "gustavo",
      "um_is_active": 1,
      "uc_user_id": 1,
      "uc_name": "Gustavo Hammes",
      "uc_cpf": "12345678900",
      "uc_mail": "gustavo@email.com",
      "uc_whatsapp": "51999999999",
      "ut_user_saas_tenants_id": 1
    }
  }
}
```

> ⚠️ **Nota:** O campo `um_password` NUNCA aparece no response. Ele é removido via `unset()` no Processor antes de montar o retorno.

#### Responses de Erro

| HTTP | Motivo                                                                    |
| ---- | ------------------------------------------------------------------------- |
| 401  | Usuário não encontrado, sem vínculo ao tenant, inativo ou senha incorreta |
| 422  | Campos obrigatórios ausentes ou inválidos                                 |
| 500  | Erro interno inesperado                                                   |

```json
// 401 — Credenciais inválidas
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "success": false,
  "data": null
}

// 422 — Validação
{
  "statusCode": 422,
  "message": "Erro de validação",
  "success": false,
  "data": {
    "um_user": "O campo um_user é obrigatório.",
    "ut_user_saas_tenants_id": "O campo ut_user_saas_tenants_id deve ser um número inteiro positivo."
  }
}
```

---

### 4.2 POST /api/v1/auth/logout

**Descrição:** Encerra a sessão do usuário. Revoga o JWT no cache e invalida todos os refresh tokens ativos.

**Rota pública:** NÃO (requer `Authorization: Bearer <token>`)

#### Request

Sem body. O token é extraído automaticamente do header `Authorization`.

```http
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Fluxo interno (passo a passo)

1. `AuthFilter` valida o token antes do controller executar
2. Controller extrai o token do header: `substr($authHeader, 7)` (remove "Bearer ")
3. Chama `Processor::logout($token)`
4. Processor chama `JwtHelper::decode($token)` para obter o payload (e validar novamente)
5. Calcula o tempo restante do token: `TTL = exp - time()`
6. Salva no cache: `cache()->save('jwt_revoked_' . sha256(token), true, TTL)`
   - A partir deste momento, o AuthFilter rejeita esse token mesmo que ainda não expirou
7. Revoga todos os refresh tokens ativos do usuário: `refreshModel->revokeByUserId($userId)`
   - Isso preenche `used_at` em todos os registros pendentes de `user_007`
8. Retorna confirmação

> ⚠️ **Por que usar o cache ao invés de apagar o JWT?** O JWT é stateless por natureza — uma vez emitido, não há como "cancelá-lo" na spec. A blocklist em cache é o padrão adotado para logout sem consulta ao banco em cada requisição.

#### Response 200 — Sucesso

```json
{
  "statusCode": 200,
  "message": "Logout realizado com sucesso",
  "success": true,
  "data": {
    "user_id": 1
  }
}
```

#### Responses de Erro

| HTTP | Motivo                              |
| ---- | ----------------------------------- |
| 401  | Token ausente, inválido ou expirado |
| 500  | Erro interno inesperado             |

---

### 4.3 POST /api/v1/auth/recover-password

**Descrição:** Passo 1 da recuperação de senha. Recebe o e-mail do usuário, gera um token seguro e envia o link de reset por SMTP.

**Rota pública:** SIM

#### Request Body

```json
{
  "uc_mail": "gustavo@email.com"
}
```

| Campo     | Tipo   | Obrigatório | Validação     |
| --------- | ------ | ----------- | ------------- |
| `uc_mail` | string | SIM         | E-mail válido |

#### Fluxo interno (passo a passo)

1. Valida via `RecoverPasswordRequest`
2. Chama `Processor::sendRecoveryEmail($mail)`
3. Busca usuário na `view_auth_user` pelo `uc_mail` (apenas `deleted_at IS NULL`, **não exige** `is_active = 1`)
4. Se não encontrado → `InvalidArgumentException('E-mail não encontrado')` → retorna 404
5. Invalida tokens de reset anteriores desse usuário: `resetModel->softDeleteActiveByUserId($userId)`
   - Isso faz soft delete nos tokens ainda não usados — evita tokens órfãos pendentes
6. Gera token seguro: `bin2hex(random_bytes(32))` = 64 chars hex (criptograficamente aleatório)
7. Gera hash do token: `hash('sha256', $token)` — só o hash é salvo no banco
8. Salva em `user_006_password_resets`: hash, `expires_at` (1 hora), IP, User-Agent
9. Renderiza o template HTML `emails/recovery_password` com o token **plain** no link
10. Envia por SMTP usando as credenciais de `config('Email')->recoveryEmail`
11. Retorna confirmação com nome, e-mail e validade

> ⚠️ **Por que só o hash do token é salvo no banco?** Se o banco for comprometido, o atacante não consegue usar os hashes para resetar senhas — precisaria do token plain, que só foi enviado por e-mail ao dono da conta.

#### Response 200 — Sucesso

```json
{
  "statusCode": 200,
  "message": "E-mail de recuperação enviado com sucesso",
  "success": true,
  "data": {
    "uc_mail": "gustavo@email.com",
    "uc_name": "Gustavo Hammes",
    "expires_at": "2026-05-09 23:30:00"
  }
}
```

#### Responses de Erro

| HTTP | Motivo                           |
| ---- | -------------------------------- |
| 404  | E-mail não encontrado no sistema |
| 422  | Campo `uc_mail` inválido         |
| 500  | Falha ao salvar ou enviar e-mail |

---

### 4.4 GET /api/v1/auth/reset-password/{token}

**Descrição:** Passo 2 da recuperação de senha. Valida se o token do link de e-mail ainda é válido (não expirado, não usado). Use este endpoint **antes** de exibir o formulário de nova senha.

**Rota pública:** SIM

#### Request

```http
GET /api/v1/auth/reset-password/a3f2b1c8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1
```

| Parâmetro | Tipo   | Obrigatório | Descrição                       |
| --------- | ------ | ----------- | ------------------------------- |
| `{token}` | string | SIM         | Token de 64 chars vindo do link |

#### Fluxo interno (passo a passo)

1. Controller chama diretamente `Processor::validateResetToken($token)` (sem validação de body)
2. Processor sanitiza o token
3. Gera hash: `hash('sha256', $token)`
4. Consulta `user_006_password_resets` onde `token_hash = ?` AND `used_at IS NULL` AND `expires_at > NOW()` AND `deleted_at IS NULL`
5. Se não encontrado → `InvalidArgumentException('Token inválido, expirado ou já utilizado')` → retorna 422
6. Se válido → retorna os dados do registro (sem expor o hash)

#### Response 200 — Token válido

```json
{
  "statusCode": 200,
  "message": "Token válido",
  "success": true,
  "data": {
    "id": 42,
    "user_id": 1,
    "expires_at": "2026-05-09 23:30:00"
  }
}
```

#### Responses de Erro

| HTTP | Motivo                               |
| ---- | ------------------------------------ |
| 422  | Token inválido, já usado ou expirado |
| 500  | Erro interno inesperado              |

---

### 4.5 POST /api/v1/auth/reset-password

**Descrição:** Passo 3 da recuperação de senha. Recebe o token e a nova senha, valida o token novamente, aplica bcrypt na senha e marca o token como usado (não pode ser reutilizado).

**Rota pública:** SIM

#### Request Body

```json
{
  "token": "a3f2b1c8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
  "password": "NovaSenha@456",
  "password_confirm": "NovaSenha@456"
}
```

| Campo              | Tipo   | Obrigatório | Validação                    |
| ------------------ | ------ | ----------- | ---------------------------- |
| `token`            | string | SIM         | Exatamente 64 chars          |
| `password`         | string | SIM         | Mínimo 8 caracteres          |
| `password_confirm` | string | SIM         | Deve ser igual ao `password` |

#### Fluxo interno (passo a passo)

1. Valida via `ResetPasswordRequest`
2. Chama `Processor::applyPasswordReset($token, $password)`
3. Processor busca novamente o token na tabela (`findActiveByTokenHash`) — **segunda validação intencional**
4. Se não encontrado → 422
5. Extrai `user_id` do registro
6. Verifica se o usuário ainda existe: `userModel->find($userId)`
7. Atualiza a senha: `userModel->update($userId, ['password' => password_hash($password, PASSWORD_BCRYPT)])`
8. Marca o token como usado: `resetModel->markAsUsed($resetId)` (preenche `used_at`)
9. Retorna o `user_id` do usuário que teve a senha redefinida

> ⚠️ **Por que validar o token de novo no Passo 3?** Entre o GET (passo 2) e o POST (passo 3) pode haver uma janela de tempo. Outro processo pode ter invalidado o token (ex: o usuário clicou "esqueci minha senha" de novo). A segunda validação garante atomicidade.

#### Response 200 — Sucesso

```json
{
  "statusCode": 200,
  "message": "Senha redefinida com sucesso",
  "success": true,
  "data": {
    "user_id": 1
  }
}
```

#### Responses de Erro

| HTTP | Motivo                                                |
| ---- | ----------------------------------------------------- |
| 422  | Token inválido/expirado/usado, ou validação de campos |
| 500  | Falha ao atualizar a senha                            |

---

### 4.6 POST /api/v1/auth/refresh

**Descrição:** Renova o access token (JWT) usando o refresh token. O refresh token antigo é **revogado** e um novo par (access + refresh) é emitido. Isso chama-se **rotação de refresh token**.

**Rota pública:** SIM (o access token pode estar expirado — é exatamente o motivo de usar este endpoint)

#### Request Body

```json
{
  "refresh_token": "a3f2b1c8d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1"
}
```

| Campo           | Tipo   | Obrigatório | Validação           |
| --------------- | ------ | ----------- | ------------------- |
| `refresh_token` | string | SIM         | Exatamente 64 chars |

#### Fluxo interno (passo a passo)

1. Valida via `RefreshRequest`
2. Controller instancia `RefreshProcessor` e chama `refresh($refreshToken)`
3. Gera hash SHA-256 do token recebido
4. Consulta `user_007_refresh_tokens` onde `token_hash = ?` AND `used_at IS NULL` AND `expires_at > NOW()` AND `deleted_at IS NULL`
5. Se não encontrado → `InvalidArgumentException` → 401
6. **Marca o refresh token atual como usado** (`markAsUsed`) — a partir daqui ele não pode ser reutilizado
7. Busca o usuário na `view_auth_user` pelo `user_id` + `tenant_id` do registro — confirma que ainda está ativo
8. Gera novo JWT: `JwtHelper::encode(['sub' => userId, 'cpf' => cpf], 36000)`
9. Gera novo refresh token: `bin2hex(random_bytes(32))` e salva hash SHA-256 em `user_007`
10. Retorna novo access token + novo refresh token

> ⚠️ **Por que o refresh token é de uso único (rotação)?** Se um atacante roubar o refresh token, ao usá-lo o refresh será revogado. Da próxima vez que o usuário legítimo tentar renovar, o token já estará marcado como usado — sinal de ataque. Isso limita a janela de exploração.

#### Response 200 — Sucesso

```json
{
  "statusCode": 200,
  "message": "Token renovado com sucesso",
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 36000,
    "refresh_token": "b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8",
    "refresh_expires_in": 604800
  }
}
```

#### Responses de Erro

| HTTP | Motivo                                                   |
| ---- | -------------------------------------------------------- |
| 401  | Refresh token inválido, expirado ou já utilizado         |
| 422  | Campo `refresh_token` inválido ou com comprimento errado |
| 500  | Erro interno inesperado                                  |

---

## 5. Arquitetura de Classes

### Hierarquia de herança

```
CodeIgniter\Model
    └── BaseTableModel            ← soft delete, timestamps, paginação, campos hidden
            └── SqlTableModel     ← (UserManagement, PasswordResets, RefreshTokens)
                                     Define: $DBGroup, $table, $allowedFields, $hidden

CodeIgniter\Model
    └── BaseViewModel             ← read-only, paginação, busca textual, agrupamento
            └── SqlViewModel      ← (AuthUser) Define: $DBGroup = view_auth_user
                                     Expõe: findByUser, findByUserAndTenant, findByMail, findByIdAndTenant

BaseViewService                   ← sanitização, remoção de máscaras, paginação
    └── Processor                 ← toda a lógica de autenticação
    └── RefreshProcessor          ← exclusivo para renovação de tokens

BaseResourceViewController        ← 8 endpoints REST de leitura genéricos
    └── ResourceViewController    ← endpoints de autenticação + herda os de leitura
```

### Por que essa separação?

| Camada            | Responsabilidade única                                   |
| ----------------- | -------------------------------------------------------- |
| Controller        | HTTP in → validar request → chamar service → HTTP out    |
| Processor/Service | Toda a lógica de negócio (sem conhecer Request/Response) |
| Model de leitura  | Consultas SQL em views (nunca INSERT/UPDATE/DELETE)      |
| Model de escrita  | CRUD nas tabelas físicas                                 |
| Request           | Define regras de validação dos campos da requisição      |
| Filter            | Intercepta e valida JWT antes do controller executar     |

### Ciclo de vida de uma requisição autenticada

```
HTTP Request
    → AuthFilter.before()     — valida JWT ou bloqueia com 401
    → Controller.metodo()     — valida body via Request
    → Processor.metodo()      — executa lógica de negócio
        → SqlViewModel        — lê dados da view (SELECT)
        → SqlTableModel       — escreve dados (INSERT/UPDATE)
        → JwtHelper           — gera ou decodifica token
    ← Controller monta response padronizado
HTTP Response
```

---

## 6. Regras de Segurança — O Porquê de Cada Decisão

### 6.1 bcrypt para senhas

**O quê:** `password_hash($password, PASSWORD_BCRYPT)` para armazenar, `password_verify()` para comparar.

**Por quê:** bcrypt é lento por design (custo configurável). Isso dificulta ataques de força bruta offline. Se o banco vazar, o atacante levaria anos para quebrar as senhas. MD5 ou SHA simples seriam quebrados em horas.

### 6.2 SHA-256 para tokens de reset e refresh

**O quê:** `hash('sha256', $token)` — apenas o hash é salvo no banco.

**Por quê:** O token plain é enviado por e-mail / retornado ao cliente UMA VEZ. Se o banco vazar, os hashes não podem ser revertidos ao token original. O atacante precisaria do e-mail do usuário para ter o link.

### 6.3 Blocklist de JWT no cache (logout)

**O quê:** `cache()->save('jwt_revoked_' . sha256(token), true, TTL)`

**Por quê:** JWT é stateless — uma vez emitido, continua válido até expirar. Sem blocklist, fazer logout seria impossível. O cache evita consulta ao banco em cada requisição (performance). A chave expira automaticamente quando o JWT expiraria.

### 6.4 Rotação de refresh token

**O quê:** A cada renovação, o refresh token antigo é marcado como `used_at` e um novo é emitido.

**Por quê:** Se um refresh token for roubado, o uso pelo atacante invalida o token. Na próxima tentativa do usuário legítimo, o token já estará usado — sinal de comprometimento. Sem rotação, um token roubado seria válido por 7 dias inteiros.

### 6.5 is_active obrigatório nas consultas

**O quê:** Toda consulta de autenticação inclui `AND um_is_active = 1`.

**Por quê:** Permite desativar um usuário sem deletá-lo. Contas comprometidas ou inativas são bloqueadas imediatamente sem perda de histórico.

### 6.6 Isolamento por tenant

**O quê:** O login exige `ut_user_saas_tenants_id` e a query filtra também pelo tenant.

**Por quê:** Um usuário pode existir em múltiplos tenants com papéis diferentes. Sem o filtro, um usuário do Tenant A poderia se autenticar como se fosse do Tenant B, acessando dados de outra empresa.

### 6.7 Soft delete sempre

**O quê:** `deleted_at IS NOT NULL` filtra registros excluídos. Nunca se usa `DELETE FROM`.

**Por quê:** Permite auditoria completa de quem criou/deletou e quando. Registros de tokens de reset/refresh precisam ser mantidos para análise forense em casos de ataque.

### 6.8 IP address e User-Agent nos tokens

**O quê:** `ip_address` e `user_agent` são gravados ao criar refresh tokens e tokens de reset.

**Por quê:** Em caso de incidente de segurança, é possível rastrear de onde vieram as requisições suspeitas.

### 6.9 Resposta genérica em erro de login

**O quê:** A mensagem é sempre "Credenciais inválidas" — nunca "usuário não encontrado" ou "senha incorreta".

**Por quê:** Mensagens específicas revelam ao atacante se um usuário existe ou não, facilitando ataques de enumeração de contas.

---

## 7. Armadilhas Comuns — Bugs Reais (sessão 09/05/2026)

Esta seção documenta 3 bugs reais encontrados e corrigidos. Estude cada um para não repeti-los.

---

### Bug 1 — `$DBGroup` não declarado no Model → HTTP 500

**Sintoma:** Qualquer endpoint que usasse o novo Model retornava HTTP 500 imediatamente, sem mensagem de erro clara.

**Causa raiz:** A classe `BaseTableModel` não define `$DBGroup`. Cada Model filho **obrigatoriamente** deve declarar qual grupo de banco de dados usar. Sem isso, o CodeIgniter usa a conexão `default`, que pode não ser a correta — ou pior, pode não existir no ambiente.

**Código incorreto:**

```php
class SqlTableModel extends BaseTableModel
{
    // ⚠️ FALTANDO: protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_007_refresh_tokens';
    // ...
}
```

**Código correto:**

```php
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001; // ← SEMPRE na primeira linha após class
    protected $table   = 'user_007_refresh_tokens';
    // ...
}
```

**Regra:** Sempre declare `$DBGroup` como **primeira propriedade** do Model. Isso vale para `SqlTableModel` e `SqlViewModel`.

---

### Bug 2 — `is_active` fora de `$allowedFields` → usuários nascem inativos

**Sintoma:** Usuário era criado com sucesso, mas ao tentar logar recebia "Credenciais inválidas". O campo `um_is_active` estava como `0` no banco, mesmo passando `is_active: 1` na requisição.

**Causa raiz:** O `$allowedFields` do CodeIgniter é uma lista de campos que o Model **permite inserir ou atualizar**. Se um campo não estiver na lista, o Model simplesmente o ignora — sem erro, sem aviso. O banco usa o valor default da coluna (`0` = inativo).

**Código incorreto:**

```php
protected $allowedFields = [
    'uuid',
    'user',
    'password',
    'last_login',
    // ⚠️ 'is_active' não estava aqui
];
```

**Código correto:**

```php
protected $allowedFields = [
    'uuid',
    'user',
    'password',
    'is_active', // ← adicionar TODOS os campos que precisam ser gravados
    'last_login',
];
```

**Regra:** Ao criar um novo Model, percorra o DDL da tabela coluna por coluna e verifique se cada campo que pode ser inserido/atualizado está em `$allowedFields`. Não confie apenas nos campos que você usa "agora" — pense nos campos que precisarão ser alterados no futuro.

---

### Bug 3 — `$hidden` tipado em PHP 8.2 → erro fatal de redeclaração

**Sintoma:** A aplicação lançava um erro PHP fatal na inicialização do Model:

```
Cannot redeclare property with a different type in .../SqlTableModel.php
```

**Causa raiz:** O PHP 8.2 introduziu regras mais rígidas sobre redeclaração de propriedades em herança. Se a classe pai (`BaseTableModel`) declara uma propriedade **sem tipo explícito**, a classe filha **não pode** redeclará-la adicionando um tipo.

**Código incorreto (no Model filho):**

```php
class SqlTableModel extends BaseTableModel
{
    protected array $hidden = ['token_hash']; // ← "array" é o problema
}
```

**Código correto (no Model filho):**

```php
class SqlTableModel extends BaseTableModel
{
    protected $hidden = ['token_hash']; // ← sem o tipo "array"
}
```

**Por que o pai não tem tipo?** A `BaseTableModel` herda de `CodeIgniter\Model` que declara `$hidden` sem tipo. Para manter compatibilidade, todos os filhos também devem declará-la sem tipo.

**Regra:** Em filhos de `BaseTableModel` e `BaseViewModel`, declare `$hidden` **sempre sem o tipo explícito**. Use `protected $hidden = [...]` e não `protected array $hidden = [...]`.

---

## 8. Glossário

| Termo                | Significado                                                                                                                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **JWT**              | JSON Web Token. Arquivo texto codificado em Base64 com 3 partes: `header.payload.signature`. Contém quem é o usuário e quando expira. É stateless — o servidor não precisa guardar sessão. |
| **Bearer Token**     | Formato de uso do JWT: o cliente envia `Authorization: Bearer <token>` em toda requisição protegida.                                                                                       |
| **Access Token**     | O JWT de curta duração (10h neste sistema) usado para autenticar requisições.                                                                                                              |
| **Refresh Token**    | String aleatória de longa duração (7d) usada exclusivamente para renovar o access token expirado. Mais seguro que aumentar o TTL do JWT.                                                   |
| **Rotação de Token** | Prática de trocar o refresh token a cada uso — o antigo é invalidado e um novo é emitido. Limita o dano em caso de roubo.                                                                  |
| **Tenant**           | Empresa/organização no modelo SaaS. Cada tenant tem seus próprios dados isolados. Um usuário pode pertencer a múltiplos tenants.                                                           |
| **Soft Delete**      | Excluir logicamente preenchendo `deleted_at` em vez de remover o registro fisicamente do banco.                                                                                            |
| **bcrypt**           | Algoritmo de hash para senhas. Lento por design, com custo configurável. Diferente de SHA — não é reversível e não é rápido.                                                               |
| **SHA-256**          | Função de hash criptográfico de 256 bits. Rápido, mas não adequado para senhas. Usado aqui para tokens (não para senhas).                                                                  |
| **Blocklist**        | Lista negra de tokens revogados. O sistema usa o cache do CodeIgniter para armazenar JWTs que foram deslogados.                                                                            |
| **SMTP**             | Protocolo de envio de e-mail. O sistema usa SMTP autenticado para enviar o link de recuperação de senha.                                                                                   |
| **FK**               | Foreign Key (Chave Estrangeira). Coluna que referencia a chave primária de outra tabela, garantindo integridade referencial.                                                               |
| **View**             | Consulta SQL salva como objeto no banco. A `view_auth_user` une 3 tabelas em uma única consulta simplificada.                                                                              |
| **Payload**          | Parte central do JWT com os dados do usuário: `sub` (user_id), `cpf`, `iat` (emitido em), `exp` (expira em).                                                                               |
| **Claim**            | Cada campo dentro do payload JWT. Ex: `sub` é o claim de sujeito (identificador do usuário).                                                                                               |
| **TTL**              | Time to Live. Tempo de vida de um token ou entrada de cache antes de expirar automaticamente.                                                                                              |
| **HMAC-SHA256**      | Algoritmo de assinatura do JWT neste sistema. Usa uma chave secreta para gerar a assinatura — sem a chave, o token não pode ser forjado.                                                   |
| **password_verify**  | Função PHP que compara uma senha plain com um hash bcrypt. Retorna `true` se corresponderem. Nunca use `==` para comparar senhas.                                                          |
| **sanitizeString**   | Método da `BaseViewService` que aplica `trim()` e remove caracteres potencialmente perigosos antes de usar o valor em queries.                                                             |
| **bin2hex**          | Função PHP que converte bytes aleatórios em representação hexadecimal. `bin2hex(random_bytes(32))` gera 64 chars aleatórios criptograficamente seguros.                                    |
| **$allowedFields**   | Propriedade do CodeIgniter Model que define quais colunas podem ser inseridas ou atualizadas. Campos fora desta lista são silenciosamente ignorados.                                       |
| **$hidden**          | Propriedade do CodeIgniter Model que lista campos que nunca aparecem nos resultados de consulta (ex: `password`, `token_hash`).                                                            |
| **$DBGroup**         | Propriedade que define qual grupo de configuração de banco de dados usar. Obrigatório em todos os Models deste projeto.                                                                    |

---

## 9. Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |

---

_Documento gerado em 09/05/2026 — baseado no código real do módulo AuthUser (Projeto56300)._  
_Para dúvidas ou atualizações, consulte os arquivos em `src/app/Services/V1/User/AuthUser/` e `src/app/Models/V1/User/`._
