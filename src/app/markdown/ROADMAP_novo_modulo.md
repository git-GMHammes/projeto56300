# ROADMAP — Como criar um novo módulo

Guia completo para criar um módulo na API V1. Siga os passos em ordem.
O objetivo é **herdar** tudo das classes base e escrever apenas o que é específico do módulo.

> **Regra de ouro:** se você estiver reescrevendo lógica de busca, paginação, soft delete, criação ou atualização, algo está errado. A base já faz isso.

---

← [Voltar ao README](../../../README.md)

---

## Como funciona a arquitetura

```
Requisição HTTP
      │
      ▼
ResourceTableController   ← orquestra (valida, chama Processor)
      │
      ▼
Processor (Service)       ← regras de negócio, validações de FK, preparação de dados
      │
      ▼
SqlTableModel             ← acessa a tabela física (CRUD, soft delete, buscas)
SqlViewModel              ← acessa a view SQL (somente leitura, JOINs)
```

Cada camada herda de uma base. O módulo só escreve o que é **diferente**:

| Camada       | Base                          | O módulo escreve                                   |
| ------------ | ----------------------------- | -------------------------------------------------- |
| Controller   | `BaseResourceTableController` | `initController` + `getCreateRules/getUpdateRules` |
| Controller   | `BaseResourceViewController`  | `initController` (sem regras — view é read-only)   |
| Service      | `BaseTableService`            | construtor + hooks de validação/preparação         |
| Model tabela | `BaseTableModel`              | `$table`, `$allowedFields`, arrays de config       |
| Model view   | `BaseViewModel`               | `$table`, arrays de config                         |
| Request      | _(classe simples)_            | método `rules()` + `messages()`                    |

---

## Convenções de nomenclatura

| Elemento             | Padrão                                        | Exemplo (módulo Mecânica)                 |
| -------------------- | --------------------------------------------- | ----------------------------------------- |
| Prefixo do módulo    | 3–4 letras + `_`                              | `mec_`                                    |
| Tabela física        | `{prefixo}_{NNN}_{nome}` em snake_case        | `mec_01_vehicle_brand`                    |
| View SQL             | `view_{prefixo}_{nome}`                       | `view_mec_vehicle_brand`                  |
| PK                   | `id`                                          | `id`                                      |
| Campos da view       | `{abreviação}_{campo}`                        | `vb_id`, `vb_name`                        |
| Namespace Controller | `App\Controllers\Api\V1\{Modulo}\{SubModulo}` | `App\Controllers\Api\V1\Mec\VehicleBrand` |
| Namespace Model      | `App\Models\V1\{Modulo}\{SubModulo}`          | `App\Models\V1\Mec\VehicleBrand`          |
| Namespace Service    | `App\Services\V1\{Modulo}\{SubModulo}`        | `App\Services\V1\Mec\VehicleBrand`        |
| Namespace Request    | `App\Requests\V1\{Modulo}\{SubModulo}`        | `App\Requests\V1\Mec\VehicleBrand`        |
| Rota HTTP            | kebab-case                                    | `/api/v1/vehicle-brand/...`               |

---

## Estrutura de arquivos do módulo

```
src/app/
├── Config/
│   └── Routes/Api/v1/{Modulo}/{SubModulo}/
│       ├── EndpointTable.php        ← rotas CRUD da tabela
│       └── EndpointView.php         ← rotas de leitura da view (se houver)
│
├── Controllers/Api/V1/{Modulo}/{SubModulo}/
│   ├── ResourceTableController.php
│   └── ResourceViewController.php  ← opcional (apenas se tiver view)
│
├── Models/V1/{Modulo}/{SubModulo}/
│   ├── SqlTableModel.php
│   └── SqlViewModel.php            ← opcional (apenas se tiver view)
│
├── Services/V1/{Modulo}/{SubModulo}/
│   └── Processor.php
│
└── Requests/V1/{Modulo}/{SubModulo}/
    ├── CreateRequest.php
    └── UpdateRequest.php
```

---

## Checklist de criação

- [ ] Passo 0 — Consultar banco (tabelas e colunas existentes)
- [ ] Passo 1 — Criar a tabela no banco (se for nova)
- [ ] Passo 2 — Registrar as rotas em `Routes.php`
- [ ] Passo 3 — Criar `EndpointTable.php` (e `EndpointView.php` se houver view)
- [ ] Passo 4 — Criar `SqlTableModel.php`
- [ ] Passo 5 — Criar `SqlViewModel.php` (se houver view)
- [ ] Passo 6 — Criar `CreateRequest.php` e `UpdateRequest.php`
- [ ] Passo 7 — Criar `Processor.php`
- [ ] Passo 8 — Criar `ResourceTableController.php`
- [ ] Passo 9 — Criar `ResourceViewController.php` (se houver view)
- [ ] Testar todos os endpoints via Postman/Insomnia

---

## Passo 0 — Consultar o banco antes de começar

**Obrigatório.** Antes de criar qualquer arquivo, verifique o estado atual do banco.

```bash
# Listar todas as tabelas do banco
podman exec -i codeigniter56300_mysql mysql \
  -ucodeigniter56300_user \
  -p'codeigniter56300_P@ssw0rd_2024' \
  -e "SHOW FULL TABLES IN codeigniter56300_api_db;"
```

```sql
-- Ver colunas e tipos de uma tabela específica
SELECT column_name, data_type, character_maximum_length AS tamanho_maximo
FROM information_schema.columns
WHERE table_name = 'mec_01_vehicle_brand'
  AND table_schema = 'codeigniter56300_api_db'
ORDER BY ordinal_position;

-- Ver quais colunas são PK ou FK
SELECT
  column_name AS Coluna,
  CASE
    WHEN column_key = 'PRI' THEN 'Chave Primária'
    WHEN column_key = 'MUL' THEN 'Chave Estrangeira'
    ELSE 'Normal'
  END AS Tipo_Chave
FROM information_schema.columns
WHERE table_name = 'mec_01_vehicle_brand'
  AND table_schema = 'codeigniter56300_api_db';
```

---

## Passo 1 — Criar a tabela no banco

Toda tabela de módulo **obrigatoriamente** deve ter:

- `id` — PK auto-increment
- `user_saas_tenants_id` — FK para `user_004_saas_tenants.id` (isolamento multi-tenant)
- `created_at`, `updated_at`, `deleted_at` — timestamps e soft delete

```sql
CREATE TABLE mec_01_vehicle_brand (
    id                  INT UNSIGNED     NOT NULL AUTO_INCREMENT,
    user_saas_tenants_id INT UNSIGNED    NOT NULL,
    name                VARCHAR(100)     NOT NULL,
    created_at          DATETIME         DEFAULT NULL,
    updated_at          DATETIME         DEFAULT NULL,
    deleted_at          DATETIME         DEFAULT NULL,

    PRIMARY KEY (id),
    UNIQUE KEY uq_vehicle_brand_name (name),
    CONSTRAINT fk_vehicle_brand_tenant
        FOREIGN KEY (user_saas_tenants_id) REFERENCES user_004_saas_tenants (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Passo 2 — Registrar as rotas em Routes.php

Arquivo: `src/app/Config/Routes.php`

Dentro do bloco `$routes->group('api/v1', ...)`, adicione um `group` por endpoint:

```php
// =========================================================================
// /Mec — Módulo mecânico / veículos
// =========================================================================

$routes->group('vehicle-brand', function ($routes) {
    require __DIR__ . '/Routes/Api/v1/Mec/VehicleBrand/EndpointTable.php';
});

// Se tiver view, adicione também:
$routes->group('vehicle-brand-view', function ($routes) {
    require __DIR__ . '/Routes/Api/v1/Mec/VehicleBrand/EndpointView.php';
});
```

> O nome do grupo vira o prefixo da URL: `vehicle-brand` → `/api/v1/vehicle-brand/...`

---

## Passo 3 — Criar os arquivos de rotas

### `EndpointTable.php` — CRUD completo (15 rotas)

Arquivo: `src/app/Config/Routes/Api/v1/Mec/VehicleBrand/EndpointTable.php`

```php
<?php
// Rotas REST para manipulação da tabela mec_01_vehicle_brand
// {{www}}/index.php/api/v1/vehicle-brand/find
$routes->post('find', 'Api\V1\Mec\VehicleBrand\ResourceTableController::find');
// {{www}}/index.php/api/v1/vehicle-brand/get-grouped
$routes->post('get-grouped', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getGrouped');
// {{www}}/index.php/api/v1/vehicle-brand/search
$routes->get('search', 'Api\V1\Mec\VehicleBrand\ResourceTableController::search');
// {{www}}/index.php/api/v1/vehicle-brand/get/{id}
$routes->get('get/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::get/$1');
// {{www}}/index.php/api/v1/vehicle-brand/get-all
$routes->get('get-all', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getAll');
// {{www}}/index.php/api/v1/vehicle-brand/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getNoPagination');
// {{www}}/index.php/api/v1/vehicle-brand/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getDeleted/$1');
// {{www}}/index.php/api/v1/vehicle-brand/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getDeletedAll');
// {{www}}/index.php/api/v1/vehicle-brand/get-with-deleted/{id}
$routes->get('get-with-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getWithDeleted/$1');
// {{www}}/index.php/api/v1/vehicle-brand/create
$routes->post('create', 'Api\V1\Mec\VehicleBrand\ResourceTableController::create');
// {{www}}/index.php/api/v1/vehicle-brand/update/{id}
$routes->put('update/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::update/$1');
// {{www}}/index.php/api/v1/vehicle-brand/delete-soft/{id}
$routes->delete('delete-soft/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteSoft/$1');
// {{www}}/index.php/api/v1/vehicle-brand/delete-restore/{id}
$routes->patch('delete-restore/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteRestore/$1');
// {{www}}/index.php/api/v1/vehicle-brand/delete-hard/{id}
$routes->delete('delete-hard/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteHard/$1');
// {{www}}/index.php/api/v1/vehicle-brand/clear-deleted
$routes->delete('clear-deleted', 'Api\V1\Mec\VehicleBrand\ResourceTableController::clearDeleted');
// {{www}}/index.php/api/v1/vehicle-brand/clear-deleted/{id}
$routes->delete('clear-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::clearDeleted/$1');
```

### `EndpointView.php` — Leitura via view (8 rotas, opcional)

Arquivo: `src/app/Config/Routes/Api/v1/Mec/VehicleBrand/EndpointView.php`

```php
<?php
// Rotas REST para consulta na view view_mec_vehicle_brand
// {{www}}/index.php/api/v1/vehicle-brand-view/find
$routes->post('find', 'Api\V1\Mec\VehicleBrand\ResourceViewController::find');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-grouped
$routes->post('get-grouped', 'Api\V1\Mec\VehicleBrand\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/vehicle-brand-view/search
$routes->get('search', 'Api\V1\Mec\VehicleBrand\ResourceViewController::search');
// {{www}}/index.php/api/v1/vehicle-brand-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-all
$routes->get('get-all', 'Api\V1\Mec\VehicleBrand\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Mec\VehicleBrand\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Mec\VehicleBrand\ResourceViewController::getDeletedAll');
```

---

## Passo 4 — SqlTableModel

Arquivo: `src/app/Models/V1/Mec/VehicleBrand/SqlTableModel.php`

Herda `BaseTableModel`. Declare **apenas** a configuração da tabela.
Nenhum método de busca ou CRUD precisa ser escrito — todos vêm da base.

```php
<?php

namespace App\Models\V1\Mec\VehicleBrand;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $DBGroup        = DB_GROUP_001;   // constante definida em Constants.php
    protected $table          = 'mec_01_vehicle_brand';
    protected $primaryKey     = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    /**
     * Campos que podem ser inseridos ou atualizados via Model.
     * NUNCA inclua: id, created_at, updated_at, deleted_at, colunas geradas.
     */
    protected $allowedFields = [
        'user_saas_tenants_id',
        'name',
    ];

    /**
     * Campos de texto que usam LIKE %valor% nos filtros de find/findGrouped.
     * Campos numéricos/relacionais (id, FKs, datas) usam WHERE exato (=).
     */
    protected array $likeFields = [
        'name',
    ];

    /**
     * Campos válidos para ORDER BY — whitelist contra SQL injection.
     * A base só aceita valores dessa lista; qualquer outro vira 'id'.
     */
    protected array $sortableFields = [
        'id',
        'name',
        'created_at',
        'updated_at',
    ];

    /**
     * Campos usados no LIKE do endpoint GET /search?q=termo.
     * A busca usa OR entre os campos: name LIKE '%X%' OR outro_campo LIKE '%X%'.
     */
    public array $searchFields = [
        'name',
    ];

    /**
     * Campos excluídos de qualquer retorno.
     * Use para campos sensíveis que nunca devem aparecer na API.
     * Exemplo: ['password', 'token_hash']
     */
    protected $hidden = [];

    // -------------------------------------------------------------------------
    // Verificações de unicidade (use o helper existsByField da base)
    // -------------------------------------------------------------------------

    /**
     * Verifica se já existe registro ativo com o mesmo name.
     * $excludeId: passa o ID atual no update para não conflitar com ele mesmo.
     */
    public function existsByName(string $name, ?int $excludeId = null): bool
    {
        return $this->existsByField('name', $name, $excludeId);
    }

    // -------------------------------------------------------------------------
    // Verificações de FK em outras tabelas (quando necessário)
    // -------------------------------------------------------------------------

    /**
     * Verifica se um tenant existe e está ativo.
     * Use quando o campo user_saas_tenants_id precisa ser validado.
     */
    public function existsTenant(int $tenantId): bool
    {
        return $this->db
            ->table('user_004_saas_tenants')
            ->where('id', $tenantId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }
}
```

### O que a base fornece automaticamente

| Método da base           | O que faz                                               |
| ------------------------ | ------------------------------------------------------- |
| `findPaginated()`        | Busca paginada com filtros WHERE exato ou LIKE          |
| `findGrouped()`          | Busca paginada com filtros multivalorados (WHERE IN)    |
| `searchByTerm()`         | Busca textual por LIKE em `$searchFields`               |
| `getOrdered()`           | Lista todos os registros sem paginação                  |
| `existsByField()`        | Verifica unicidade (ativo, com exclusão opcional de ID) |
| `findWithDeleted()`      | Busca por ID incluindo soft-deleted                     |
| `findOnlyDeleted()`      | Busca por ID somente se soft-deleted                    |
| `findDeletedPaginated()` | Lista paginada de soft-deleted                          |
| `restore()`              | Restaura soft-deleted (zera `deleted_at`)               |
| `clearDeleted()`         | Hard delete em todos ou em um soft-deleted específico   |

> **Arquivo base:** `src/app/Models/V1/BaseTableModel.php`

---

## Passo 5 — SqlViewModel (opcional)

Use quando precisar de dados desnormalizados: JOINs com outras tabelas, campos calculados,
ou quando o frontend precisar de um payload mais rico sem fazer múltiplas chamadas.

Arquivo: `src/app/Models/V1/Mec/VehicleBrand/SqlViewModel.php`

```php
<?php

namespace App\Models\V1\Mec\VehicleBrand;

use App\Models\V1\BaseViewModel;

class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_mec_vehicle_brand'; // view criada no banco
    protected $primaryKey = 'id';

    /**
     * Campos que usam LIKE nos filtros.
     * Use os nomes das colunas da view (com prefixo se houver).
     */
    protected array $likeFields = [
        'vb_name',
    ];

    /**
     * Campos válidos para ORDER BY.
     */
    protected array $sortableFields = [
        'id',
        'vb_name',
        'created_at',
    ];

    /**
     * Campos usados no GET /search?q=termo da view.
     */
    public array $searchFields = [
        'vb_name',
    ];
}
```

### O que a base de view fornece automaticamente

| Método da base               | O que faz                                              |
| ---------------------------- | ------------------------------------------------------ |
| `findPaginatedView()`        | Busca paginada com filtros (exclui deleted por padrão) |
| `findGroupedView()`          | Busca paginada com filtros multivalorados (WHERE IN)   |
| `searchByTermView()`         | Busca textual por LIKE em `$searchFields`              |
| `findById()`                 | Busca registro ativo por ID                            |
| `findDeletedById()`          | Busca registro soft-deleted por ID                     |
| `findDeletedPaginatedView()` | Lista paginada de soft-deleted                         |
| `findAllView()`              | Lista todos os ativos sem paginação                    |

> **Arquivo base:** `src/app/Models/V1/BaseViewModel.php`

---

## Passo 6 — Requests de validação

As regras do Request validam **formato** e **tipo** dos campos.
**Não valide unicidade ou FK aqui** — isso é responsabilidade do Processor.

### `CreateRequest.php`

```php
<?php

namespace App\Requests\V1\Mec\VehicleBrand;

class CreateRequest
{
    /**
     * Regras de validação CI4 para POST /create.
     *
     * Referência de regras: https://codeigniter.com/user_guide/libraries/validation.html
     * Campos obrigatórios usam 'required'.
     * Campos opcionais usam 'permit_empty'.
     */
    public function rules(): array
    {
        return [
            'user_saas_tenants_id' => 'required|integer',
            'name'                 => 'required|string|max_length[100]',
        ];
    }

    /**
     * Mensagens customizadas por campo e regra (opcional mas recomendado).
     */
    public function messages(): array
    {
        return [
            'user_saas_tenants_id' => [
                'required' => 'O campo user_saas_tenants_id é obrigatório',
                'integer'  => 'O campo user_saas_tenants_id deve ser um número inteiro',
            ],
            'name' => [
                'required'   => 'O campo name é obrigatório',
                'max_length' => 'O nome não pode exceder 100 caracteres',
            ],
        ];
    }
}
```

### `UpdateRequest.php`

```php
<?php

namespace App\Requests\V1\Mec\VehicleBrand;

class UpdateRequest
{
    /**
     * Regras de validação CI4 para PUT /update/{id}.
     *
     * Todos os campos usam 'permit_empty' — o update é parcial (PATCH-like).
     * Campos imutáveis (criado_por, tenant) não devem aparecer aqui.
     */
    public function rules(): array
    {
        return [
            'name' => 'permit_empty|string|max_length[100]',
        ];
    }

    public function messages(): array
    {
        return [
            'name' => [
                'max_length' => 'O nome não pode exceder 100 caracteres',
            ],
        ];
    }
}
```

> **Dica:** campos com máscara (`cpf`, `whatsapp`, `phone`, `zip_code`) são removidos automaticamente
> pelo `BaseTableService::removeMasks()` antes de chegar ao banco. Não remova máscaras manualmente.

---

## Passo 7 — Processor (Service)

Arquivo: `src/app/Services/V1/Mec/VehicleBrand/Processor.php`

Herda `BaseTableService`. Implemente **apenas** os hooks específicos do módulo.
Todo o fluxo de create/update/delete já está implementado na base.

```php
<?php

namespace App\Services\V1\Mec\VehicleBrand;

use App\Models\V1\Mec\VehicleBrand\SqlTableModel;
use App\Models\V1\Mec\VehicleBrand\SqlViewModel; // remova se não tiver view
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel; // remova se não tiver view

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel(); // remova se não tiver view
    }

    // -------------------------------------------------------------------------
    // Hook: validações de negócio antes do INSERT
    // Retorne ['success' => false, 'message' => '...', 'code' => N] para bloquear.
    // Retorne null para prosseguir normalmente.
    // -------------------------------------------------------------------------

    protected function validateOnCreate(array $data): ?array
    {
        // Validar FK: o tenant deve existir
        if (!empty($data['user_saas_tenants_id'])
            && !$this->tableModel->existsTenant((int) $data['user_saas_tenants_id'])
        ) {
            return ['success' => false, 'message' => 'Tenant não encontrado', 'code' => 422];
        }

        // Validar unicidade do name entre registros ativos
        if (!empty($data['name']) && $this->tableModel->existsByName($data['name'])) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }

        return null; // tudo ok, prosseguir
    }

    // -------------------------------------------------------------------------
    // Hook: validações de negócio antes do UPDATE
    // O $id é o registro sendo atualizado — passe para o existsByField para
    // não conflitar o registro consigo mesmo.
    // -------------------------------------------------------------------------

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        // Unicidade do name excluindo o próprio registro (excludeId)
        if (!empty($data['name']) && $this->tableModel->existsByName($data['name'], $id)) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook: transformações antes do INSERT (formatação, hash, geração de slug, etc.)
    // Os dados já chegam sanitizados (sem tags HTML, sem espaços extras).
    // -------------------------------------------------------------------------

    protected function prepareData(array $data): array
    {
        // Exemplo: formatar uma data opcional
        if (isset($data['birth_date'])) {
            $data['birth_date'] = $this->formatDate($data['birth_date']);
        }

        // Exemplo: formatar datetime
        if (isset($data['scheduled_at'])) {
            $data['scheduled_at'] = $this->formatDatetime($data['scheduled_at']);
        }

        return $data;
    }

    // -------------------------------------------------------------------------
    // Hook: transformações antes do UPDATE
    // Por padrão chama prepareData(). Sobrescreva para remover campos imutáveis.
    // -------------------------------------------------------------------------

    protected function prepareUpdateData(int $id, array $data): array
    {
        // Campos que não podem ser alterados após a criação:
        unset($data['user_saas_tenants_id'], $data['created_by']);

        return $this->prepareData($data);
    }
}
```

### Fluxo interno do create (para entender o que a base faz)

```
POST /create
  1. Controller valida o Request (rules)
  2. BaseTableService::create() é chamado
     a. sanitizeData()      → remove tags HTML e espaços extras
     b. removeMasks()       → remove máscara de cpf, whatsapp, phone, zip_code
     c. validateOnCreate()  → seu hook — validar FK, unicidade, negócio
     d. prepareData()       → seu hook — formatar campos, gerar hash, etc.
     e. tableModel->insert()
     f. retorna o registro criado
```

### Fluxo interno do update

```
PUT /update/{id}
  1. Controller valida o Request (rules)
  2. BaseTableService::update() é chamado
     a. tableModel->find($id) → verifica se existe e está ativo
     b. sanitizeData() + removeMasks()
     c. prepareUpdateData()  → seu hook — remover imutáveis, formatar
     d. validateOnUpdate()   → seu hook — validar unicidade com excludeId
     e. tableModel->update($id, $data)
     f. retorna o registro atualizado
```

### Utilitários disponíveis no Processor (herdados da base)

| Método                      | O que faz                                       |
| --------------------------- | ----------------------------------------------- |
| `sanitizeString($str)`      | Remove tags HTML e espaços extras               |
| `sanitizeData($data)`       | Sanitiza array inteiro, remove chaves vazias    |
| `removeMasks($data)`        | Remove máscara de CPF, WhatsApp, telefone, CEP  |
| `formatDate($date)`         | Converte para `Y-m-d`                           |
| `formatDatetime($datetime)` | Converte para `Y-m-d H:i:s`                     |
| `buildPaginationParams()`   | Normaliza page/limit/sort/order da query string |

> **Arquivo base:** `src/app/Services/V1/BaseTableService.php` (herda `BaseViewService`)

---

## Passo 8 — ResourceTableController

Arquivo: `src/app/Controllers/Api/V1/Mec/VehicleBrand/ResourceTableController.php`

Herda `BaseResourceTableController`. Escreva **apenas** o `initController` e os dois métodos de regras.
Os 15 endpoints já estão implementados na base.

```php
<?php

namespace App\Controllers\Api\V1\Mec\VehicleBrand;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\Mec\VehicleBrand\CreateRequest;
use App\Requests\V1\Mec\VehicleBrand\UpdateRequest;
use App\Services\V1\Mec\VehicleBrand\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceTableController extends BaseResourceTableController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }
}
```

### Endpoints fornecidos pela base (não escreva nada disto)

| Método HTTP | Rota                     | Método do Controller | O que faz                             |
| ----------- | ------------------------ | -------------------- | ------------------------------------- |
| `POST`      | `/find`                  | `find()`             | Filtro paginado (WHERE exato ou LIKE) |
| `POST`      | `/get-grouped`           | `getGrouped()`       | Filtro multivalorado (WHERE IN)       |
| `GET`       | `/search?q=termo`        | `search()`           | Busca textual LIKE em `$searchFields` |
| `GET`       | `/get/{id}`              | `get()`              | Busca um registro ativo por ID        |
| `GET`       | `/get-all`               | `getAll()`           | Lista paginada de ativos              |
| `GET`       | `/get-no-pagination`     | `getNoPagination()`  | Lista todos os ativos (sem paginação) |
| `GET`       | `/get-deleted/{id}`      | `getDeleted()`       | Busca um soft-deleted por ID          |
| `GET`       | `/get-deleted-all`       | `getDeletedAll()`    | Lista paginada de soft-deleted        |
| `GET`       | `/get-with-deleted/{id}` | `getWithDeleted()`   | Busca por ID (ativo ou soft-deleted)  |
| `POST`      | `/create`                | `create()`           | Cria novo registro                    |
| `PUT`       | `/update/{id}`           | `update()`           | Atualiza registro existente           |
| `DELETE`    | `/delete-soft/{id}`      | `deleteSoft()`       | Soft delete (seta `deleted_at`)       |
| `PATCH`     | `/delete-restore/{id}`   | `deleteRestore()`    | Restaura soft-deleted                 |
| `DELETE`    | `/delete-hard/{id}`      | `deleteHard()`       | Hard delete permanente                |
| `DELETE`    | `/clear-deleted`         | `clearDeleted()`     | Hard delete de todos os soft-deleted  |
| `DELETE`    | `/clear-deleted/{id}`    | `clearDeleted($id)`  | Hard delete de um soft-deleted        |

> **Arquivo base:** `src/app/Controllers/Api/V1/BaseResourceTableController.php`

---

## Passo 9 — ResourceViewController (opcional)

Arquivo: `src/app/Controllers/Api/V1/Mec/VehicleBrand/ResourceViewController.php`

Herda `BaseResourceViewController`. Escreva **apenas** o `initController`.
Sem regras de validação — views são somente leitura; `getCreateRules` e `getUpdateRules`
são `final` na base e retornam `[]`.

```php
<?php

namespace App\Controllers\Api\V1\Mec\VehicleBrand;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\Mec\VehicleBrand\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceViewController extends BaseResourceViewController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }
}
```

> **Arquivo base:** `src/app/Controllers/Api/V1/BaseResourceViewController.php`

---

## Formato de resposta da API

Todas as respostas seguem o mesmo padrão JSON:

### Resposta de sucesso (200)

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get/1",
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": {
    "id": 1,
    "user_saas_tenants_id": 1,
    "name": "Toyota",
    "created_at": "2026-01-15 10:30:00",
    "updated_at": "2026-01-15 10:30:00",
    "deleted_at": null
  }
}
```

### Resposta paginada (200)

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get-all",
  "statusCode": 200,
  "message": "Registros listados com sucesso",
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Resposta de criação (201)

```json
{
  "method": "POST",
  "endpoint": "/api/v1/vehicle-brand/create",
  "statusCode": 201,
  "message": "Registro criado com sucesso",
  "success": true,
  "data": { ... }
}
```

### Resposta de erro de validação (422)

```json
{
  "method": "POST",
  "endpoint": "/api/v1/vehicle-brand/create",
  "statusCode": 422,
  "message": "Erro de validação",
  "success": false,
  "errors": {
    "name": "O campo name é obrigatório"
  }
}
```

### Parâmetros de paginação (query string)

Todos os endpoints paginados aceitam os mesmos parâmetros:

| Parâmetro | Padrão | Limite   | Descrição                      |
| --------- | ------ | -------- | ------------------------------ |
| `page`    | `1`    | ≥ 1      | Página atual                   |
| `limit`   | `20`   | 1–100    | Registros por página           |
| `sort`    | `id`   | —        | Campo de ordenação (whitelist) |
| `order`   | `desc` | asc/desc | Direção da ordenação           |

Exemplo: `GET /api/v1/vehicle-brand/get-all?page=2&limit=10&sort=name&order=asc`

---

## Resumo: qual tipo de módulo criar?

| Cenário                                      | Model           | Service            | Controller                |
| -------------------------------------------- | --------------- | ------------------ | ------------------------- |
| CRUD simples (tabela)                        | `SqlTableModel` | `BaseTableService` | `ResourceTableController` |
| CRUD + dados desnormalizados (tabela + view) | Ambos           | `BaseTableService` | Ambos os controllers      |
| Somente leitura com JOINs (só view)          | `SqlViewModel`  | `BaseViewService`  | `ResourceViewController`  |

---

## Referência das classes base

| Classe base                   | Arquivo                                                      | Herda de                      |
| ----------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `BaseTableModel`              | `src/app/Models/V1/BaseTableModel.php`                       | `Model` (CI4)                 |
| `BaseViewModel`               | `src/app/Models/V1/BaseViewModel.php`                        | `Model` (CI4)                 |
| `BaseViewService`             | `src/app/Services/V1/BaseViewService.php`                    | _(raiz)_                      |
| `BaseTableService`            | `src/app/Services/V1/BaseTableService.php`                   | `BaseViewService`             |
| `BaseResourceTableController` | `src/app/Controllers/Api/V1/BaseResourceTableController.php` | `BaseController` (CI4)        |
| `BaseResourceViewController`  | `src/app/Controllers/Api/V1/BaseResourceViewController.php`  | `BaseResourceTableController` |

---

## Erros comuns e como evitar

| Erro                                            | Causa                                                       | Solução                                                          |
| ----------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------- |
| Endpoint retorna 500 sem mensagem               | `$this->processor` não foi inicializado no `initController` | Verifique se `$this->processor = new Processor();` está lá       |
| Endpoint retorna registros de outros tenants    | `user_saas_tenants_id` não está sendo filtrado              | Inclua `user_saas_tenants_id` nos filtros do find ou no WHERE    |
| Update altera campos que deveriam ser imutáveis | `prepareUpdateData` não remove os campos                    | Use `unset($data['campo_imutavel'])` no `prepareUpdateData`      |
| Busca textual não funciona                      | `$searchFields` vazio ou campo errado no Model              | Declare os campos de texto em `public array $searchFields`       |
| ORDER BY ignorado ou retorna erro               | Campo não está em `$sortableFields`                         | Adicione o campo à whitelist `$sortableFields` no Model          |
| Campo sensível aparecendo na resposta da API    | Não está em `$hidden`                                       | Declare o campo em `protected $hidden = ['campo']`               |
| `existsByField` não encontra duplicatas         | Registro foi soft-deleted                                   | O método já filtra `deleted_at IS NULL` — comportamento esperado |
| Máscara de CPF/telefone salva no banco          | `removeMasks` não foi chamado                               | A base chama automaticamente — não chame manualmente             |

---

## Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
