# ROADMAP — Como criar um novo módulo

Este guia explica como criar um módulo completo na API V1 herdando toda a infraestrutura dos
Base classes. **Não reescreva nada das bases** — apenas declare a herança e implemente os hooks.

---

## Convenções de nomenclatura

| Elemento                  | Padrão                          | Exemplo                    |
| ------------------------- | ------------------------------- | -------------------------- |
| Namespace base            | `App\<Camada>\V1\<NomeModulo>`  | `App\Models\V1\NomeModulo` |
| Tabela física             | `snake_case` singular ou plural | `nome_modulo`              |
| View SQL                  | prefixo `vw_`                   | `vw_nome_modulo`           |
| PK da tabela              | `id`                            | `id`                       |
| Prefixo de campos da view | Abreviação do módulo + `_`      | `nm_id`, `nm_name`         |

---

## Estrutura de arquivos por módulo

```
src/app/
├── Config/Routes/Api/v1/NomeModulo/
│   ├── EndpointTable.php          ← rotas CRUD (tabela)
│   └── EndpointView.php           ← rotas leitura (view) — opcional
├── Controllers/Api/V1/NomeModulo/
│   ├── ResourceTableController.php
│   └── ResourceViewController.php ← opcional
├── Models/V1/NomeModulo/
│   ├── SqlTableModel.php
│   └── SqlViewModel.php           ← opcional
├── Services/V1/NomeModulo/
│   └── Processor.php
└── Requests/V1/NomeModulo/
    ├── CreateRequest.php
    └── UpdateRequest.php
```

---

## Passo 1 — Registrar as rotas em Routes.php

Em `src/app/Config/Routes.php`, dentro do grupo `/api/v1`, adicione o `require`:

```php
// NomeModulo
require_once APPPATH . 'Config/Routes/Api/v1/NomeModulo/EndpointTable.php';
require_once APPPATH . 'Config/Routes/Api/v1/NomeModulo/EndpointView.php'; // opcional
```

---

## Passo 2 — Criar os arquivos de rotas

### `EndpointTable.php`

```php
<?php

$routes->group('nome-modulo', static function ($routes) {

    // Leitura
    $routes->post('find',             'NomeModulo\ResourceTableController::find');
    $routes->post('get-grouped',      'NomeModulo\ResourceTableController::getGrouped');
    $routes->get('search',            'NomeModulo\ResourceTableController::search');
    $routes->get('get/(:num)',        'NomeModulo\ResourceTableController::get/$1');
    $routes->get('get-all',           'NomeModulo\ResourceTableController::getAll');
    $routes->get('get-no-pagination', 'NomeModulo\ResourceTableController::getNoPagination');
    $routes->get('get-deleted/(:num)','NomeModulo\ResourceTableController::getDeleted/$1');
    $routes->get('get-deleted-all',   'NomeModulo\ResourceTableController::getDeletedAll');
    $routes->get('get-with-deleted/(:num)', 'NomeModulo\ResourceTableController::getWithDeleted/$1');

    // Escrita
    $routes->post('create',                    'NomeModulo\ResourceTableController::create');
    $routes->put('update/(:num)',              'NomeModulo\ResourceTableController::update/$1');

    // Exclusão
    $routes->delete('delete-soft/(:num)',      'NomeModulo\ResourceTableController::deleteSoft/$1');
    $routes->patch('delete-restore/(:num)',    'NomeModulo\ResourceTableController::deleteRestore/$1');
    $routes->delete('delete-hard/(:num)',      'NomeModulo\ResourceTableController::deleteHard/$1');
    $routes->delete('clear-deleted',           'NomeModulo\ResourceTableController::clearDeleted');
    $routes->delete('clear-deleted/(:num)',    'NomeModulo\ResourceTableController::clearDeleted/$1');
});
```

### `EndpointView.php` (opcional)

```php
<?php

$routes->group('nome-modulo-view', static function ($routes) {

    $routes->post('find',             'NomeModulo\ResourceViewController::findView');
    $routes->post('get-grouped',      'NomeModulo\ResourceViewController::getGroupedView');
    $routes->get('search',            'NomeModulo\ResourceViewController::searchView');
    $routes->get('get/(:num)',        'NomeModulo\ResourceViewController::getView/$1');
    $routes->get('get-all',           'NomeModulo\ResourceViewController::getAllView');
    $routes->get('get-no-pagination', 'NomeModulo\ResourceViewController::getNoPaginationView');
    $routes->get('get-deleted/(:num)','NomeModulo\ResourceViewController::getDeletedView/$1');
    $routes->get('get-deleted-all',   'NomeModulo\ResourceViewController::getDeletedAllView');
});
```

---

## Passo 3 — SqlTableModel

Herda `BaseTableModel`. Declare apenas a configuração da tabela e os campos do módulo.
Os métodos de busca, paginação, soft delete e restore vêm todos da base.

```php
<?php

namespace App\Models\V1\NomeModulo;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $table         = 'nome_modulo';
    protected $primaryKey    = 'id';
    protected $allowedFields = ['campo1', 'campo2', 'user_id'];

    /** Campos usados em buscas textuais (GET /search). */
    public array $searchFields = ['campo1', 'campo2'];

    // -------------------------------------------------------------------------
    // Verificações de unicidade (use o helper herdado existsByField)
    // -------------------------------------------------------------------------

    public function existsByCampo1(string $value, ?int $excludeId = null): bool
    {
        return $this->existsByField('campo1', $value, $excludeId);
    }

    // Verificação de FK em outra tabela
    public function existsOutraTabela(int $id): bool
    {
        return $this->db->table('outra_tabela')->where('id', $id)->countAllResults() > 0;
    }
}
```

> **Base:** `src/app/Models/V1/BaseTableModel.php`
> Herda: `findPaginated`, `findGrouped`, `searchByTerm`, `getOrdered`, `existsByField`,
> `findWithDeleted`, `findOnlyDeleted`, `findDeletedPaginated`, `restore`, `clearDeleted`

---

## Passo 4 — SqlViewModel (opcional)

Herda `BaseViewModel`. Declare apenas a configuração da view e os campos.
Use quando precisar de dados desnormalizados (JOINs, campos calculados).

```php
<?php

namespace App\Models\V1\NomeModulo;

use App\Models\V1\BaseViewModel;

class SqlViewModel extends BaseViewModel
{
    protected $table = 'vw_nome_modulo';

    /** Campos para LIKE em buscas textuais. */
    protected array $likeFields = ['nm_campo1', 'nm_campo2'];

    /** Campos permitidos no ORDER BY (whitelist contra SQL injection). */
    protected array $sortableFields = ['nm_id', 'nm_campo1', 'nm_campo2'];

    /** Campos usados em buscas textuais (GET /search). */
    public array $searchFields = ['nm_campo1', 'nm_campo2'];
}
```

> **Base:** `src/app/Models/V1/BaseViewModel.php`
> Herda: `findPaginatedView`, `findById`, `findDeletedById`, `findDeletedPaginatedView`,
> `searchByTermView`, `findGroupedView`, `findAllView`

---

## Passo 5 — Requests de validação

### `CreateRequest.php`

```php
<?php

namespace App\Requests\V1\NomeModulo;

use CodeIgniter\HTTP\IncomingRequest;

class CreateRequest
{
    public static function rules(): array
    {
        return [
            'campo1' => 'required|max_length[100]',
            'campo2' => 'permit_empty|valid_email',
            'user_id' => 'required|integer',
        ];
    }
}
```

### `UpdateRequest.php`

```php
<?php

namespace App\Requests\V1\NomeModulo;

class UpdateRequest
{
    public static function rules(): array
    {
        return [
            'campo1' => 'permit_empty|max_length[100]',
            'campo2' => 'permit_empty|valid_email',
        ];
    }
}
```

---

## Passo 6 — Processor (Service)

Herda `BaseTableService`. Implemente apenas os hooks de validação e preparação específicos
do módulo. Todos os métodos de leitura, escrita e exclusão vêm da base.

```php
<?php

namespace App\Services\V1\NomeModulo;

use App\Models\V1\NomeModulo\SqlTableModel;
use App\Models\V1\NomeModulo\SqlViewModel; // opcional
use App\Services\V1\BaseTableService;

class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel; // remover se não usar view

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel(); // remover se não usar view
    }

    // -------------------------------------------------------------------------
    // Hooks de validação (sobrescrever apenas se necessário)
    // -------------------------------------------------------------------------

    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_id']) && !$this->tableModel->existsOutraTabela((int) $data['user_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        if (!empty($data['campo1']) && $this->tableModel->existsByCampo1($data['campo1'])) {
            return ['success' => false, 'message' => 'Campo1 já cadastrado', 'code' => 409];
        }

        return null;
    }

    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['campo1']) && $this->tableModel->existsByCampo1($data['campo1'], $id)) {
            return ['success' => false, 'message' => 'Campo1 já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação (sobrescrever apenas se necessário)
    // -------------------------------------------------------------------------

    protected function prepareData(array $data): array
    {
        if (isset($data['data_campo'])) {
            $data['data_campo'] = $this->formatDate($data['data_campo']);
        }

        return $data;
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_id']); // campos imutáveis no update

        return $this->prepareData($data);
    }
}
```

> **Base:** `src/app/Services/V1/BaseTableService.php` (herda `BaseViewService`)
> Hooks disponíveis: `validateOnCreate`, `validateOnUpdate`, `prepareData`, `prepareUpdateData`
> Utilitários herdados: `sanitizeString`, `sanitizeData`, `removeMasks`, `formatDate`,
> `formatDatetime`, `buildPaginationParams`

---

## Passo 7 — ResourceTableController

Herda `BaseResourceTableController`. Declare apenas o `initController` com o Processor
e os dois hooks de validação (`getCreateRules` e `getUpdateRules`).

```php
<?php

namespace App\Controllers\Api\V1\NomeModulo;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\NomeModulo\CreateRequest;
use App\Requests\V1\NomeModulo\UpdateRequest;
use App\Services\V1\NomeModulo\Processor;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;

class ResourceTableController extends BaseResourceTableController
{
    public function initController(
        IncomingRequest|\CodeIgniter\HTTP\CLIRequest $request,
        ResponseInterface $response,
        \Psr\Log\LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return CreateRequest::rules();
    }

    protected function getUpdateRules(): array
    {
        return UpdateRequest::rules();
    }
}
```

> **Base:** `src/app/Controllers/Api/V1/BaseResourceTableController.php`
> Todos os 14 endpoints já estão implementados na base (find, getGrouped, search, get,
> getAll, getNoPagination, getDeleted, getDeletedAll, getWithDeleted, create, update,
> deleteSoft, deleteRestore, deleteHard, clearDeleted).

---

## Passo 8 — ResourceViewController (opcional)

Herda `BaseResourceViewController`. Declare apenas o `initController` com o Processor.
Nenhuma regra de validação necessária — a base já implementa `getCreateRules` e `getUpdateRules`
como `final` retornando `[]`.

```php
<?php

namespace App\Controllers\Api\V1\NomeModulo;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\NomeModulo\Processor;
use CodeIgniter\HTTP\IncomingRequest;
use CodeIgniter\HTTP\ResponseInterface;

class ResourceViewController extends BaseResourceViewController
{
    public function initController(
        IncomingRequest|\CodeIgniter\HTTP\CLIRequest $request,
        ResponseInterface $response,
        \Psr\Log\LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }
}
```

> **Base:** `src/app/Controllers/Api/V1/BaseResourceViewController.php`
> 8 endpoints já implementados (findView, getGroupedView, searchView, getView,
> getAllView, getNoPaginationView, getDeletedView, getDeletedAllView).

---

## Resumo por tipo de módulo

| Tipo de módulo    | Model                        | Service            | Controller                    | Rotas              |
| ----------------- | ---------------------------- | ------------------ | ----------------------------- | ------------------ |
| Só tabela         | SqlTableModel                | `BaseTableService` | `BaseResourceTableController` | EndpointTable.php  |
| Tabela + View     | SqlTableModel + SqlViewModel | `BaseTableService` | Table + View controllers      | Ambos os endpoints |
| Só view (leitura) | SqlViewModel                 | `BaseViewService`  | `BaseResourceViewController`  | EndpointView.php   |

---

## Referência das classes base

| Classe base                   | Arquivo                                                      | Estende                       |
| ----------------------------- | ------------------------------------------------------------ | ----------------------------- |
| `BaseTableModel`              | `src/app/Models/V1/BaseTableModel.php`                       | `Model` (CI4)                 |
| `BaseViewModel`               | `src/app/Models/V1/BaseViewModel.php`                        | `Model` (CI4)                 |
| `BaseViewService`             | `src/app/Services/V1/BaseViewService.php`                    | —                             |
| `BaseTableService`            | `src/app/Services/V1/BaseTableService.php`                   | `BaseViewService`             |
| `BaseResourceTableController` | `src/app/Controllers/Api/V1/BaseResourceTableController.php` | `ResourceController`          |
| `BaseResourceViewController`  | `src/app/Controllers/Api/V1/BaseResourceViewController.php`  | `BaseResourceTableController` |
