# ROADMAP — BaseResourceTableController

> **Público-alvo:** Desenvolvedor júnior que precisa entender como a classe base de controllers funciona, quais endpoints ela fornece automaticamente e como criar um controller de módulo herdando dela.
>
> **Arquivo documentado:** `src/app/Controllers/Api/V1/BaseResourceTableController.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [O que você PRECISA implementar no filho](#3-o-que-você-precisa-implementar-no-filho)
4. [Endpoints de Leitura (9 endpoints)](#4-endpoints-de-leitura-9-endpoints)
5. [Endpoints de Escrita (2 endpoints)](#5-endpoints-de-escrita-2-endpoints)
6. [Endpoints de Exclusão (4 endpoints)](#6-endpoints-de-exclusão-4-endpoints)
7. [Helpers de Resposta](#7-helpers-de-resposta)
8. [Utilitários de Requisição](#8-utilitários-de-requisição)
9. [Exemplo Completo — Como herdar esta classe](#9-exemplo-completo--como-herdar-esta-classe)
10. [Fluxo de uma requisição ponta a ponta](#10-fluxo-de-uma-requisição-ponta-a-ponta)
11. [Erros Comuns](#11-erros-comuns)
12. [Sobre o Autor](#12-sobre-o-autor)

---

## 1. Visão Geral

`BaseResourceTableController` é a **classe base de todos os controllers de tabela** da API V1.

Ela implementa os **15 endpoints REST completos** — leitura, escrita e exclusão — de forma padronizada. Nenhum módulo precisa reimplementar esses endpoints. Basta herdar a classe e declarar duas coisas:

1. Qual `Processor` (Service) usar.
2. Quais regras de validação aplicar no `create` e no `update`.

**O que ela fornece:**

| Grupo    | Qtd | Endpoints                                                                                         |
| -------- | --- | ------------------------------------------------------------------------------------------------- |
| Leitura  | 9   | find, getGrouped, search, get, getAll, getNoPagination, getDeleted, getDeletedAll, getWithDeleted |
| Escrita  | 2   | create, update                                                                                    |
| Exclusão | 4   | deleteSoft, deleteRestore, deleteHard, clearDeleted (×2 rotas)                                    |

**O que ela NÃO faz:**

- Não acessa o banco diretamente — delega tudo ao `$processor` (Service).
- Não contém regras de negócio — isso é responsabilidade do `Processor`.
- Não define as regras de validação — o filho as declara.

---

## 2. Hierarquia de Classes

```
CodeIgniter\Controller
  └── App\Controllers\BaseController
        └── App\Controllers\Api\V1\BaseResourceTableController   ← você está aqui
              └── App\Controllers\Api\V1\BaseResourceViewController
                    └── Controllers específicos de cada módulo
                        Ex: App\Controllers\Api\V1\Mec\VehicleBrand\ResourceTableController
```

**Papel de cada nível:**

| Classe                        | Responsabilidade                                               |
| ----------------------------- | -------------------------------------------------------------- |
| `CodeIgniter\Controller`      | Bootstrap do framework (request, response, logger)             |
| `BaseController`              | Helpers globais, configuração da aplicação                     |
| `BaseResourceTableController` | **15 endpoints REST + helpers de resposta + utilitários HTTP** |
| `BaseResourceViewController`  | Sobrescreve os 9 endpoints para operar sobre view SQL          |
| Controller do módulo          | Declara `$processor`, `getCreateRules()` e `getUpdateRules()`  |

> **Regra:** nunca altere `BaseResourceTableController` para adicionar lógica de módulo.
> Ela é **imutável** — mudanças aqui afetam todos os módulos do sistema.

---

## 3. O que você PRECISA implementar no filho

A classe tem **dois métodos abstratos** — o filho é obrigado a implementar ambos:

### `getCreateRules(): array`

Retorna as regras de validação do CodeIgniter para o endpoint `POST /create`.

```php
protected function getCreateRules(): array
{
    return (new CreateRequest())->rules();
}
```

> Se não houver validação, retorne `[]` — mas evite isso em produção.

### `getUpdateRules(): array`

Retorna as regras de validação para o endpoint `PUT /update/{id}`.

```php
protected function getUpdateRules(): array
{
    return (new UpdateRequest())->rules();
}
```

> **Atenção:** `BaseResourceViewController` implementa esses métodos como `final` retornando `[]`,
> pois views não recebem escrita direta. Controllers de tabela precisam implementar manualmente.

### `initController()` — declara o Processor

Não é abstrato, mas é onde você injeta o Service do módulo:

```php
public function initController(
    RequestInterface $request,
    ResponseInterface $response,
    LoggerInterface $logger
): void {
    parent::initController($request, $response, $logger);
    $this->processor = new Processor(); // ← obrigatório
}
```

> Se esquecer de declarar `$this->processor`, todos os endpoints vão lançar erro 500.

---

## 4. Endpoints de Leitura (9 endpoints)

### 4.1 — `find()` · `POST /find`

Busca paginada com filtros dinâmicos de igualdade (WHERE exato ou LIKE para campos de texto).

**Query string:** `?page=1&limit=20&sort=id&order=desc`

**Body JSON:**

```json
{ "name": "Toyota", "user_saas_tenants_id": 1 }
```

- Cada chave é um campo da tabela.
- Campos declarados em `$likeFields` do Model usam `LIKE %valor%`.
- Os demais usam `WHERE campo = valor` (exato).
- Body vazio retorna todos os registros ativos paginados.

**Resposta 200:**

```json
{
  "method": "POST",
  "endpoint": "/api/v1/vehicle-brand/find",
  "statusCode": 200,
  "message": "Registros listados com sucesso",
  "success": true,
  "data": [{ "id": 1, "name": "Toyota" }],
  "pagination": { "page": 1, "limit": 20, "total": 1, "pages": 1 }
}
```

---

### 4.2 — `getGrouped()` · `POST /get-grouped`

Busca paginada com filtros multivalorados. Cada campo aceita um array de valores (`WHERE IN`).

**Query string:** `?page=1&limit=20&sort=id&order=desc`

**Body JSON:**

```json
{ "user_saas_tenants_id": [1, 2, 3], "name": ["Toyota", "Honda"] }
```

- Cada chave é um campo da tabela.
- Cada valor deve ser um **array não vazio** de strings ou números.
- Gera `WHERE campo IN (...)` para cada chave — **sem GROUP BY**.

**Validação de body:** se o body estiver vazio ou não tiver nenhum array válido, retorna **422**.

**Resposta 200:** igual ao `find` (paginada).

---

### 4.3 — `search()` · `GET /search`

Busca textual paginada usando `LIKE %termo%` nos campos declarados em `$searchFields` do Model.
Os campos são combinados com `OR` — basta o termo aparecer em qualquer um deles.

**Query string:** `?q=toyota&page=1&limit=20&sort=id&order=desc`

- `q` — o termo pesquisado (pode ser vazio; retorna todos se vazio).
- Somente campos em `public array $searchFields` do Model são pesquisados.

**Resposta 200:** paginada.

---

### 4.4 — `get(int $id)` · `GET /get/{id}`

Busca um registro **ativo** pelo ID. Soft-deleted não são retornados.

**Resposta 200:**

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get/1",
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": { "id": 1, "name": "Toyota" }
}
```

**Resposta 404** (não encontrado ou soft-deleted):

```json
{
  "statusCode": 404,
  "message": "Registro não encontrado ou foi excluído",
  "success": false
}
```

---

### 4.5 — `getAll()` · `GET /get-all`

Lista paginada de **todos os registros ativos** sem filtros.

**Query string:** `?page=1&limit=20&sort=id&order=desc`

**Resposta 200:** paginada (igual ao `find` sem body).

---

### 4.6 — `getNoPagination()` · `GET /get-no-pagination`

Lista **todos os registros ativos** sem paginação, em um único array.

**Query string:** `?sort=id&order=desc`

> **Cuidado:** use com parcimônia em tabelas com muitos registros — pode retornar grande volume de dados.

**Resposta 200:**

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get-no-pagination",
  "statusCode": 200,
  "message": "Operação realizada com sucesso",
  "success": true,
  "data": [
    { "id": 1, "name": "Toyota" },
    { "id": 2, "name": "Honda" }
  ]
}
```

---

### 4.7 — `getDeleted(int $id)` · `GET /get-deleted/{id}`

Busca um registro **somente se estiver soft-deleted** (`deleted_at` preenchido).
Registros ativos não são retornados por este endpoint.

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro deletado encontrado com sucesso",
  "success": true,
  "data": { "id": 5, "name": "Fiat", "deleted_at": "2026-03-10 14:00:00" }
}
```

**Resposta 404** (não existe ou não está soft-deleted):

```json
{
  "statusCode": 404,
  "message": "Registro deletado não encontrado",
  "success": false
}
```

---

### 4.8 — `getDeletedAll()` · `GET /get-deleted-all`

Lista paginada de **todos os registros soft-deleted**.

**Query string:** `?page=1&limit=20&sort=id&order=desc`

**Resposta 200:** paginada, somente registros com `deleted_at IS NOT NULL`.

---

### 4.9 — `getWithDeleted(int $id)` · `GET /get-with-deleted/{id}`

Busca um registro pelo ID **independente do estado** — ativo ou soft-deleted.
Útil para inspecionar um registro antes de decidir restaurar ou apagar permanentemente.

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": { "id": 5, "name": "Fiat", "deleted_at": "2026-03-10 14:00:00" }
}
```

---

## 5. Endpoints de Escrita (2 endpoints)

### 5.1 — `create()` · `POST /create`

Cria um novo registro. Executa validação do Request antes de chamar o Processor.

**Fluxo interno:**

```
1. validate(getCreateRules())        ← regras do Request (formato, obrigatoriedade)
2. processor->create(getJsonBody())  ← sanitização + validação de negócio + insert
3. Retorna o registro criado (201)
```

**Body JSON:**

```json
{ "user_saas_tenants_id": 1, "name": "Toyota" }
```

**Resposta 201 (criado):**

```json
{
  "method": "POST",
  "endpoint": "/api/v1/vehicle-brand/create",
  "statusCode": 201,
  "message": "Registro criado com sucesso",
  "success": true,
  "data": {
    "id": 10,
    "user_saas_tenants_id": 1,
    "name": "Toyota",
    "created_at": "2026-05-09 15:00:00"
  }
}
```

**Resposta 422 (falha na validação do Request):**

```json
{
  "statusCode": 422,
  "message": "Erro de validação",
  "success": false,
  "errors": { "name": "O campo name é obrigatório" }
}
```

**Resposta 409 (conflito de negócio — ex.: nome duplicado):**

```json
{ "statusCode": 409, "message": "Marca já cadastrada", "success": false }
```

---

### 5.2 — `update(int $id)` · `PUT /update/{id}`

Atualiza um registro existente. Aceita atualização parcial (não é necessário enviar todos os campos).

**Fluxo interno:**

```
1. validate(getUpdateRules())             ← regras do Request
2. processor->update($id, getJsonBody())  ← verifica existência + sanitização + update
3. Retorna o registro atualizado (200)
```

**Body JSON** (apenas os campos que deseja alterar):

```json
{ "name": "Toyota Motors" }
```

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro atualizado com sucesso",
  "success": true,
  "data": {
    "id": 10,
    "name": "Toyota Motors",
    "updated_at": "2026-05-09 16:00:00"
  }
}
```

**Resposta 404** (registro não encontrado ou soft-deleted):

```json
{
  "statusCode": 404,
  "message": "Registro não encontrado ou foi excluído",
  "success": false
}
```

---

## 6. Endpoints de Exclusão (4 endpoints)

### 6.1 — `deleteSoft(int $id)` · `DELETE /delete-soft/{id}`

**Soft delete:** preenche `deleted_at` com a data atual. O registro continua no banco mas não aparece nas buscas normais.

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro excluído logicamente com sucesso",
  "success": true
}
```

**Resposta 409** (já estava soft-deleted):

```json
{
  "statusCode": 409,
  "message": "Registro já está excluído logicamente",
  "success": false
}
```

---

### 6.2 — `deleteRestore(int $id)` · `PATCH /delete-restore/{id}`

**Restaura** um registro soft-deleted: zera o campo `deleted_at`, tornando-o ativo novamente.

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro restaurado com sucesso",
  "success": true
}
```

**Resposta 404** (registro não está soft-deleted):

```json
{
  "statusCode": 404,
  "message": "Registro deletado não encontrado",
  "success": false
}
```

---

### 6.3 — `deleteHard(int $id)` · `DELETE /delete-hard/{id}`

**Hard delete:** remove o registro permanentemente do banco. Funciona em registros ativos e soft-deleted.

> **Irreversível.** Use com cuidado — não há como recuperar após este endpoint.

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro excluído permanentemente com sucesso",
  "success": true
}
```

---

### 6.4 — `clearDeleted(?int $id)` · `DELETE /clear-deleted` e `DELETE /clear-deleted/{id}`

Remove permanentemente registros soft-deleted.

| Rota                      | Comportamento                                      |
| ------------------------- | -------------------------------------------------- |
| `DELETE /clear-deleted`   | Hard delete em **todos** os soft-deleted da tabela |
| `DELETE /clear-deleted/5` | Hard delete somente no registro `id = 5`           |

> Só afeta registros que já estão soft-deleted (`deleted_at IS NOT NULL`).

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registros deletados removidos com sucesso",
  "success": true,
  "data": { "affected": 3 }
}
```

- `affected`: quantidade de registros removidos permanentemente.

---

## 7. Helpers de Resposta

Todos os controllers filhos herdam esses métodos. Use-os caso precise sobrescrever algum endpoint.
Todos incluem automaticamente `method`, `endpoint` e `statusCode` no body JSON.

---

### `respondSuccess()`

```php
protected function respondSuccess(
    mixed $data = null,
    string $message = 'Operação realizada com sucesso',
    int $statusCode = 200
): ResponseInterface
```

**Quando usar:** retorno de um único registro ou operação sem conteúdo de lista.

**Saída:**

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get/1",
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": { "id": 1, "name": "Toyota" }
}
```

> Se `$data` for `null`, a chave `data` **não aparece** no JSON.

---

### `respondCreated()`

```php
protected function respondCreated(
    mixed $data = null,
    string $message = 'Registro criado com sucesso'
): ResponseInterface
```

**HTTP Status:** `201 Created`

Internamente chama `respondSuccess($data, $message, 201)`.
Usado exclusivamente pelo endpoint `create()`.

---

### `respondPaginated()`

```php
protected function respondPaginated(
    array $data,
    array $pagination,
    string $message = 'Registros listados com sucesso'
): ResponseInterface
```

**Quando usar:** qualquer resposta com lista paginada.

**Formato esperado para `$pagination`:**

```php
[
    'page'  => 1,   // página atual
    'limit' => 20,  // registros por página
    'total' => 45,  // total de registros no banco (sem paginação)
    'pages' => 3,   // ceil(total / limit)
]
```

**Saída:**

```json
{
  "method": "GET",
  "endpoint": "/api/v1/vehicle-brand/get-all",
  "statusCode": 200,
  "message": "Registros listados com sucesso",
  "success": true,
  "data": [{ "id": 1, "name": "Toyota" }],
  "pagination": { "page": 1, "limit": 20, "total": 45, "pages": 3 }
}
```

---

### `respondNotFound()`

```php
protected function respondNotFound(
    string $message = 'Registro não encontrado'
): ResponseInterface
```

**HTTP Status:** `404 Not Found`

```json
{
  "statusCode": 404,
  "message": "Registro não encontrado ou foi excluído",
  "success": false
}
```

---

### `respondValidationError()`

```php
protected function respondValidationError(
    array $errors = [],
    string $message = 'Erro de validação'
): ResponseInterface
```

**HTTP Status:** `422 Unprocessable Entity`

```json
{
  "statusCode": 422,
  "message": "Erro de validação",
  "success": false,
  "errors": {
    "name": "O campo name é obrigatório",
    "user_saas_tenants_id": "O campo user_saas_tenants_id deve ser um número inteiro"
  }
}
```

---

### `respondError()`

```php
protected function respondError(
    string $message,
    int $statusCode = 400
): ResponseInterface
```

**Quando usar:** erros de negócio retornados pelo Processor (conflito de unicidade, FK inválida, etc.).

Os endpoints `create()` e `update()` usam este método quando `$result['success'] === false`,
passando o código HTTP retornado pelo Processor (`$result['code']`).

**Exemplo de saída (409 Conflict):**

```json
{ "statusCode": 409, "message": "Marca já cadastrada", "success": false }
```

---

### `respondServerError()`

```php
protected function respondServerError(\Throwable $e): ResponseInterface
```

**HTTP Status:** `500 Internal Server Error`

Chamado automaticamente pelo bloco `catch (\Throwable $e)` de cada endpoint.
Loga o erro via `log_message('error', ...)` antes de responder.

**Em produção:**

```json
{ "statusCode": 500, "message": "Erro interno no servidor", "success": false }
```

**Em `ENVIRONMENT=development`** — inclui detalhes do erro para facilitar o debug:

```json
{
  "statusCode": 500,
  "message": "Erro interno no servidor",
  "success": false,
  "debug": {
    "exception": "CodeIgniter\\Database\\Exceptions\\DatabaseException",
    "message": "Table 'mec_01_vehicle_brand' doesn't exist",
    "file": "/var/www/html/app/Models/V1/BaseTableModel.php",
    "line": 99
  }
}
```

> O campo `debug` **nunca aparece em produção**.

---

## 8. Utilitários de Requisição

### `getPaginationParams(): array`

Extrai e normaliza os parâmetros de paginação da query string.

```php
protected function getPaginationParams(): array
{
    return [
        'page'  => max(1, (int) ($this->request->getGet('page') ?? 1)),
        'limit' => min(100, max(1, (int) ($this->request->getGet('limit') ?? 20))),
        'sort'  => trim((string) ($this->request->getGet('sort') ?? 'id')),
        'order' => trim((string) ($this->request->getGet('order') ?? 'desc')),
    ];
}
```

| Parâmetro | Padrão | Regra de segurança                                 |
| --------- | ------ | -------------------------------------------------- |
| `page`    | `1`    | `max(1, valor)` — mínimo 1                         |
| `limit`   | `20`   | `min(100, max(1, valor))` — entre 1 e 100          |
| `sort`    | `id`   | Validado pela whitelist `$sortableFields` no Model |
| `order`   | `desc` | Validado para `asc` ou `desc` no Model             |

> Se o frontend enviar `?limit=9999`, o método limita para **100** automaticamente.

---

### `getJsonBody(): array`

Decodifica o body JSON da requisição e garante retorno como array.

```php
protected function getJsonBody(): array
{
    return (array) ($this->request->getJSON(true) ?? []);
}
```

- Body vazio ou inválido → retorna `[]`.
- `true` no `getJSON()` → retorna array associativo (não objeto).
- Cast `(array)` → protege contra `null`.

> **Lembre-se:** o frontend deve enviar `Content-Type: application/json` para o body ser lido.

---

## 9. Exemplo Completo — Como herdar esta classe

Exemplo real: módulo **VehicleBrand** (`Mec`).

### Arquivo `ResourceTableController.php`

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
    // Passo 1 — declarar o Processor no initController
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor(); // ← obrigatório
    }

    // Passo 2 — implementar os dois métodos abstratos
    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }

    // Pronto. Os 15 endpoints estão disponíveis automaticamente.
}
```

### Arquivo `EndpointTable.php` — como as rotas apontam para o controller

```php
<?php
$routes->post('find',                   'Api\V1\Mec\VehicleBrand\ResourceTableController::find');
$routes->post('get-grouped',            'Api\V1\Mec\VehicleBrand\ResourceTableController::getGrouped');
$routes->get('search',                  'Api\V1\Mec\VehicleBrand\ResourceTableController::search');
$routes->get('get/(:num)',              'Api\V1\Mec\VehicleBrand\ResourceTableController::get/$1');
$routes->get('get-all',                 'Api\V1\Mec\VehicleBrand\ResourceTableController::getAll');
$routes->get('get-no-pagination',       'Api\V1\Mec\VehicleBrand\ResourceTableController::getNoPagination');
$routes->get('get-deleted/(:num)',      'Api\V1\Mec\VehicleBrand\ResourceTableController::getDeleted/$1');
$routes->get('get-deleted-all',         'Api\V1\Mec\VehicleBrand\ResourceTableController::getDeletedAll');
$routes->get('get-with-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::getWithDeleted/$1');
$routes->post('create',                 'Api\V1\Mec\VehicleBrand\ResourceTableController::create');
$routes->put('update/(:num)',           'Api\V1\Mec\VehicleBrand\ResourceTableController::update/$1');
$routes->delete('delete-soft/(:num)',   'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteSoft/$1');
$routes->patch('delete-restore/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteRestore/$1');
$routes->delete('delete-hard/(:num)',   'Api\V1\Mec\VehicleBrand\ResourceTableController::deleteHard/$1');
$routes->delete('clear-deleted',        'Api\V1\Mec\VehicleBrand\ResourceTableController::clearDeleted');
$routes->delete('clear-deleted/(:num)', 'Api\V1\Mec\VehicleBrand\ResourceTableController::clearDeleted/$1');
```

---

## 10. Fluxo de uma requisição ponta a ponta

Exemplo: `POST /api/v1/vehicle-brand/create` com body `{"name": "Toyota"}`.

```
1. Nginx recebe a requisição → passa para PHP-FPM

2. CodeIgniter roteia para ResourceTableController::create()
   (definido em EndpointTable.php via Routes.php)

3. BaseResourceTableController::create() é executado:
   │
   ├── validate(getCreateRules())
   │     └── CreateRequest::rules() → ['name' => 'required|string|max_length[100]']
   │     └── Falha → respondValidationError() → HTTP 422 ✗
   │
   ├── processor->create(getJsonBody())
   │     └── getJsonBody() → ['name' => 'Toyota']
   │     └── BaseTableService::create():
   │           ├── sanitizeData()     → remove tags HTML e espaços
   │           ├── removeMasks()      → remove máscaras (não se aplica aqui)
   │           ├── validateOnCreate() → existsByName('Toyota')? → HTTP 409 se sim ✗
   │           ├── prepareData()      → transformações (nenhuma aqui)
   │           └── tableModel->insert(['name' => 'Toyota']) → id = 10
   │
   └── respondCreated($result['data']) → HTTP 201 ✓
```

---

## 11. Erros Comuns

| Sintoma                                        | Causa mais provável                                          | Solução                                                         |
| ---------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------- |
| Todos os endpoints retornam 500                | `$this->processor` não declarado no `initController`         | Adicione `$this->processor = new Processor();`                  |
| `create` ignora dados do body                  | Header `Content-Type: application/json` ausente              | Envie o header correto na requisição                            |
| `create` retorna 422 com dados corretos        | Regras do `CreateRequest` mais restritivas do que o esperado | Revise `rules()` no `CreateRequest` do módulo                   |
| `update` retorna 404 para ID existente         | Registro está soft-deleted                                   | Use `getWithDeleted` para confirmar, depois `deleteRestore`     |
| `getGrouped` retorna 422                       | Valores do body não são arrays                               | Envie `{"campo": ["valor1", "valor2"]}` — arrays obrigatórios   |
| `search` não retorna resultados                | `$searchFields` vazio ou campo errado no SqlTableModel       | Declare `public array $searchFields` no Model do módulo         |
| `clearDeleted` retorna `"affected": 0`         | Não há registros soft-deleted na tabela                      | Execute `deleteSoft` em algum registro antes de testar          |
| Campo `debug` não aparece nos erros 500        | `ENVIRONMENT` não está como `development`                    | Verifique `CI_ENVIRONMENT=development` no arquivo `.env`        |
| `sort` e `order` da query string são ignorados | Campo não está em `$sortableFields` no Model                 | Adicione o campo à whitelist `$sortableFields` no SqlTableModel |

---

## 12. Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
