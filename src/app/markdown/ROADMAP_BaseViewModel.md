# ROADMAP — BaseViewModel (Leitura de View SQL + Paginação)

> **Público-alvo:** Desenvolvedor júnior que precisa entender como funciona o model de view SQL — por que ele existe separado do model de tabela, como configurar os campos de busca, e por que nunca se faz INSERT/UPDATE diretamente em uma view.
>
> **Arquivo documentado:** `src/app/Models/V1/BaseViewModel.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é o BaseViewModel](#1-o-que-é-o-baseviewmodel)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [Propriedades Fixas — Por que são diferentes do BaseTableModel](#3-propriedades-fixas--por-que-são-diferentes-do-basetablemodel)
4. [Por que todos os métodos usam db->table() diretamente](#4-por-que-todos-os-métodos-usam-dbtable-diretamente)
5. [Arrays Sobrescrevíveis](#5-arrays-sobrescrevíveis)
6. [Diferença entre likeFields e searchFields](#6-diferença-entre-likefields-e-searchfields)
7. [findPaginatedView — Consulta com filtros e withDeleted](#7-findpaginatedview--consulta-com-filtros-e-withdeleted)
8. [findById e findDeletedById](#8-findbyid-e-finddeletedbyid)
9. [findDeletedPaginatedView — Soft-deleted paginados](#9-finddeletedpaginatedview--soft-deleted-paginados)
10. [searchByTermView — Busca textual](#10-searchbytermview--busca-textual)
11. [findGroupedView — Filtros multivalorados](#11-findgroupedview--filtros-multivalorados)
12. [findAllView — Lista completa sem paginação](#12-findallview--lista-completa-sem-paginação)
13. [Utilitários Internos](#13-utilitários-internos)
14. [Tabela Comparativa — BaseViewModel vs BaseTableModel](#14-tabela-comparativa--baseviewmodel-vs-basetablemodel)
15. [Como o SqlViewModel herda esta classe](#15-como-o-sqlviewmodel-herda-esta-classe)
16. [Erros Comuns](#16-erros-comuns)
17. [Sobre o Autor](#17-sobre-o-autor)

---

## 1. O que é o BaseViewModel

`BaseViewModel` é a **classe abstrata de model para Views SQL**. Uma View SQL é uma consulta salva no banco de dados — ela pode fazer JOINs entre várias tabelas e retornar um conjunto de dados enriquecido, mas **não pode receber INSERT, UPDATE ou DELETE diretamente**.

```
Banco de Dados
    ├── mec_01_vehicle_brand  (tabela física) ← SqlTableModel lê e escreve aqui
    └── view_mec_vehicle_brand (view SQL)     ← SqlViewModel lê aqui
             └── JOIN mec_01_vehicle_brand + user_004_saas_tenants + ...
```

**Por que ter um model separado para a view?**

| Situação | Model usado |
| --- | --- |
| Precisa de dados enriquecidos (JOIN com outras tabelas) | `SqlViewModel` → `BaseViewModel` |
| Precisa criar, atualizar ou excluir registros | `SqlTableModel` → `BaseTableModel` |

O `BaseViewModel` foi projetado exclusivamente para **leitura** — todas as suas propriedades e métodos refletem isso.

> `BaseViewModel` é `abstract` — nunca é instanciado diretamente. Apenas o `SqlViewModel` filho de cada módulo é instanciado.

---

## 2. Hierarquia de Classes

```
CodeIgniter\Model         ← framework: CRUD básico, Query Builder
    └── abstract BaseViewModel  ← somente leitura: 7 métodos de consulta na view
            └── SqlViewModel    ← configura $table (nome da view), $sortableFields,
                                   $likeFields, $searchFields
```

| Classe | Responsabilidade |
| --- | --- |
| `CodeIgniter\Model` | Base do framework — Query Builder, configurações de conexão |
| `BaseViewModel` | Paginação, busca, filtros e listagem exclusivamente na view SQL |
| `SqlViewModel` | Declara `$table` (nome da view) e configura os arrays de busca |

---

## 3. Propriedades Fixas — Por que são diferentes do BaseTableModel

```php
protected $DBGroup        = 'default';   // conexão padrão
protected $primaryKey     = 'id';        // campo de ID na view
protected $returnType     = 'array';     // retorna array associativo

protected $useSoftDeletes = false;       // ← VIEW não gerencia deleted_at via CI4
protected $useTimestamps  = false;       // ← VIEW não tem auto-fill de timestamps
protected $protectFields  = true;        // protege campos (irrelevante aqui, mas mantido)
protected $allowedFields  = [];          // ← VAZIO: nenhuma gravação é permitida
```

### Por que `useSoftDeletes = false`?

No `BaseTableModel`, `useSoftDeletes = true` faz o CI4 adicionar automaticamente `WHERE deleted_at IS NULL` em toda query. Mas isso só funciona quando o CI4 tem controle sobre a tabela — ele insere, atualiza e sabe quais registros existem.

Em uma **View SQL**, o CI4 não gerencia `deleted_at`. A view apenas lê dados. Por isso `useSoftDeletes = false` — e o `BaseViewModel` adiciona `WHERE deleted_at IS NULL` **manualmente** em cada método, quando necessário.

### Por que `useTimestamps = false`?

O CI4 usa `useTimestamps = true` para preencher `created_at` e `updated_at` automaticamente no INSERT/UPDATE. Como a view não recebe escrita, não há razão para esta propriedade estar ativa.

### Por que `allowedFields = []`?

`allowedFields` lista os campos que podem ser escritos via `insert()` e `update()`. Com `[]`, **nenhum campo pode ser gravado** — qualquer tentativa de INSERT na view simplesmente não persiste nenhum dado. É a declaração explícita de que este model é somente leitura.

### Por que não há `$hidden`?

No `BaseTableModel`, `$hidden` remove campos sensíveis das respostas (como `password`) porque a tabela física os armazena.

Na view SQL, os campos sensíveis **nunca entram na view** — o DDL da view já os omite. A filtragem acontece no banco, não no PHP. Por isso `$hidden` não é necessário no `BaseViewModel`.

---

## 4. Por que todos os métodos usam db->table() diretamente

Esta é a diferença de implementação mais importante entre `BaseViewModel` e `BaseTableModel`.

**No BaseTableModel:**
```php
$builder = $this->builder();
// CI4 adiciona automaticamente: WHERE deleted_at IS NULL
// (porque useSoftDeletes = true)
```

**No BaseViewModel:**
```php
$builder = $this->db->table($this->table);
// CI4 NÃO adiciona nada — useSoftDeletes = false
// O BaseViewModel adiciona manualmente quando precisa:
$builder->where('deleted_at IS NULL', null, false);
```

### Por que a terceira sintaxe `where('deleted_at IS NULL', null, false)`?

O método `where()` do CI4 normalmente **escapa** os valores para evitar SQL Injection. Mas `IS NULL` não é um valor — é uma expressão SQL. O terceiro parâmetro `false` desativa o escape, permitindo que a expressão seja inserida diretamente no SQL sem aspas ou backticks.

```php
// Com escape (padrão) — ERRADO para IS NULL:
$builder->where('deleted_at', null);
// SQL: WHERE `deleted_at` = NULL  ← não funciona em SQL padrão

// Sem escape — CORRETO:
$builder->where('deleted_at IS NULL', null, false);
// SQL: WHERE deleted_at IS NULL  ← correto
```

---

## 5. Arrays Sobrescrevíveis

Três arrays controlam o comportamento de busca e ordenação — todos devem ser sobrescritos no `SqlViewModel` filho:

### `$sortableFields` — Whitelist de ordenação

```php
protected array $sortableFields = ['id'];
```

Mesmo propósito do `BaseTableModel`: previne SQL Injection por inserção de código malicioso no parâmetro `sort`. Qualquer valor fora da lista retorna ao padrão `'id'`.

```php
// No SqlViewModel filho — adicionar campos da view:
protected array $sortableFields = ['id', 'name', 'brand_name', 'created_at'];
```

---

### `$likeFields` — Campos com LIKE em `applyFilters`

```php
protected array $likeFields = [];
```

Usado pelo método interno `applyFilters()` para decidir entre `LIKE %valor%` e `WHERE exato`. Aplicado em `findPaginatedView()`.

```php
// No SqlViewModel filho:
protected array $likeFields = ['name', 'description', 'brand_name'];
// Filtrar por {'name': 'toy'} → WHERE name LIKE '%toy%'
// Filtrar por {'status': 'active'} → WHERE status = 'active'
```

---

### `$searchFields` — Campos da busca textual (PUBLIC)

```php
public array $searchFields = [];
```

> **Atenção:** este array é `public` — diferente dos outros dois que são `protected`.

É acessado diretamente pelo `BaseTableService::search()`:

```php
// Em BaseTableService:
public function search(string $term, array $params): array
{
    return $this->tableModel->searchByTerm(
        $term,
        $this->tableModel->searchFields,  // ← acessa o $searchFields público
        ...
    );
}
```

No `SqlViewModel`, deve ser preenchido com os campos em que a busca livre deve funcionar:

```php
// No SqlViewModel filho:
public array $searchFields = ['name', 'brand_name', 'model_code'];
// Buscar 'toyota' → WHERE (name LIKE '%toyota%' OR brand_name LIKE '%toyota%' OR model_code LIKE '%toyota%')
```

---

## 6. Diferença entre likeFields e searchFields

Esta é a distinção que mais confunde quem está aprendendo:

| | `$likeFields` | `$searchFields` |
| --- | --- | --- |
| **Visibilidade** | `protected` | `public` |
| **Usado por** | `applyFilters()` interno | `searchByTermView()` e `BaseTableService::search()` |
| **Contexto** | Filtros por campo específico | Busca livre (um termo em vários campos) |
| **Endpoint** | `POST /find` | `POST /search` |
| **SQL gerado** | `WHERE campo LIKE '%valor%'` (por campo) | `(campo1 LIKE '%termo%' OR campo2 LIKE '%termo%')` |

**Exemplo prático:**

```php
// $likeFields = ['name'] → usado no POST /find:
// Request: {"filters": {"name": "toy"}}
// SQL: WHERE deleted_at IS NULL AND name LIKE '%toy%'

// $searchFields = ['name', 'brand_name'] → usado no POST /search:
// Request: {"term": "toy"}
// SQL: WHERE deleted_at IS NULL AND (name LIKE '%toy%' OR brand_name LIKE '%toy%')
```

---

## 7. findPaginatedView — Consulta com filtros e withDeleted

```php
public function findPaginatedView(
    array $filters = [],
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc',
    bool $withDeleted = false   // ← parâmetro exclusivo do BaseViewModel
): array
```

### O parâmetro `$withDeleted`

Este parâmetro não existe no `BaseTableModel::findPaginated`. Ele permite buscar registros soft-deleted junto com os ativos — útil para relatórios ou telas de administração.

```php
// Padrão — somente ativos (deleted_at IS NULL):
$this->viewModel->findPaginatedView($filters, 1, 20, 'id', 'desc');
// SQL: WHERE deleted_at IS NULL AND ...filtros...

// Com soft-deleted incluídos:
$this->viewModel->findPaginatedView($filters, 1, 20, 'id', 'desc', withDeleted: true);
// SQL: ...filtros... (sem cláusula de deleted_at)
```

### Fluxo interno

```
① sanitizeSort($sort, $order) → whitelist

② $builder = $this->db->table($this->table)
   └── sem scope CI4 (useSoftDeletes=false)

③ if (!$withDeleted):
       $builder->where('deleted_at IS NULL', null, false)

④ applyFilters($builder, $filters)
   └── LIKE ou WHERE por $likeFields

⑤ $total = $builder->countAllResults(false)

⑥ $data = $builder->orderBy()->limit()->get()->getResultArray()

⑦ buildPaginatedResult($data, $total, $page, $limit)
   └── sem $hidden (view filtra no SQL)
```

---

## 8. findById e findDeletedById

Dois métodos simétricos para buscar um registro único pelo ID:

### `findById(int $id): ?array`

Retorna o registro **ativo** — com `deleted_at IS NULL`.

```php
public function findById(int $id): ?array
{
    $result = $this->db->table($this->table)
        ->where('id', $id)
        ->where('deleted_at IS NULL', null, false)
        ->get()
        ->getRowArray();

    return $result ?: null;  // getRowArray() retorna false se não encontrar — converte para null
}
```

```php
// SQL gerado:
// SELECT * FROM view_mec_vehicle_brand
// WHERE id = 42 AND deleted_at IS NULL
```

---

### `findDeletedById(int $id): ?array`

Retorna o registro **soft-deleted** — com `deleted_at IS NOT NULL`.

```php
public function findDeletedById(int $id): ?array
{
    $result = $this->db->table($this->table)
        ->where('id', $id)
        ->where('deleted_at IS NOT NULL', null, false)
        ->get()
        ->getRowArray();

    return $result ?: null;
}
```

```php
// SQL gerado:
// SELECT * FROM view_mec_vehicle_brand
// WHERE id = 42 AND deleted_at IS NOT NULL
```

| Método | Retorna | Retorna null quando |
| --- | --- | --- |
| `findById(42)` | Registro ativo com ID 42 | Não existe ou está soft-deleted |
| `findDeletedById(42)` | Registro soft-deleted com ID 42 | Não existe ou está ativo |

---

## 9. findDeletedPaginatedView — Soft-deleted paginados

```php
public function findDeletedPaginatedView(
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

Lista paginada de registros com `deleted_at IS NOT NULL`. Sem suporte a filtros — retorna todos os soft-deleted.

```php
// SQL gerado:
// SELECT * FROM view_mec_vehicle_brand
// WHERE deleted_at IS NOT NULL
// ORDER BY id DESC LIMIT 20 OFFSET 0
```

---

## 10. searchByTermView — Busca textual

```php
public function searchByTermView(
    string $term,
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

Busca o `$term` em todos os campos declarados em `$this->searchFields`, usando OR entre eles.

> **Diferença do BaseTableModel:** aqui os `$searchFields` são definidos no próprio ViewModel — o método não recebe os campos como parâmetro, os lê de `$this->searchFields`.

### SQL gerado

```php
// $searchFields = ['name', 'brand_name', 'model_code']
$this->viewModel->searchByTermView('toy', 1, 10, 'name', 'asc');

// SQL:
// SELECT * FROM view_mec_vehicle_brand
// WHERE deleted_at IS NULL
//   AND (name LIKE '%toy%' OR brand_name LIKE '%toy%' OR model_code LIKE '%toy%')
// ORDER BY name ASC LIMIT 10 OFFSET 0
```

### O que acontece com `$term` vazio

```php
if ($term !== '') {
    $builder->groupStart();
    // ... adiciona os LIKE ...
    $builder->groupEnd();
}
// Com $term = '' → nenhum filtro de busca adicionado
// SQL: SELECT * FROM view WHERE deleted_at IS NULL ORDER BY ... LIMIT ...
// Retorna todos os registros ativos
```

---

## 11. findGroupedView — Filtros multivalorados

```php
public function findGroupedView(
    array $multiFilters = [],
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

Cada chave de `$multiFilters` é um campo; cada valor é um array de valores aceitos. Gera `WHERE campo IN (...)`.

### Diferença crítica em relação ao `BaseTableModel::findGrouped`

| | `BaseViewModel::findGroupedView` | `BaseTableModel::findGrouped` |
| --- | --- | --- |
| Campo em `$likeFields` | `whereIn` (ignora $likeFields) | LIKE OR |
| Campo fora de `$likeFields` | `whereIn` | `whereIn` |

**No `BaseViewModel`, `findGroupedView` usa `whereIn` para TODOS os campos** — independente de `$likeFields`. Isso é intencional: filtros multivalorados em views são sempre por correspondência exata.

```php
$this->viewModel->findGroupedView(['status' => ['active', 'pending'], 'brand_id' => [1, 2, 3]]);

// SQL:
// SELECT * FROM view_mec_vehicle_brand
// WHERE deleted_at IS NULL
//   AND status IN ('active', 'pending')
//   AND brand_id IN (1, 2, 3)
// ORDER BY id DESC LIMIT 20 OFFSET 0
```

---

## 12. findAllView — Lista completa sem paginação

```php
public function findAllView(string $sort = 'id', string $order = 'desc'): array
```

Retorna **todos** os registros ativos da view, sem limite. Não retorna envelope de paginação — retorna diretamente o array de dados.

```php
// SQL gerado:
// SELECT * FROM view_mec_vehicle_brand
// WHERE deleted_at IS NULL
// ORDER BY name ASC

$all = $this->viewModel->findAllView('name', 'asc');
// Retorna: [['id'=>1,'name'=>'Honda',...], ['id'=>3,'name'=>'Toyota',...], ...]
// Sem chave 'pagination' — array direto
```

> **Atenção:** use com cautela em views com grande volume de dados. Ideal para selects de formulário (marcas, categorias) que raramente ultrapassam centenas de registros.

---

## 13. Utilitários Internos

### `applyFilters($builder, array $filters): void`

Idêntico ao `BaseTableModel` — aplica LIKE para campos em `$likeFields`, WHERE exato para os demais, ignorando valores nulos e vazios.

```php
// $likeFields = ['name', 'description']
// Filtros: ['name' => 'toy', 'status' => 'active', 'year' => '']
//
// name  → LIKE '%toy%'
// status → WHERE status = 'active'
// year  → ignorado (vazio)
```

---

### `sanitizeSort(string $sort, string $order): array`

Idêntico ao `BaseTableModel` — whitelist contra SQL Injection.

```php
// $sortableFields = ['id', 'name', 'brand_name']
sanitizeSort('name', 'ASC')         → ['name', 'asc']
sanitizeSort('(SELECT 1)', 'desc')  → ['id', 'desc']   // fallback
sanitizeSort('id', 'random()')      → ['id', 'desc']   // fallback
```

---

### `buildPaginatedResult(array $data, int $total, int $page, int $limit): array`

Similar ao `BaseTableModel`, mas **sem aplicação de `$hidden`** — a view já filtra os campos no SQL.

```php
// Retorno padrão:
[
    'data' => [
        ['id' => 1, 'name' => 'Toyota', 'brand_country' => 'Japan', ...],
    ],
    'pagination' => [
        'page'  => 1,
        'limit' => 20,
        'total' => 1,
        'pages' => 1,
    ],
]
```

---

## 14. Tabela Comparativa — BaseViewModel vs BaseTableModel

| Característica | `BaseViewModel` | `BaseTableModel` |
| --- | --- | --- |
| Fonte de dados | View SQL (SELECT com JOIN) | Tabela física |
| `useSoftDeletes` | `false` — manual | `true` — automático via CI4 |
| `useTimestamps` | `false` | `true` |
| `allowedFields` | `[]` (readonly absoluto) | Declarado no filho |
| `$hidden` | Não existe | Existe — remove campos sensíveis |
| Acesso ao banco | `db->table()` direto sempre | `$this->builder()` (scope CI4) |
| `deleted_at IS NULL` | Adicionado manualmente | Adicionado pelo CI4 automaticamente |
| `findGroupedView` / `findGrouped` | Só `whereIn` | `whereIn` + LIKE/OR por `$likeFields` |
| `$searchFields` | `public` — acessado externamente | Parâmetro do método `searchByTerm()` |
| `$withDeleted` em find | Sim — parâmetro opcional | Não |
| Escrita (INSERT/UPDATE) | Impossível (`allowedFields=[]`) | Sim, via `BaseTableService` |
| `existsByField` | Não existe | Existe |
| `restore` / `clearDeleted` | Não existe | Existe |

---

## 15. Como o SqlViewModel herda esta classe

### Implementação mínima

```php
<?php

namespace App\Models\V1\Mec\VehicleBrand;

use App\Models\V1\BaseViewModel;

class SqlViewModel extends BaseViewModel
{
    protected $table = 'view_mec_vehicle_brand';  // nome da View SQL no banco

    protected array $sortableFields = ['id', 'name', 'created_at'];
    protected array $likeFields     = ['name'];
    public    array $searchFields   = ['name'];
}
```

Com apenas isso, o SqlViewModel já possui os 7 métodos de leitura completamente funcionais.

### Implementação com campos da view enriquecida (JOIN)

```php
<?php

namespace App\Models\V1\User\UserCustomer;

use App\Models\V1\BaseViewModel;

class SqlViewModel extends BaseViewModel
{
    protected $table = 'view_customer';

    // Campos da view incluem dados de user_001_management e user_002_customer
    protected array $sortableFields = [
        'id', 'email', 'uc_name', 'uc_cpf', 'created_at',
    ];

    // Campos de texto da view — filtros por LIKE em findPaginatedView
    protected array $likeFields = ['email', 'uc_name', 'uc_email'];

    // Campos para busca livre em searchByTermView
    public array $searchFields = ['email', 'uc_name', 'uc_cpf'];

    // Métodos específicos do domínio (fora da base):
    public function findByEmail(string $email): ?array
    {
        return $this->db->table($this->table)
            ->where('email', $email)
            ->where('deleted_at IS NULL', null, false)
            ->get()
            ->getRowArray() ?: null;
    }
}
```

### Convenção de nomenclatura da view

| Tabela física | View SQL correspondente |
| --- | --- |
| `mec_01_vehicle_brand` | `view_mec_vehicle_brand` |
| `user_001_management` | `view_auth_user`, `view_customer` |
| `msg_001_timeline` | `view_msg_timeline` |

O prefixo `view_` identifica views SQL — nunca use tabelas físicas como `$table` em um `SqlViewModel`.

---

## 16. Erros Comuns

| Erro | Causa | Solução |
| --- | --- | --- |
| `findById` retorna `null` para registro que existe | Registro está soft-deleted | Usar `findDeletedById` para soft-deleted, ou `findPaginatedView` com `withDeleted: true` |
| `$searchFields` não funciona na busca | Array está vazio ou não foi sobrescrito no filho | Declarar `public array $searchFields = ['campo1', 'campo2']` no `SqlViewModel` |
| Busca em `findGroupedView` não retorna LIKE | `findGroupedView` usa apenas `whereIn` — ignora `$likeFields` | Usar `findPaginatedView` para busca com LIKE por campo único |
| INSERT na view não retorna erro mas não persiste | `allowedFields = []` silencia a operação — nada é gravado | Toda escrita deve ser feita no `SqlTableModel` correspondente, nunca no `SqlViewModel` |
| Ordenação por campo da view retorna sempre por `id` | Campo não está em `$sortableFields` | Adicionar o campo em `$sortableFields` no filho |
| `findAllView` retorna envelope com `data` e `pagination` esperado | `findAllView` retorna array direto, sem envelope | Usar `findPaginatedView` com `limit=100` para obter o envelope; ou processar o array direto |
| `deleted_at IS NULL` duplicado no SQL | Usar `$this->builder()` em vez de `$this->db->table()` no filho | Views sempre usam `db->table()` — nunca `$this->builder()` no `SqlViewModel` |

---

## 17. Sobre o Autor

| Campo    | Informação |
| -------- | ---------- |
| Nome     | Gustavo Hammes |
| Cargo    | Analista de Sistemas |
| Empresa  | Habilidade .Com |
| Site     | [habilidade.com](https://habilidade.com) |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
