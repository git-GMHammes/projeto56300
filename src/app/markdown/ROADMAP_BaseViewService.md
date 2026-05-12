# ROADMAP — BaseViewService (Sanitização + Formatação + Leitura de View)

> **Público-alvo:** Desenvolvedor júnior que precisa entender a classe raiz de todos os serviços da API V1 — de onde vêm os utilitários de sanitização, formatação e paginação usados em todo o projeto, e como funciona a leitura via SQL View.
>
> **Arquivo documentado:** `src/app/Services/V1/BaseViewService.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é o BaseViewService](#1-o-que-é-o-baseviewservice)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [Quando herdar BaseViewService vs BaseTableService](#3-quando-herdar-baseviewservice-vs-basetableservice)
4. [MASKED_FIELDS — Campos com Máscara](#4-masked_fields--campos-com-máscara)
5. [sanitizeString — Limpeza de string](#5-sanitizestring--limpeza-de-string)
6. [sanitizeData — Sanitização de array](#6-sanitizedata--sanitização-de-array)
7. [removeMasks — Remoção de máscaras](#7-removemasks--remoção-de-máscaras)
8. [formatDate — Formatação de data](#8-formatdate--formatação-de-data)
9. [formatDatetime — Formatação de data e hora](#9-formatdatetime--formatação-de-data-e-hora)
10. [buildPaginationParams — Parâmetros de paginação](#10-buildpaginationparams--parâmetros-de-paginação)
11. [Métodos de Leitura — View](#11-métodos-de-leitura--view)
12. [Como o Processor herda esta classe](#12-como-o-processor-herda-esta-classe)
13. [Fluxo Ponta a Ponta — Diagrama ASCII](#13-fluxo-ponta-a-ponta--diagrama-ascii)
14. [Erros Comuns](#14-erros-comuns)
15. [Sobre o Autor](#15-sobre-o-autor)

---

## 1. O que é o BaseViewService

`BaseViewService` é a **classe abstrata raiz** de toda a camada de serviço da API V1. Ela não se conecta a nenhuma tabela física — opera exclusivamente sobre **Views SQL** e fornece os utilitários compartilhados por todos os módulos do sistema.

```
BaseViewService
    ├── Utilitários de sanitização  (sanitizeString, sanitizeData, removeMasks)
    ├── Utilitários de formatação   (formatDate, formatDatetime)
    ├── Utilitários de paginação    (buildPaginationParams)
    └── Leitura de View             (findView, getGroupedView, searchView, ...)
```

Todo Processor do projeto — seja de leitura pura ou de escrita — herda indiretamente estes utilitários. Quando você chama `$this->sanitizeData()` ou `$this->formatDate()` no Processor, é o `BaseViewService` quem executa.

> `BaseViewService` é `abstract` — nunca é instanciada diretamente. Apenas o Processor filho é instanciado.

---

## 2. Hierarquia de Classes

```
abstract BaseViewService          ← raiz: utilitários + leitura de view
    └── abstract BaseTableService ← adiciona leitura de tabela + create/update + exclusão
            └── Processor         ← filho concreto de cada módulo
```

| Classe | O que fornece | Instanciada diretamente? |
| --- | --- | --- |
| `BaseViewService` | Sanitização, formatação, paginação, 8 reads de view | Não (`abstract`) |
| `BaseTableService` | Tudo acima + 9 reads de tabela + create/update + 4 exclusões | Não (`abstract`) |
| `Processor` | Declara models + sobrescreve hooks de negócio | **Sim** |

---

## 3. Quando herdar BaseViewService vs BaseTableService

| Cenário | Herdar de |
| --- | --- |
| Módulo **somente leitura** (usa apenas Views SQL, sem INSERT/UPDATE/DELETE) | `BaseViewService` |
| Módulo com **tabela física** (precisa de create, update, delete) | `BaseTableService` |

> `BaseTableService` já estende `BaseViewService` — ao herdar de `BaseTableService`, o Processor obtém **todos** os utilitários de `BaseViewService` automaticamente.

**Exemplo de módulo somente leitura:**
```php
// Processor que só lê uma View — herda BaseViewService diretamente
class Processor extends BaseViewService
{
    public function __construct()
    {
        $this->viewModel = new SqlViewModel();
    }
}
```

**Exemplo de módulo com tabela:**
```php
// Processor que lê e escreve — herda BaseTableService (que já estende BaseViewService)
class Processor extends BaseTableService
{
    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }
}
```

---

## 4. MASKED_FIELDS — Campos com Máscara

```php
private const MASKED_FIELDS = [
    'cpf', 'whatsapp', 'phone', 'zip_code',
    'uc_cpf', 'uc_whatsapp', 'uc_phone', 'uc_zip_code',
];
```

### Por que estes campos existem em duas versões?

Os campos `cpf`, `whatsapp`, `phone` e `zip_code` são nomes usados na **tabela física**. Quando esses dados aparecem em uma **View SQL com JOIN**, o alias recebe o prefixo `uc_` para evitar conflito de nomes entre tabelas:

```sql
-- Exemplo de View com JOIN:
SELECT
    u.id,
    c.cpf    AS uc_cpf,       ← prefixo "uc_" = user_customer
    c.phone  AS uc_phone,
    ...
FROM user_001_management u
JOIN user_002_customer c ON c.user_management_id = u.id
```

Ao adicionar `uc_cpf` na lista de `MASKED_FIELDS`, o `removeMasks()` funciona tanto em filtros de tabela (`cpf`) quanto em filtros de view (`uc_cpf`) — sem nenhum código extra.

### Regra de negócio

> Estes campos são sempre **armazenados e consultados apenas com dígitos**. A formatação com máscara (`123.456.789-00`) é responsabilidade exclusiva do frontend.

---

## 5. sanitizeString — Limpeza de string

```php
protected function sanitizeString(string $value): string
{
    return trim(strip_tags($value));
}
```

**O que faz:**
1. `strip_tags($value)` — remove toda tag HTML (`<b>`, `<script>`, `<img>`, etc.)
2. `trim(...)` — remove espaços em branco nas extremidades

**Exemplos:**

| Entrada | Saída |
| --- | --- |
| `"  Toyota  "` | `"Toyota"` |
| `"<b>Toyota</b>"` | `"Toyota"` |
| `"  <script>alert(1)</script>  "` | `""` |
| `"Toyota Corolla"` | `"Toyota Corolla"` |

> **Uso:** chamada internamente pelo `sanitizeData()` — raramente usada diretamente no Processor.

---

## 6. sanitizeData — Sanitização de array

```php
protected function sanitizeData(array $data): array
{
    $sanitized = [];

    foreach ($data as $key => $value) {
        if ($value === null || $value === '') {
            continue;                  // ← descarta null e string vazia
        }

        $sanitized[$key] = \is_string($value)
            ? $this->sanitizeString($value)
            : $value;                  // ← não-string (int, bool, array) passa sem alteração
    }

    return $sanitized;
}
```

### O que faz

1. Percorre cada chave do array recebido
2. **Descarta** chaves cujo valor seja `null` ou `""` (string vazia)
3. Em valores `string`: aplica `sanitizeString` (strip_tags + trim)
4. Em outros tipos (`int`, `bool`, `float`, `array`): mantém o valor sem alteração

### Por que descartar null e string vazia?

```php
// Sem sanitizeData — um UPDATE poderia zerar campos não intencionalmente:
$data = ['name' => 'Toyota', 'color' => '', 'year' => null];
$this->tableModel->update($id, $data);
// SQL: UPDATE ... SET name='Toyota', color='', year=NULL WHERE id=?
//       ↑ color e year seriam zerados mesmo sem intenção do usuário

// Com sanitizeData — apenas campos com valor real são persistidos:
$sanitized = $this->sanitizeData($data);
// $sanitized = ['name' => 'Toyota']
$this->tableModel->update($id, $sanitized);
// SQL: UPDATE ... SET name='Toyota' WHERE id=?  ← seguro
```

### Exemplo completo

```php
$data = [
    'name'     => '  <b>Toyota</b>  ',
    'color'    => '',           // descartado
    'year'     => 2020,         // int — mantido sem alteração
    'is_active'=> true,         // bool — mantido sem alteração
    'notes'    => null,         // descartado
];

$result = $this->sanitizeData($data);

// $result:
[
    'name'      => 'Toyota',
    'year'      => 2020,
    'is_active' => true,
]
```

---

## 7. removeMasks — Remoção de máscaras

```php
protected function removeMasks(array $data): array
{
    foreach (self::MASKED_FIELDS as $field) {
        if (!isset($data[$field])) {
            continue;
        }

        if (\is_array($data[$field])) {
            $data[$field] = array_map(
                static fn($v) => \is_string($v) ? preg_replace('/\D/', '', $v) : $v,
                $data[$field]
            );
        } elseif (\is_string($data[$field])) {
            $data[$field] = preg_replace('/\D/', '', $data[$field]);
        }
    }

    return $data;
}
```

### O que faz

Para cada campo em `MASKED_FIELDS`, remove todos os caracteres não-numéricos usando a regex `/\D/` (`\D` = qualquer caractere que **não** seja dígito).

Funciona em dois modos:

**Modo scalar (campo único):**
```php
$data = ['cpf' => '123.456.789-00', 'name' => 'Ana'];

$result = $this->removeMasks($data);
// ['cpf' => '12345678900', 'name' => 'Ana']
//  ↑ pontos e traço removidos     ↑ name não está em MASKED_FIELDS → intocado
```

**Modo array (filtros multivalorados):**
```php
// Buscar por múltiplos WhatsApps ao mesmo tempo:
$filters = ['whatsapp' => ['(51) 9 9999-8888', '(51) 8 8888-7777']];

$result = $this->removeMasks($filters);
// ['whatsapp' => ['51999998888', '51888887777']]
```

### Campos e suas máscaras comuns

| Campo | Exemplo com máscara | Após removeMasks |
| --- | --- | --- |
| `cpf` | `123.456.789-00` | `12345678900` |
| `whatsapp` | `(51) 9 9999-8888` | `51999998888` |
| `phone` | `(51) 3333-4444` | `5133334444` |
| `zip_code` | `90010-000` | `90010000` |
| `uc_cpf` | `123.456.789-00` | `12345678900` |

---

## 8. formatDate — Formatação de data

```php
protected function formatDate(?string $date): ?string
{
    if (empty($date)) {
        return null;
    }

    $timestamp = strtotime($date);

    return $timestamp !== false ? date('Y-m-d', $timestamp) : null;
}
```

### O que faz

Converte qualquer formato de data parseável por `strtotime` para o padrão `Y-m-d` do MySQL DATE. Retorna `null` para entrada vazia ou inválida.

### Tabela de entradas e saídas

| Entrada | Saída | Observação |
| --- | --- | --- |
| `'10/05/2026'` | `'2026-05-10'` | Formato brasileiro (pt-BR) |
| `'2026-05-10'` | `'2026-05-10'` | Já no formato correto |
| `'May 10, 2026'` | `'2026-05-10'` | Formato inglês |
| `'10-05-2026'` | `'2026-10-05'` | ⚠️ strtotime interpreta como MM-DD-AAAA |
| `''` | `null` | String vazia |
| `null` | `null` | Valor nulo |
| `'invalido'` | `null` | strtotime retorna false |

> **Atenção:** `strtotime('10-05-2026')` interpreta como **mês 10, dia 05** — não como dia 10, mês 05. Prefira o formato `'10/05/2026'` (barras) para datas no padrão brasileiro.

### Uso no Processor

```php
protected function prepareData(array $data): array
{
    if (isset($data['birth_date'])) {
        $data['birth_date'] = $this->formatDate($data['birth_date']);
    }

    return $data;
}
```

---

## 9. formatDatetime — Formatação de data e hora

```php
protected function formatDatetime(?string $datetime): ?string
{
    if (empty($datetime)) {
        return null;
    }

    $timestamp = strtotime($datetime);

    return $timestamp !== false ? date('Y-m-d H:i:s', $timestamp) : null;
}
```

### O que faz

Converte para o padrão `Y-m-d H:i:s` do MySQL DATETIME. Aceita especialmente o formato `datetime-local` dos inputs HTML (`Y-m-d\TH:i`).

### Tabela de entradas e saídas

| Entrada | Saída | Observação |
| --- | --- | --- |
| `'2026-05-10T14:30'` | `'2026-05-10 14:30:00'` | Formato `datetime-local` do HTML |
| `'2026-05-10 14:30:00'` | `'2026-05-10 14:30:00'` | Já no formato MySQL |
| `'2026-05-10T14:30:45'` | `'2026-05-10 14:30:45'` | Com segundos |
| `''` | `null` | String vazia |
| `null` | `null` | Valor nulo |

### Por que aceitar `datetime-local`?

O input HTML `<input type="datetime-local">` envia os dados no formato `2026-05-10T14:30` — com a letra `T` separando data e hora, sem segundos. O `formatDatetime` normaliza isso automaticamente para o padrão MySQL.

```php
// Frontend envia: "2026-05-10T14:30"
// Processor recebe:
$data['start_at'] = $this->formatDatetime($data['start_at']);
// Armazenado como: "2026-05-10 14:30:00"
```

---

## 10. buildPaginationParams — Parâmetros de paginação

```php
protected function buildPaginationParams(array $params): array
{
    return [
        'page'  => max(1, (int) ($params['page'] ?? 1)),
        'limit' => min(100, max(1, (int) ($params['limit'] ?? 20))),
        'sort'  => trim((string) ($params['sort'] ?? 'id')),
        'order' => trim((string) ($params['order'] ?? 'desc')),
    ];
}
```

### O que faz

Normaliza os parâmetros de paginação recebidos da query string, aplicando valores padrão e limites seguros que evitam consultas excessivamente grandes.

### Tabela de parâmetros

| Parâmetro | Tipo | Padrão | Regra de normalização |
| --- | --- | --- | --- |
| `page` | `int` | `1` | Mínimo `1` (nunca página 0 ou negativa) |
| `limit` | `int` | `20` | Entre `1` e `100` (máximo de 100 registros por página) |
| `sort` | `string` | `'id'` | Trim de espaços — passado direto para o model |
| `order` | `string` | `'desc'` | Trim de espaços — passado direto para o model |

### Exemplo de normalização

```php
// Query string recebida:
?page=0&limit=500&sort=name&order=asc

// Array $params passado pelo controller:
['page' => '0', 'limit' => '500', 'sort' => ' name ', 'order' => 'asc']

// Resultado de buildPaginationParams():
[
    'page'  => 1,      // max(1, 0) = 1
    'limit' => 100,    // min(100, max(1, 500)) = 100
    'sort'  => 'name', // trim aplicado
    'order' => 'asc',
]
```

### Exemplo com valores omitidos

```php
// Query string sem parâmetros:
?

// Array $params = []
// Resultado:
[
    'page'  => 1,
    'limit' => 20,
    'sort'  => 'id',
    'order' => 'desc',
]
```

> **Por que limitar em 100?** Consultas sem paginação adequada podem retornar dezenas de milhares de registros, sobrecarregando banco, memória e rede. O limite de 100 é um teto de segurança. Quem precisar de mais registros deve usar `getNoPagination()`.

---

## 11. Métodos de Leitura — View

Estes métodos delegam para `$this->viewModel`, que executa as queries na View SQL. Todos passam os filtros por `removeMasks()` antes de consultar.

### Tabela de métodos

| Método | Endpoint | Assinatura |
| --- | --- | --- |
| `findView` | `POST /find` | `findView(array $filters, array $params): array` |
| `getGroupedView` | `POST /get-grouped` | `getGroupedView(array $multiFilters, array $params): array` |
| `searchView` | `POST /search` | `searchView(string $term, array $params): array` |
| `getView` | `GET /get/{id}` | `getView(int $id): ?array` |
| `getAllView` | `GET /get-all` | `getAllView(array $params): array` |
| `getNoPaginationView` | `GET /get-no-pagination` | `getNoPaginationView(string $sort, string $order): array` |
| `getDeletedView` | `GET /get-deleted/{id}` | `getDeletedView(int $id): ?array` |
| `getDeletedAllView` | `GET /get-deleted-all` | `getDeletedAllView(array $params): array` |

### Diferença entre `find` e `getGrouped`

| Método | Tipo de filtro | Exemplo |
| --- | --- | --- |
| `findView` | Filtro simples — **um valor por campo** | `['status' => 'active']` |
| `getGroupedView` | Filtro multivalorado — **array de valores por campo** | `['status' => ['active', 'pending']]` |

### Como `findView` funciona internamente

```php
public function findView(array $filters, array $params): array
{
    $p = $this->buildPaginationParams($params);

    return $this->viewModel->findPaginatedView(
        $this->removeMasks($filters),    // ← remove máscaras dos filtros
        $p['page'],
        $p['limit'],
        $p['sort'],
        $p['order']
    );
}
```

### `getView` vs `getDeletedView`

| Método | Retorna |
| --- | --- |
| `getView(id)` | Registro **ativo** por ID (sem `deleted_at`) |
| `getDeletedView(id)` | Registro **soft-deleted** por ID (com `deleted_at`) |

---

## 12. Como o Processor herda esta classe

### Módulo somente leitura (herda BaseViewService diretamente)

```php
<?php

namespace App\Services\V1\Mec\VehicleBrandView;

use App\Models\V1\Mec\VehicleBrand\SqlViewModel;
use App\Services\V1\BaseViewService;

class Processor extends BaseViewService
{
    public function __construct()
    {
        $this->viewModel = new SqlViewModel();
    }
    // Sem tableModel — apenas leitura via view
    // Todos os 8 métodos *View já estão disponíveis
    // Todos os utilitários (sanitizeData, removeMasks, etc.) já estão disponíveis
}
```

Com apenas o construtor acima, o Processor já possui:
- `findView`, `getGroupedView`, `searchView`, `getView`, `getAllView`, `getNoPaginationView`, `getDeletedView`, `getDeletedAllView`
- `sanitizeData`, `sanitizeString`, `removeMasks`, `formatDate`, `formatDatetime`, `buildPaginationParams`

### Módulo com tabela (herda BaseTableService — que já estende BaseViewService)

```php
class Processor extends BaseTableService  // BaseTableService extends BaseViewService
{
    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }
    // Possui TUDO do BaseViewService + tudo do BaseTableService
}
```

---

## 13. Fluxo Ponta a Ponta — Diagrama ASCII

### POST /api/v1/mec/vehicle-brand/find (leitura via view)

```
Cliente HTTP
    │
    │  POST /api/v1/mec/vehicle-brand/find
    │  Body: {"filters": {"name": "  toyota  "}, "page": 1, "limit": 10}
    │  Header: Authorization: Bearer eyJ...
    ▼
[AuthFilter]
    │  JwtHelper::decode() → válido → continua
    ▼
[ResourceViewController::find()]  ← ou ResourceTableController
    │  $filters = $body['filters'] ?? []   → ['name' => '  toyota  ']
    │  $params  = query string params      → ['page' => '1', 'limit' => '10']
    ▼
[Processor::findView($filters, $params)]  ← herdado de BaseViewService
    │
    │  ① buildPaginationParams(['page' => '1', 'limit' => '10'])
    │     → ['page' => 1, 'limit' => 10, 'sort' => 'id', 'order' => 'desc']
    │
    │  ② removeMasks(['name' => '  toyota  '])
    │     → sem mudança ('name' não está em MASKED_FIELDS)
    │     → ['name' => '  toyota  ']
    │
    │  Obs: a sanitização de strings (sanitizeData) NÃO é chamada em findView
    │       pois os filtros não são persistidos — apenas consultados
    │
    │  ③ viewModel->findPaginatedView(
    │         ['name' => '  toyota  '],
    │         page=1, limit=10, sort='id', order='desc'
    │     )
    │     SQL: SELECT * FROM view_mec_vehicle_brand
    │          WHERE name LIKE '%toyota%'
    │          ORDER BY id DESC
    │          LIMIT 10 OFFSET 0
    │
    │  ④ Retorna array com {data: [...], total: N, page: 1, limit: 10}
    ▼
[ResourceViewController]
    │  return respondPaginated($result)
    ▼
Cliente HTTP ← HTTP 200
    {
        "data": [
            {"id": 1, "uuid": "...", "name": "Toyota", ...},
            {"id": 5, "uuid": "...", "name": "Toyota Gazoo Racing", ...}
        ],
        "meta": {
            "total": 2,
            "page": 1,
            "limit": 10,
            "pages": 1
        }
    }
```

---

## 14. Erros Comuns

| Erro | Causa | Solução |
| --- | --- | --- |
| `Call to undefined method $this->viewModel->...` | `$this->viewModel` não declarado no construtor do Processor | Declarar `$this->viewModel = new SqlViewModel()` no `__construct` |
| Campo com máscara não removida chegando ao banco | Usou `sanitizeData` mas não `removeMasks` | Encadear: `$this->removeMasks($this->sanitizeData($data))` |
| Campo nullable sendo apagado no UPDATE | `sanitizeData` descartou o campo porque era `""` | Enviar `null` explícito pelo frontend (não string vazia) quando quiser manter o campo; omitir o campo quando não quiser alterar |
| `formatDate` retornando data errada no formato `DD-MM-AAAA` | `strtotime` interpreta traços como `MM-DD-AAAA` | Usar barras `/` no formato brasileiro: `DD/MM/AAAA` |
| `buildPaginationParams` ignorado — dados sem paginação | Não passou os `$params` da query string | Garantir que o controller chama `$this->getPaginationParams()` e passa o resultado para o método do Processor |
| `limit` maior que 100 sendo ignorado | `buildPaginationParams` limita em 100 por design | Usar `getNoPaginationView()` para obter todos os registros sem limite |
| `removeMasks` não removendo campo personalizado | O campo não está em `MASKED_FIELDS` | `MASKED_FIELDS` é `private const` em `BaseViewService` — para adicionar campos, é necessário sobrescrever `removeMasks` no Processor ou discutir se o campo deve entrar na constante da base |

---

## 15. Sobre o Autor

| Campo    | Informação |
| -------- | ---------- |
| Nome     | Gustavo Hammes |
| Cargo    | Analista de Sistemas |
| Empresa  | Habilidade .Com |
| Site     | [habilidade.com](https://habilidade.com) |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
