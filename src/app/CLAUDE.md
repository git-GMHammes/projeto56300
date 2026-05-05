# CLAUDE.md — Backend (src/app/)

Instruções específicas do backend CodeIgniter 4 / V1.
Carregado automaticamente ao trabalhar em Controllers, Models ou Services.

---

## Arquitetura V1 — Padrão de BASES

Todo recurso da API V1 é construído sobre hierarquia de classes BASE. **Nunca duplicar lógica** — sempre herdar da base correta e sobrescrever apenas o que é específico do módulo.

### Arquivos BASES obrigatórios

- `src/app/Controllers/BaseController.php`
- `src/app/Controllers/Api/V1/BaseResourceTableController.php`
- `src/app/Controllers/Api/V1/BaseResourceViewController.php`
- `src/app/Models/V1/BaseTableModel.php`
- `src/app/Models/V1/BaseViewModel.php`
- `src/app/Services/V1/BaseTableService.php`
- `src/app/Services/V1/BaseViewService.php`

---

### Hierarquia de Controllers

```
CodeIgniter\Controller
  └── App\Controllers\BaseController          (bootstrap, helpers globais)
        └── App\Controllers\Api\V1\BaseResourceTableController   (14 endpoints: leitura + escrita + exclusão)
              └── App\Controllers\Api\V1\BaseResourceViewController  (8 endpoints: somente leitura via View)
                    └── Controllers específicos de cada módulo (ex: UserManagementController)
```

- **`BaseResourceTableController`** — `find`, `getGrouped`, `search`, `get`, `getAll`, `getNoPagination`, `getDeleted`, `getDeletedAll`, `create`, `update`, `delete`, `restore`, `forceDelete` + helpers de resposta padronizados
- **`BaseResourceViewController`** — herda de `BaseResourceTableController`, desabilita escrita (`getCreateRules`/`getUpdateRules` retornam `[]` e são `final`), 8 endpoints read-only via view SQL
- **Controllers de módulo** devem:
  1. Herdar da base correta
  2. Declarar `$this->processor` no `initController`
  3. Implementar `getCreateRules()` e `getUpdateRules()` (tabela) ou nenhum (view)

---

### Hierarquia de Models

```
CodeIgniter\Model
  ├── App\Models\V1\BaseTableModel   (tabelas físicas — CRUD completo, soft delete, timestamps)
  └── App\Models\V1\BaseViewModel    (views SQL — somente leitura, sem timestamps, allowedFields=[])
        └── SqlViewModel do módulo
```

- **`BaseTableModel`** — `useSoftDeletes=true`, `useTimestamps=true`, `protectFields=true`; campos configuráveis: `$sortableFields`, `$likeFields`, `$hidden`
- **`BaseViewModel`** — `useSoftDeletes=false`, `useTimestamps=false`; campos configuráveis: `$sortableFields`, `$likeFields`, `$searchFields`
- Todo model filho declara `$table`, `$allowedFields` e sobrescreve os arrays de configuração

---

### Hierarquia de Services / Processors

```
App\Services\V1\BaseViewService        (sanitização, máscaras, paginação + leitura de view)
  └── App\Services\V1\BaseTableService (herda BaseViewService + leitura de tabela + escrita + exclusão)
        └── Processor do módulo (ex: UserManagementProcessor)
```

- **`BaseViewService`** — sanitização de strings, remoção de máscaras (`cpf`, `whatsapp`, `phone`, `zip_code` e variantes `uc_`), utilitários de paginação e formatação de datas
- **`BaseTableService`** — adiciona `find`, `getGrouped`, `search`, `get`, `getAll`, `getNoPagination`, `getDeleted`, `getDeletedAll`, `create`, `update`, `delete`, `restore`, `forceDelete`
- **Processor do módulo:** declara `$this->tableModel` e/ou `$this->viewModel` no construtor; implementa regras de negócio específicas

---

## Estrutura de Diretórios Backend

```
src/
├── app/
│   ├── Controllers/
│   │   ├── BaseController.php
│   │   └── Api/V1/
│   │       ├── BaseResourceTableController.php
│   │       ├── BaseResourceViewController.php
│   │       ├── User/   (AuthUser, UserCustomer, UserManagement, UserPasswordResets)
│   │       ├── Msg/    (MessageFile, MessageGroup, MessageGroupMember, ...)
│   │       └── Mec/    (VehicleBrand, ...)
│   ├── Models/V1/
│   │   ├── BaseTableModel.php
│   │   ├── BaseViewModel.php
│   │   ├── User/ | Msg/ | Mec/
│   ├── Services/V1/
│   │   ├── BaseViewService.php
│   │   ├── BaseTableService.php
│   │   ├── User/ | Msg/ | Mec/
│   ├── Requests/   ← Validação por módulo/ação (CreateRequest, UpdateRequest)
│   ├── Filters/    ← Auth Bearer Token
│   └── Config/     ← Rotas, banco, app config
└── public/
    ├── index.php   ← Entry point CI4
    ├── frontend/Projeto56300App/
    └── mobile/Projeto56300App/
```

---

## Convenções de Desenvolvimento

### Versionamento — V1

- Controllers: `App\Controllers\Api\V1\{Modulo}\`
- Models: `App\Models\V1\{Modulo}\`
- Services: `App\Services\V1\{Modulo}\`
- Rotas: prefixo `/api/v1/`
- V2: replicar estrutura de pastas sem alterar a V1

### Banco de Dados

- `user_saas_tenants_id` obrigatório em toda tabela de módulo
- Nomeação: `{prefixo}_{NNN}_{nome}` (ex: `est_004_product`)
- Soft delete: `deleted_at datetime DEFAULT NULL`
- Timestamps: `created_at`, `updated_at`
- Charset: `utf8mb4` / collation `utf8mb4_unicode_ci` / Engine `InnoDB`
- Campos com máscara armazenados **somente com dígitos** — `BaseViewService::removeMasks()`

### Campos Sensíveis

- Senhas: nunca plain text — usar hash seguro
- Tokens de reset: armazenar apenas `SHA-256` (`token_hash`); `used_at` preenchido ao consumir
- Campos `$hidden` declarados no filho do `BaseTableModel`: não aparecem nas respostas da API

### Respostas da API

- Helpers herdados: `respondPaginated()`, `respondValidationError()`, `respondServerError()`
- Respostas JSON consistentes com paginação quando aplicável
- Erros de validação: HTTP 422
- Erros de servidor: HTTP 500

### Autenticação

- Bearer Token no header `Authorization`
- Filtro em `src/app/Filters/` protege todas as rotas privadas
- Login: `POST /api/v1/auth/login` → retorna token
- Logout: invalida token no servidor
- Reset de senha: token com `expires_at`, invalidado com `used_at`
