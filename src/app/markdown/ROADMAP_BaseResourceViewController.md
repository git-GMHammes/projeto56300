# ROADMAP — BaseResourceViewController

> **Público-alvo:** Desenvolvedor júnior que precisa entender como usar a classe base de controllers somente leitura, quais endpoints ela fornece via View SQL e como criar um controller de módulo herdando dela.
>
> **Arquivo documentado:** `src/app/Controllers/Api/V1/BaseResourceViewController.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [Diferença entre TableController e ViewController](#3-diferença-entre-tablecontroller-e-viewcontroller)
4. [O que você PRECISA implementar no filho](#4-o-que-você-precisa-implementar-no-filho)
5. [Endpoints de Leitura (8 endpoints)](#5-endpoints-de-leitura-8-endpoints)
6. [Por que não há escrita?](#6-por-que-não-há-escrita)
7. [Helpers de Resposta (herdados)](#7-helpers-de-resposta-herdados)
8. [Utilitários de Requisição (herdados)](#8-utilitários-de-requisição-herdados)
9. [Exemplo Completo — ResourceViewController de Módulo](#9-exemplo-completo--resourceviewcontroller-de-módulo)
10. [Fluxo ponta a ponta](#10-fluxo-ponta-a-ponta)
11. [Erros Comuns](#11-erros-comuns)
12. [Sobre o Autor](#12-sobre-o-autor)

---

## 1. Visão Geral

`BaseResourceViewController` é a classe base para controllers que expõem dados **somente leitura** via SQL View.

Ela herda de `BaseResourceTableController` mas **sobrescreve todos os 8 endpoints de leitura** para chamar os métodos `*View` do processor, que por sua vez leem de uma `SqlViewModel` (view SQL) em vez de uma tabela física.

Operações de escrita (`create`, `update`) e exclusão (`deleteSoft`, `deleteRestore`, `deleteHard`, `clearDeleted`) **não são expostas** — são bloqueadas pelos hooks `final`.

**Quando usar:**

- O módulo precisa expor dados de uma SQL View com JOINs complexos
- Os dados são lidos (agregados, formatados) mas **não alterados** diretamente pela View
- A escrita acontece pelo `ResourceTableController` do mesmo módulo

---

## 2. Hierarquia de Classes

```
CodeIgniter\Controller
  └── App\Controllers\BaseController
        └── App\Controllers\Api\V1\BaseResourceTableController
              └── App\Controllers\Api\V1\BaseResourceViewController   ← AQUI
                    └── SeuModuloViewController   (controller filho do módulo)
```

O `BaseResourceViewController` está **um nível abaixo** do `BaseResourceTableController` na hierarquia. Ele herda todos os helpers de resposta e utilitários de requisição, mas sobrescreve os endpoints de leitura para trabalhar com Views.

---

## 3. Diferença entre TableController e ViewController

| Característica          | `BaseResourceTableController`                               | `BaseResourceViewController`         |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------ |
| Fonte de dados          | Tabela física (`SqlTableModel`)                             | View SQL (`SqlViewModel`)            |
| Endpoints de leitura    | 9                                                           | 8 (usa métodos `*View` do processor) |
| Endpoints de escrita    | `create`, `update`                                          | ❌ Bloqueados (`final []`)           |
| Endpoints de exclusão   | `deleteSoft`, `deleteRestore`, `deleteHard`, `clearDeleted` | ❌ Não disponíveis                   |
| `getCreateRules`        | Abstrato — você implementa                                  | `final` — retorna `[]`               |
| `getUpdateRules`        | Abstrato — você implementa                                  | `final` — retorna `[]`               |
| Processor base          | `BaseTableService`                                          | `BaseViewService`                    |
| `get-with-deleted/{id}` | ✅ Disponível                                               | ❌ Não sobrescrito                   |

---

## 4. O que você PRECISA implementar no filho

Um controller de módulo que herda de `BaseResourceViewController` precisa implementar **apenas um método**:

```php
public function initController(
    RequestInterface $request,
    ResponseInterface $response,
    LoggerInterface $logger
): void {
    parent::initController($request, $response, $logger);
    $this->processor = new SeuModuloViewProcessor();
}
```

**Não precisa implementar:**

- `getCreateRules()` — já é `final` retornando `[]`
- `getUpdateRules()` — já é `final` retornando `[]`
- Nenhum endpoint — todos os 8 já estão implementados na base

---

## 5. Endpoints de Leitura (8 endpoints)

Todos os endpoints chamam os métodos `*View` do processor, que leem de uma `SqlViewModel`.

### 5.1 `find` — Busca com filtros exatos

```
POST /api/v1/{modulo}/{recurso-view}/find
     ?page=1&limit=20&sort=id&order=desc
```

**Body JSON:**

```json
{ "status": "ativo", "user_saas_tenants_id": 1 }
```

Cada chave é um campo da view; cada valor é um escalar para `WHERE` exato.
**Chama:** `$this->processor->findView($filters, $pagination)`

**Resposta:**

```json
{
  "method": "POST",
  "endpoint": "/api/v1/mec/vehicle-brand-view/find",
  "statusCode": 200,
  "message": "Registros listados com sucesso",
  "success": true,
  "data": [{ "id": 1, "name": "Toyota", "total_models": 12 }],
  "pagination": { "page": 1, "limit": 20, "total": 1, "pages": 1 }
}
```

---

### 5.2 `get-grouped` — Busca com filtros múltiplos (WHERE IN)

```
POST /api/v1/{modulo}/{recurso-view}/get-grouped
     ?page=1&limit=20&sort=id&order=desc
```

**Body JSON:**

```json
{ "status": ["ativo", "pendente"], "user_saas_tenants_id": [1, 2, 3] }
```

Cada chave é um campo; cada valor é um array para `WHERE IN`.
**Chama:** `$this->processor->getGroupedView($multiFilters, $pagination)`

---

### 5.3 `search` — Busca textual

```
GET /api/v1/{modulo}/{recurso-view}/search?q=toyota&page=1&limit=20
```

**Chama:** `$this->processor->searchView($term, $pagination)`

A busca é feita nos campos declarados em `$searchFields` do `SqlViewModel`.

---

### 5.4 `get/{id}` — Busca por ID

```
GET /api/v1/{modulo}/{recurso-view}/get/1
```

**Chama:** `$this->processor->getView($id)`

**Resposta 200:**

```json
{
  "statusCode": 200,
  "message": "Registro encontrado com sucesso",
  "success": true,
  "data": { "id": 1, "name": "Toyota", "total_models": 12 }
}
```

**Resposta 404:**

```json
{
  "statusCode": 404,
  "message": "Registro não encontrado ou foi excluído",
  "success": false
}
```

---

### 5.5 `get-all` — Listagem completa paginada

```
GET /api/v1/{modulo}/{recurso-view}/get-all?page=1&limit=20&sort=id&order=desc
```

**Chama:** `$this->processor->getAllView($pagination)`

---

### 5.6 `get-no-pagination` — Listagem completa sem paginação

```
GET /api/v1/{modulo}/{recurso-view}/get-no-pagination?sort=name&order=asc
```

**Chama:** `$this->processor->getNoPaginationView($sort, $order)`

> Use com cautela em views com muitos registros.

---

### 5.7 `get-deleted/{id}` — Busca registro soft-deleted por ID

```
GET /api/v1/{modulo}/{recurso-view}/get-deleted/5
```

**Chama:** `$this->processor->getDeletedView($id)`

Retorna apenas registros com `deleted_at IS NOT NULL`.

---

### 5.8 `get-deleted-all` — Listagem de registros soft-deleted

```
GET /api/v1/{modulo}/{recurso-view}/get-deleted-all?page=1&limit=20
```

**Chama:** `$this->processor->getDeletedAllView($pagination)`

---

## 6. Por que não há escrita?

Views SQL são **agregações de tabelas físicas**. Escrever diretamente em uma view seria:

- Tecnicamente impossível em views com `JOIN` no MySQL
- Arquiteturalmente errado — a view é leitura; a escrita acontece na tabela via `ResourceTableController`

Por isso `getCreateRules` e `getUpdateRules` são declarados como `final` retornando `[]`:

```php
final protected function getCreateRules(): array { return []; }
final protected function getUpdateRules(): array { return []; }
```

Isso impede que um controller filho tente ativar os endpoints de escrita herdados da `BaseResourceTableController`.

---

## 7. Helpers de Resposta (herdados)

Todos os helpers são herdados de `BaseResourceTableController`. O ViewController não os redefine.

| Método                                           | HTTP | Uso                       |
| ------------------------------------------------ | ---- | ------------------------- |
| `respondSuccess($data, $message, $code)`         | 200  | Registro único encontrado |
| `respondPaginated($data, $pagination, $message)` | 200  | Listas paginadas          |
| `respondNotFound($message)`                      | 404  | Registro não encontrado   |
| `respondValidationError($errors, $message)`      | 422  | Filtros inválidos         |
| `respondServerError($e)`                         | 500  | Exceção não tratada       |

Veja exemplos completos de cada resposta em [ROADMAP_BaseResourceTableController.md](ROADMAP_BaseResourceTableController.md).

---

## 8. Utilitários de Requisição (herdados)

Também herdados de `BaseResourceTableController`:

```php
// Lê os parâmetros de paginação da query string
$this->getPaginationParams();
// Retorna: ['page' => 1, 'limit' => 20, 'sort' => 'id', 'order' => 'desc']

// Lê e decodifica o body JSON da requisição
$this->getJsonBody();
// Retorna: array ([] se body vazio ou inválido)
```

---

## 9. Exemplo Completo — ResourceViewController de Módulo

Exemplo real: controller de view para o módulo Mecânica (marcas com total de modelos).

```php
<?php

namespace App\Controllers\Api\V1\Mec;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Services\V1\Mec\VehicleBrandViewProcessor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class VehicleBrandViewController extends BaseResourceViewController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new VehicleBrandViewProcessor();
    }
}
```

**Pronto.** Os 8 endpoints de leitura via View estão disponíveis automaticamente.

**Registrando as rotas:**

```php
$routes->group('api/v1/mec', ['filter' => 'auth'], function ($routes) {
    $routes->post('vehicle-brand-view/find',              'Mec\VehicleBrandViewController::find');
    $routes->post('vehicle-brand-view/get-grouped',       'Mec\VehicleBrandViewController::getGrouped');
    $routes->get('vehicle-brand-view/search',             'Mec\VehicleBrandViewController::search');
    $routes->get('vehicle-brand-view/get/(:num)',         'Mec\VehicleBrandViewController::get/$1');
    $routes->get('vehicle-brand-view/get-all',            'Mec\VehicleBrandViewController::getAll');
    $routes->get('vehicle-brand-view/get-no-pagination',  'Mec\VehicleBrandViewController::getNoPagination');
    $routes->get('vehicle-brand-view/get-deleted/(:num)', 'Mec\VehicleBrandViewController::getDeleted/$1');
    $routes->get('vehicle-brand-view/get-deleted-all',    'Mec\VehicleBrandViewController::getDeletedAll');
});
```

---

## 10. Fluxo ponta a ponta

```
Cliente HTTP
    │
    │  GET /api/v1/mec/vehicle-brand-view/get-all?page=1&limit=20
    ▼
Filtro Auth (JWT Bearer Token)
    │  valida token → extrai user_saas_tenants_id
    ▼
VehicleBrandViewController::getAll()         ← controller filho (apenas initController)
    │  herda de BaseResourceViewController
    ▼
BaseResourceViewController::getAll()
    │  $this->getPaginationParams()
    │  $this->processor->getAllView($pagination)
    ▼
VehicleBrandViewProcessor::getAllView()       ← BaseViewService implementa
    │  $this->viewModel->findAllView($pagination)
    ▼
VehicleBrandSqlViewModel                     ← BaseViewModel
    │  SELECT * FROM view_mec_vehicle_brand
    │  ORDER BY id DESC LIMIT 20 OFFSET 0
    ▼
MySQL — view_mec_vehicle_brand
    │  JOIN mec_01_vehicle_brand + mec_02_vehicle_model
    ▼
BaseResourceViewController::respondPaginated($data, $pagination)
    ▼
HTTP 200 — JSON com data[] + pagination{}
```

---

## 11. Erros Comuns

| Erro                                                        | Causa                                                                                    | Solução                                                     |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| `Call to undefined method ... findView()`                   | Processor herda de `BaseTableService` em vez de `BaseViewService`                        | Trocar herança do processor para `BaseViewService`          |
| `Class ... must implement abstract method getCreateRules()` | Controller herda de `BaseResourceTableController` em vez de `BaseResourceViewController` | Trocar a herança para `BaseResourceViewController`          |
| HTTP 500 em `get-deleted/{id}`                              | View não inclui a coluna `deleted_at`                                                    | Garantir que a view SQL expõe `deleted_at` da tabela física |
| Endpoint `create` retorna 422 com `errors: []`              | Tentou chamar `create` no ViewController                                                 | Use o `ResourceTableController` do módulo para escrita      |
| HTTP 500 em `find` com filtro                               | Campo do filtro não existe na view                                                       | Verificar os campos disponíveis na view SQL                 |

---

## 12. Sobre o Autor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
