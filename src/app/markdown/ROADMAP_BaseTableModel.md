# ROADMAP — BaseTableModel (Paginação + Soft Delete + SQL Builder)

> **Público-alvo:** Desenvolvedor júnior que precisa entender como funciona a camada de acesso a dados dos módulos com tabela física — como o SQL é construído, por que os campos sensíveis somem das respostas automaticamente, o que é soft delete e como criar um SqlTableModel filho corretamente.
>
> **Arquivo documentado:** `src/app/Models/V1/BaseTableModel.php`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é o BaseTableModel](#1-o-que-é-o-basetablemodel)
2. [Hierarquia de Classes](#2-hierarquia-de-classes)
3. [Propriedades Fixas do CI4](#3-propriedades-fixas-do-ci4)
4. [Arrays Sobrescrevíveis](#4-arrays-sobrescrevíveis)
5. [Por que find() foi sobrescrito](#5-por-que-find-foi-sobrescrito)
6. [findPaginated — Consulta com filtros](#6-findpaginated--consulta-com-filtros)
7. [searchByTerm — Busca textual](#7-searchbyterm--busca-textual)
8. [findGrouped — Filtros multivalorados](#8-findgrouped--filtros-multivalorados)
9. [getOrdered — Lista sem paginação](#9-getordered--lista-sem-paginação)
10. [existsByField — Verificação de unicidade](#10-existsbyfield--verificação-de-unicidade)
11. [Métodos de Soft Delete](#11-métodos-de-soft-delete)
12. [Utilitários Internos](#12-utilitários-internos)
13. [Como o SqlTableModel herda esta classe](#13-como-o-sqltablemodel-herda-esta-classe)
14. [Fluxo Ponta a Ponta — Diagrama ASCII](#14-fluxo-ponta-a-ponta--diagrama-ascii)
15. [Erros Comuns](#15-erros-comuns)
16. [Sobre o Autor](#16-sobre-o-autor)

---

## 1. O que é o BaseTableModel

`BaseTableModel` é a **classe abstrata de model** para todos os módulos com tabela física no banco. Estende o `Model` nativo do CodeIgniter 4 e adiciona:

- Paginação com filtros dinâmicos (LIKE ou WHERE exato por configuração)
- Busca textual com OR entre múltiplos campos
- Filtros multivalorados (`whereIn`)
- Verificação de unicidade com suporte a update (`excludeId`)
- Operações completas de soft delete (find, restore, clear, hard delete)
- Ocultação automática de campos sensíveis (`$hidden`)
- Proteção contra SQL Injection por whitelist de ordenação (`$sortableFields`)

```
Requisição HTTP
    ↓
Controller → Processor (BaseTableService)
    ↓
BaseTableModel  ← você está aqui
    ↓
MySQL (via CI4 Query Builder)
```

> `BaseTableModel` é `abstract` — nunca é instanciada diretamente. Apenas o `SqlTableModel` filho de cada módulo é instanciado.

---

## 2. Hierarquia de Classes

```
CodeIgniter\Model          ← framework: CRUD básico, validação, timestamps, soft delete
    └── abstract BaseTableModel  ← paginação, busca, unicidade, $hidden, $sortableFields
            └── SqlTableModel    ← configura $table, $allowedFields, $likeFields, $hidden
```

| Classe | Responsabilidade |
| --- | --- |
| `CodeIgniter\Model` | `insert`, `update`, `delete`, `find`, validação, timestamps, soft delete nativo |
| `BaseTableModel` | Paginação com filtros, busca textual, unicidade, $hidden, whitelist de sort |
| `SqlTableModel` | Declara `$table`, `$allowedFields` e configura os arrays do domínio |

---

## 3. Propriedades Fixas do CI4

Estas propriedades são declaradas no `BaseTableModel` e **não devem ser alteradas** nos filhos (são a configuração padrão obrigatória do projeto):

```php
protected $DBGroup          = 'default';      // conexão padrão do banco
protected $primaryKey       = 'id';           // chave primária — sempre 'id'
protected $useAutoIncrement = true;           // id auto-incremento
protected $returnType       = 'array';        // retorna array, não objeto/Entity
protected $useSoftDeletes   = true;           // ativa soft delete via deleted_at
protected $protectFields    = true;           // só insere/atualiza campos em $allowedFields
protected $useTimestamps    = true;           // preenche created_at e updated_at automaticamente
protected $createdField     = 'created_at';   // nome do campo de criação
protected $updatedField     = 'updated_at';   // nome do campo de atualização
protected $deletedField     = 'deleted_at';   // nome do campo de exclusão lógica
protected $dateFormat       = 'datetime';     // formato: Y-m-d H:i:s
```

### O que cada propriedade faz na prática

| Propriedade | Efeito observável |
| --- | --- |
| `returnType = 'array'` | `find()` retorna `['id' => 1, 'name' => 'Toyota']` em vez de objeto |
| `useSoftDeletes = true` | Todo `find()` e `findAll()` ignora registros com `deleted_at IS NOT NULL` automaticamente |
| `protectFields = true` | `insert(['campo_nao_permitido' => 'x'])` silenciosamente ignora o campo não listado em `$allowedFields` |
| `useTimestamps = true` | CI4 preenche `created_at` no INSERT e `updated_at` no UPDATE automaticamente |
| `dateFormat = 'datetime'` | Timestamps gravados como `2026-05-10 14:30:00` (MySQL DATETIME) |

---

## 4. Arrays Sobrescrevíveis

Estes três arrays são declarados com valores padrão no `BaseTableModel` e **devem ser sobrescritos** no `SqlTableModel` filho de acordo com o domínio da tabela:

### `$hidden` — Campos ocultos de todos os retornos

```php
protected $hidden = [];
```

Campos declarados aqui são **removidos de toda resposta** do model — tanto de `find()` quanto de `findPaginated()`, `searchByTerm()`, etc.

**Exemplo de uso no filho:**
```php
// SqlTableModel do módulo de usuários:
protected $hidden = ['password', 'token_hash', 'two_factor_secret'];
// Estes campos nunca aparecem em nenhuma resposta da API
```

> **Por que não usar `$allowedFields`?** `$allowedFields` controla o que pode ser **gravado** no banco. `$hidden` controla o que é **retornado** para a aplicação. São responsabilidades distintas — um campo pode existir em `$allowedFields` e também em `$hidden`.

---

### `$sortableFields` — Whitelist de ordenação (anti-SQL Injection)

```php
protected array $sortableFields = ['id', 'created_at', 'updated_at'];
```

Apenas campos declarados aqui são aceitos como `sort` nos métodos de listagem. Qualquer valor inválido é silenciosamente substituído por `'id'`.

**Por que isso previne SQL Injection:**
```php
// Sem whitelist — usuário mal-intencionado poderia enviar:
?sort=(SELECT password FROM users LIMIT 1)

// Com sanitizeSort():
in_array('(SELECT password...)', $this->sortableFields, true) → false
→ sort = 'id'  ← seguro
```

**Exemplo de uso no filho:**
```php
protected array $sortableFields = ['id', 'name', 'created_at', 'updated_at'];
// Permite ordenar por name — campo textual da tabela
```

---

### `$likeFields` — Campos com busca LIKE vs WHERE exato

```php
protected array $likeFields = [];
```

Campos declarados aqui usam `LIKE %valor%` no `findPaginated()` e `findGrouped()`. Todos os outros usam `WHERE campo = valor` (correspondência exata).

**Exemplo de uso no filho:**
```php
protected array $likeFields = ['name', 'description'];

// Com filtro {'name': 'toy'}:
// name em $likeFields → WHERE name LIKE '%toy%'   ← encontra 'Toyota', 'Toy Story'

// Com filtro {'status': 'active'}:
// status fora de $likeFields → WHERE status = 'active'   ← correspondência exata
```

---

## 5. Por que find() foi sobrescrito

O CI4 nativo suporta `$hidden` apenas quando `$returnType` é uma **Entity** (objeto). Com `returnType = 'array'`, o CI4 simplesmente ignora `$hidden` — os campos sensíveis aparecem normalmente na resposta.

**O problema:**
```php
// Sem sobrescrita — $hidden é ignorado para returnType='array':
$user = $this->tableModel->find(1);
// Retorna: ['id' => 1, 'name' => 'Ana', 'password' => '$2y$12$...']
//                                         ↑ campo sensível vazando
```

**A solução implementada:**
```php
public function find($id = null)
{
    $result = parent::find($id); // busca normal do CI4

    if (empty($this->hidden) || !is_array($result)) {
        return $result; // sem $hidden ou resultado nulo → retorna direto
    }

    return array_diff_key($result, array_flip($this->hidden));
    //         ↑ remove do array todas as chaves que estão em $hidden
}
```

**Como `array_diff_key` + `array_flip` funciona:**
```php
$result  = ['id' => 1, 'name' => 'Ana', 'password' => '$2y$...'];
$hidden  = ['password'];

array_flip($hidden)      → ['password' => 0]        // transforma valor em chave
array_diff_key($result, ['password' => 0])
                         → ['id' => 1, 'name' => 'Ana']  // remove chaves comuns
```

> Esta sobrescrita é aplicada **apenas ao `find($id)`** — os métodos paginados aplicam `$hidden` separadamente dentro de `buildPaginatedResult()`.

---

## 6. findPaginated — Consulta com filtros

```php
public function findPaginated(
    array $filters = [],
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

### Fluxo interno

```
① sanitizeSort($sort, $order)
   └── valida contra $sortableFields (whitelist)

② $builder = $this->builder()
   └── CI4 scope: WHERE deleted_at IS NULL (useSoftDeletes=true)

③ applyFilters($builder, $filters)
   └── para cada filtro:
       campo em $likeFields? → builder->like($field, $value)
       campo fora de $likeFields? → builder->where($field, $value)

④ $total = $builder->countAllResults(false)
   └── conta sem resetar o builder (false = mantém os filtros aplicados)

⑤ $data = $builder->orderBy()->limit()->get()->getResultArray()
   └── offset = ($page - 1) * $limit

⑥ buildPaginatedResult($data, $total, $page, $limit)
   └── aplica $hidden em cada linha e monta o envelope
```

### Exemplo de chamada

```php
// No BaseTableService::find():
return $this->tableModel->findPaginated(
    ['name' => 'toyota', 'status' => 'active'],
    page: 2,
    limit: 10,
    sort: 'name',
    order: 'asc'
);

// SQL gerado (name em $likeFields, status não):
// SELECT * FROM mec_01_vehicle_brand
// WHERE deleted_at IS NULL
//   AND name LIKE '%toyota%'
//   AND status = 'active'
// ORDER BY name ASC
// LIMIT 10 OFFSET 10
```

---

## 7. searchByTerm — Busca textual

```php
public function searchByTerm(
    string $term,
    array $searchFields,
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

Busca `$term` em **múltiplos campos** com OR entre eles. Usa `groupStart/groupEnd` para isolar o bloco OR e não interferir com outros WHERE.

### Diferença em relação ao findPaginated

| | `findPaginated` | `searchByTerm` |
| --- | --- | --- |
| Filtros | Por campo específico | Termo único em múltiplos campos |
| Operador | AND entre filtros | OR entre campos (mesmo termo) |
| Campos | Qualquer campo da tabela | Apenas campos em `$searchFields` |

### SQL gerado

```php
$this->tableModel->searchByTerm('toyota', ['name', 'description'], page: 1, limit: 10);

// SQL:
// SELECT * FROM mec_01_vehicle_brand
// WHERE deleted_at IS NULL
//   AND (name LIKE '%toyota%' OR description LIKE '%toyota%')
// ORDER BY id DESC
// LIMIT 10 OFFSET 0
```

> O `groupStart()` garante que o bloco OR fique entre parênteses, evitando conflito com outros filtros que possam ser adicionados.

---

## 8. findGrouped — Filtros multivalorados

```php
public function findGrouped(
    array $multiFilters = [],
    int $page = 1,
    int $limit = 20,
    string $sort = 'id',
    string $order = 'desc'
): array
```

Cada chave de `$multiFilters` é um campo; cada valor é um **array de valores aceitos**. Gera `WHERE campo IN (...)` — ou LIKE OR se o campo estiver em `$likeFields`.

### SQL gerado — campo fora de `$likeFields`

```php
$this->tableModel->findGrouped(['status' => ['active', 'pending']], page: 1, limit: 20);

// SQL:
// SELECT * FROM tabela
// WHERE deleted_at IS NULL
//   AND status IN ('active', 'pending')
// ORDER BY id DESC LIMIT 20 OFFSET 0
```

### SQL gerado — campo em `$likeFields`

```php
// name está em $likeFields:
$this->tableModel->findGrouped(['name' => ['toyota', 'honda']], page: 1, limit: 20);

// SQL:
// SELECT * FROM tabela
// WHERE deleted_at IS NULL
//   AND (name LIKE '%toyota%' OR name LIKE '%honda%')
// ORDER BY id DESC LIMIT 20 OFFSET 0
```

---

## 9. getOrdered — Lista sem paginação

```php
public function getOrdered(string $sort = 'id', string $order = 'desc'): array
```

Retorna **todos** os registros ativos ordenados, sem paginação. Usado pelo endpoint `GET /get-no-pagination`.

```php
// SQL gerado:
// SELECT * FROM tabela WHERE deleted_at IS NULL ORDER BY name ASC
$all = $this->tableModel->getOrdered('name', 'asc');
```

> **Use com cautela** em tabelas com grande volume de dados — não há limite de registros. Ideal para tabelas de apoio (marcas, categorias, formas de pagamento) que raramente passam de alguns centenas de registros.

---

## 10. existsByField — Verificação de unicidade

```php
public function existsByField(string $field, mixed $value, ?int $excludeId = null): bool
```

Verifica se já existe um registro **ativo** (não soft-deleted) com o valor informado no campo dado.

### Por que usa `db->table()` diretamente?

O `Model` do CI4 com `useSoftDeletes = true` adiciona `WHERE deleted_at IS NULL` automaticamente nos métodos nativos. O `existsByField` já adiciona essa condição manualmente — usar `db->table()` evita que o CI4 duplique a cláusula.

### Parâmetro `$excludeId` — para validação no update

```php
// CREATE — verifica se já existe outro com o mesmo nome:
$exists = $this->tableModel->existsByField('name', 'Toyota');
// SQL: WHERE name = 'Toyota' AND deleted_at IS NULL

// UPDATE — exclui o próprio registro da verificação:
$exists = $this->tableModel->existsByField('name', 'Toyota', excludeId: 5);
// SQL: WHERE name = 'Toyota' AND deleted_at IS NULL AND id != 5
```

### Uso típico no Processor

```php
// No validateOnCreate():
if ($this->tableModel->existsByField('name', $data['name'])) {
    return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
}

// No validateOnUpdate():
if ($this->tableModel->existsByField('name', $data['name'], $id)) {
    return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
}
```

---

## 11. Métodos de Soft Delete

### Visão geral

| Método | O que faz | Usa scope CI4? |
| --- | --- | --- |
| `findWithDeleted(id)` | Busca ativo **ou** soft-deleted pelo ID | Não — `withDeleted()` |
| `findOnlyDeleted(id)` | Busca **apenas** soft-deleted pelo ID | Não — `onlyDeleted()` |
| `findDeletedPaginated(...)` | Lista soft-deleted com paginação | Não — `db->table()` direto |
| `restore(id)` | Zera `deleted_at` (restaura) | Não — `db->table()` direto |
| `clearDeleted(?id)` | Hard delete de soft-deleted | Não — `db->table()` direto |

---

### `findWithDeleted(int $id): ?array`

```php
public function findWithDeleted(int $id): ?array
{
    return $this->withDeleted()->find($id);
}
```

`withDeleted()` é um escopo do CI4 que **desativa** o filtro automático de `deleted_at IS NULL` para a próxima query. Retorna o registro independente de estar ativo ou soft-deleted.

**Uso:** verificar se um registro existe antes de operar nele (update, deleteSoft, deleteHard).

---

### `findOnlyDeleted(int $id): ?array`

```php
public function findOnlyDeleted(int $id): ?array
{
    return $this->onlyDeleted()->find($id);
}
```

`onlyDeleted()` é o oposto: retorna **somente** registros com `deleted_at IS NOT NULL`.

**Uso:** verificar se um registro está soft-deleted antes de restaurá-lo.

---

### `findDeletedPaginated(...)`: array`

Lista paginada de registros soft-deleted. Usa `db->table()` diretamente com `WHERE deleted_at IS NOT NULL` para evitar conflito com o scope `useSoftDeletes` do CI4.

```php
// SQL gerado:
// SELECT * FROM tabela
// WHERE deleted_at IS NOT NULL
// ORDER BY id DESC LIMIT 20 OFFSET 0
```

---

### `restore(int $id): void`

```php
public function restore(int $id): void
{
    $this->db->table($this->table)
        ->where($this->primaryKey, $id)
        ->update(['deleted_at' => null]);
}
```

Zera o campo `deleted_at`, tornando o registro ativo novamente.

**Por que usa `db->table()` diretamente?** O `update()` nativo do CI4 respeita `$allowedFields` — e `deleted_at` normalmente **não está** em `$allowedFields` (pois é gerenciado pelo framework, não pela aplicação). Usar `db->table()` bypassa essa proteção, garantindo que a operação funcione independente de como `$allowedFields` foi configurado.

---

### `clearDeleted(?int $id = null): int`

```php
public function clearDeleted(?int $id = null): int
{
    $builder = $this->db->table($this->table)
        ->where('deleted_at IS NOT NULL', null, false);

    if ($id !== null) {
        $builder->where($this->primaryKey, $id);
    }

    $affected = $builder->countAllResults(false); // conta antes de deletar
    $builder->delete();                           // DELETE físico

    return $affected; // retorna quantos foram removidos
}
```

| Chamada | SQL | Retorno |
| --- | --- | --- |
| `clearDeleted()` | `DELETE FROM tabela WHERE deleted_at IS NOT NULL` | N linhas removidas |
| `clearDeleted(5)` | `DELETE FROM tabela WHERE deleted_at IS NOT NULL AND id = 5` | 0 ou 1 |

> **Irreversível** — ao contrário do soft delete, o hard delete não pode ser desfeito. Use com consciência.

---

## 12. Utilitários Internos

Estes três métodos são `protected` — usados internamente pelos métodos públicos, não chamados diretamente pelo Processor.

### `applyFilters($builder, array $filters): void`

Aplica os filtros ao Query Builder, decidindo entre `LIKE` e `WHERE` com base em `$likeFields`:

```php
protected function applyFilters($builder, array $filters): void
{
    foreach ($filters as $field => $value) {
        if ($value === null || $value === '') {
            continue;  // ignora filtros vazios
        }

        if (\in_array($field, $this->likeFields, true)) {
            $builder->like($field, $value);   // → LIKE '%valor%'
        } else {
            $builder->where($field, $value);  // → WHERE campo = 'valor'
        }
    }
}
```

**Exemplo:**
```php
// $likeFields = ['name', 'description']
// Filtros: ['name' => 'toy', 'status' => 'active', 'year' => '']

// name  → em $likeFields   → WHERE name LIKE '%toy%'
// status → fora             → WHERE status = 'active'
// year  → vazio             → ignorado (continue)
```

---

### `sanitizeSort(string $sort, string $order): array`

Valida os parâmetros de ordenação contra a whitelist `$sortableFields`. Previne SQL Injection por inserção de código malicioso no parâmetro `sort`.

```php
protected function sanitizeSort(string $sort, string $order): array
{
    $sort = in_array($sort, $this->sortableFields, true) ? $sort : 'id';
    $order = in_array(strtolower($order), ['asc', 'desc'], true)
        ? strtolower($order)
        : 'desc';

    return [$sort, $order];
}
```

| Entrada | `$sortableFields` contém? | Saída |
| --- | --- | --- |
| `'name'` | Sim | `'name'` |
| `'(SELECT 1)'` | Não | `'id'` (fallback) |
| `'ASC'` | `in_list(['asc','desc'])` com `strtolower` | `'asc'` |
| `'random()'` | Não | `'desc'` (fallback) |

---

### `buildPaginatedResult(array $data, int $total, int $page, int $limit): array`

Monta o envelope padrão de resposta paginada e aplica `$hidden` em cada linha:

```php
protected function buildPaginatedResult(array $data, int $total, int $page, int $limit): array
{
    if (!empty($this->hidden)) {
        $data = array_map(
            fn(array $row) => array_diff_key($row, array_flip($this->hidden)),
            $data
        );
    }

    return [
        'data' => $data,
        'pagination' => [
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => $limit > 0 ? (int) ceil($total / $limit) : 0,
        ],
    ];
}
```

**Formato de saída:**
```php
[
    'data' => [
        ['id' => 1, 'name' => 'Toyota', 'created_at' => '2026-05-10 09:00:00'],
        ['id' => 2, 'name' => 'Honda',  'created_at' => '2026-05-10 09:01:00'],
    ],
    'pagination' => [
        'page'  => 1,
        'limit' => 20,
        'total' => 2,
        'pages' => 1,    // ceil(2 / 20) = 1
    ],
]
```

---

## 13. Como o SqlTableModel herda esta classe

### Implementação mínima

```php
<?php

namespace App\Models\V1\Mec\VehicleBrand;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $table          = 'mec_01_vehicle_brand';
    protected $allowedFields  = ['uuid', 'name', 'user_saas_tenants_id'];

    // Campos adicionais aos padrões ['id', 'created_at', 'updated_at']:
    protected array $sortableFields = ['id', 'name', 'created_at', 'updated_at'];

    // Campos de texto — usam LIKE %valor% no findPaginated:
    protected array $likeFields = ['name'];

    // Sem campos sensíveis — $hidden vazio (padrão da base):
    // protected $hidden = [];
}
```

### Implementação com `$hidden`

```php
<?php

namespace App\Models\V1\User\UserManagement;

use App\Models\V1\BaseTableModel;

class SqlTableModel extends BaseTableModel
{
    protected $table         = 'user_001_management';
    protected $allowedFields = [
        'uuid', 'email', 'password', 'is_active',
        'two_factor_enabled', 'user_saas_tenants_id',
    ];

    protected array $sortableFields = ['id', 'email', 'created_at', 'updated_at'];
    protected array $likeFields     = ['email'];

    // 'password' existe em $allowedFields (pode ser gravado)
    // mas não deve aparecer em nenhuma resposta da API:
    protected $hidden = ['password', 'two_factor_secret'];
}
```

### Checklist do SqlTableModel filho

| Item | Obrigatório | Padrão herdado |
| --- | --- | --- |
| `$table` | Sim | — |
| `$allowedFields` | Sim | `[]` (nada pode ser gravado) |
| `$sortableFields` | Recomendado | `['id', 'created_at', 'updated_at']` |
| `$likeFields` | Quando há campos de texto | `[]` (tudo WHERE exato) |
| `$hidden` | Quando há campos sensíveis | `[]` (tudo retornado) |

---

## 14. Fluxo Ponta a Ponta — Diagrama ASCII

### POST /api/v1/mec/vehicle-brand/find com filtros

```
Cliente HTTP
    │
    │  POST /api/v1/mec/vehicle-brand/find
    │  Body: {"filters": {"name": "toy", "status": "active"}, "page": 1, "limit": 10}
    ▼
[BaseTableService::find($filters, $params)]
    │
    │  removeMasks($filters) → sem mudança (name/status não estão em MASKED_FIELDS)
    │  buildPaginationParams($params) → {page:1, limit:10, sort:'id', order:'desc'}
    ▼
[SqlTableModel::findPaginated(['name'=>'toy','status'=>'active'], 1, 10, 'id', 'desc')]
    │
    │  ① sanitizeSort('id', 'desc')
    │     'id' in $sortableFields? → Sim → sort='id', order='desc'
    │
    │  ② $builder = $this->builder()
    │     CI4 scope: WHERE deleted_at IS NULL (useSoftDeletes=true)
    │
    │  ③ applyFilters($builder, ['name'=>'toy','status'=>'active'])
    │     'name' in $likeFields? → Sim → builder->like('name', 'toy')
    │     'status' in $likeFields? → Não → builder->where('status', 'active')
    │
    │  ④ $total = builder->countAllResults(false)
    │     SQL: SELECT COUNT(*) FROM mec_01_vehicle_brand
    │          WHERE deleted_at IS NULL
    │            AND name LIKE '%toy%'
    │            AND status = 'active'
    │     → $total = 3
    │
    │  ⑤ $data = builder->orderBy('id','desc')->limit(10, 0)->get()->getResultArray()
    │     SQL: SELECT * FROM mec_01_vehicle_brand
    │          WHERE deleted_at IS NULL
    │            AND name LIKE '%toy%'
    │            AND status = 'active'
    │          ORDER BY id DESC LIMIT 10 OFFSET 0
    │     → 3 linhas retornadas (com todos os campos, incluindo os de $hidden)
    │
    │  ⑥ buildPaginatedResult($data, 3, 1, 10)
    │     → aplica array_diff_key em cada linha (remove $hidden)
    │     → monta envelope {data:[...], pagination:{page:1,limit:10,total:3,pages:1}}
    ▼
[BaseTableService] → [Controller] → respondPaginated()
    ▼
Cliente HTTP ← HTTP 200
    {
        "data": [
            {"id": 3, "name": "Toyoda Motors", "status": "active", ...},
            {"id": 1, "name": "Toyota",         "status": "active", ...}
        ],
        "pagination": {"page": 1, "limit": 10, "total": 3, "pages": 1}
    }
```

---

## 15. Erros Comuns

| Erro | Causa | Solução |
| --- | --- | --- |
| Campo gravado no INSERT mas não aparece no retorno | Campo em `$hidden` | Verificar `$hidden` no SqlTableModel |
| Campo enviado no body não é gravado | Campo ausente em `$allowedFields` | Adicionar o campo em `$allowedFields` |
| Ordenação por campo customizado retorna sempre por `id` | Campo não está em `$sortableFields` | Adicionar o campo em `$sortableFields` do filho |
| Filtro por texto não usa LIKE (retorna vazio com busca parcial) | Campo não está em `$likeFields` | Adicionar o campo em `$likeFields` do filho |
| `restore()` não funciona — campo not in allowedFields | `restore` usa `db->table()` diretamente, não depende de `$allowedFields` — verificar outro problema | Verificar se `$deletedField = 'deleted_at'` não foi alterado |
| `existsByField` retorna `true` para registros soft-deleted | Por design — `existsByField` considera apenas `deleted_at IS NULL` | Correto: registros deletados não conflitam com unicidade |
| `findDeletedPaginated` retorna zero mesmo com soft-deletes | `useSoftDeletes=true` interfere | O método usa `db->table()` direto — verificar se `$deletedField` está correto |
| `clearDeleted()` não remove nada | Nenhum registro tem `deleted_at IS NOT NULL` | Confirmar que `deleteSoft()` foi chamado antes |

---

## 16. Sobre o Autor

| Campo    | Informação |
| -------- | ---------- |
| Nome     | Gustavo Hammes |
| Cargo    | Analista de Sistemas |
| Empresa  | Habilidade .Com |
| Site     | [habilidade.com](https://habilidade.com) |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
