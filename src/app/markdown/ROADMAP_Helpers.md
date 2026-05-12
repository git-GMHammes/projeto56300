# ROADMAP — Helpers Globais (debug + uuid)

> **Público-alvo:** Desenvolvedor júnior que precisa entender o que são os helpers globais do projeto, como usá-los e como criar novos seguindo o padrão.
>
> **Pasta documentada:** `src/app/Helpers/`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [O que é um Helper no CodeIgniter 4](#1-o-que-é-um-helper-no-codeigniter-4)
2. [Helpers desta pasta](#2-helpers-desta-pasta)
3. [Carregamento Automático](#3-carregamento-automático)
4. [debug() — Inspeção de variáveis](#4-debug--inspeção-de-variáveis)
5. [uuid() — Geração de UUID v4](#5-uuid--geração-de-uuid-v4)
6. [Como criar um novo Helper](#6-como-criar-um-novo-helper)
7. [Erros Comuns](#7-erros-comuns)
8. [Sobre o Autor](#8-sobre-o-autor)

---

## 1. O que é um Helper no CodeIgniter 4

Um **Helper** é um arquivo PHP que contém um conjunto de **funções globais** — disponíveis em qualquer lugar da aplicação sem precisar de `use`, `require` ou instanciar classes.

| Característica | Helper | Classe |
| --- | --- | --- |
| Forma de uso | `debug($var)` — chama diretamente | `new MinhaClasse()->metodo()` |
| Namespace | Nenhum — função global | Precisa de `use` ou FQCN |
| Ideal para | Utilitários simples e independentes | Lógica com estado ou dependências |
| Carregamento | Via `Autoload.php` ou `helper('nome')` | Via autoload do Composer/CI4 |

A convenção de nomenclatura do CI4 para helpers é: `{nome}_helper.php`. O CI4 carrega o arquivo pelo nome sem o sufixo `_helper`.

---

## 2. Helpers desta pasta

| Arquivo | Função exposta | Responsabilidade |
| --- | --- | --- |
| `myDebug_helper.php` | `debug($data, $label, $die)` | Exibe qualquer variável formatada em `<pre>` — uso exclusivo em desenvolvimento |
| `myUuid_helper.php` | `uuid()` | Gera um UUID v4 criptograficamente seguro com `random_int` |

O prefixo `my` diferencia os helpers customizados do projeto dos helpers nativos do CI4 (ex: `url_helper`, `text_helper`).

---

## 3. Carregamento Automático

Os dois helpers são carregados automaticamente em **toda requisição** via `src/app/Config/Autoload.php`:

```php
public $helpers = [
    'myDebug',
    'myUuid',
];
```

O CI4 resolve `'myDebug'` → `app/Helpers/myDebug_helper.php` automaticamente.

**O que isso significa na prática:** as funções `debug()` e `uuid()` estão disponíveis em qualquer Controller, Model, Service ou View — sem nenhuma linha de importação.

### Carregamento manual (alternativa)

Se um helper **não** estiver no Autoload, ele pode ser carregado pontualmente:

```php
// Em um controller ou service
helper('myDebug');

// Ou múltiplos de uma vez
helper(['myDebug', 'myUuid']);
```

---

## 4. debug() — Inspeção de variáveis

**Arquivo:** `src/app/Helpers/myDebug_helper.php`

### Assinatura

```php
function debug(mixed $data, string $label = '', bool $die = false): void
```

### Parâmetros

| Parâmetro | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `$data` | `mixed` | — | Qualquer variável: array, objeto, string, int, null, bool |
| `$label` | `string` | `''` | Rótulo exibido em negrito acima dos dados (opcional) |
| `$die` | `bool` | `false` | Se `true`, chama `exit` após exibir — interrompe a execução |

### O que a função faz internamente

```php
echo '<pre>';
if ($label !== '') {
    echo "<strong>$label</strong>\n";
}
print_r($data);    // formata arrays e objetos de forma legível
echo '</pre>';

if ($die) {
    exit;
}
```

### Exemplos de uso

**Exemplo 1 — Inspecionar um array simples:**
```php
$dados = ['nome' => 'Toyota', 'modelos' => 12];
debug($dados);
```

**Saída no navegador:**
```
Array
(
    [nome] => Toyota
    [modelos] => 12
)
```

---

**Exemplo 2 — Com label para identificar a variável:**
```php
debug($dados, 'Resultado do Processor');
```

**Saída:**
```
Resultado do Processor
Array
(
    [nome] => Toyota
    [modelos] => 12
)
```

---

**Exemplo 3 — Com `$die = true` para parar a execução (dump and die):**
```php
debug($dados, 'Verificando antes do update', true);
// Nada após esta linha será executado
```

---

**Exemplo 4 — Inspecionar o retorno de um método do Processor:**
```php
$result = $this->processor->find([], $this->getPaginationParams());
debug($result, 'find() result', true);
```

---

**Exemplo 5 — Inspecionar um objeto:**
```php
debug($this->request->getJSON(), 'Body da requisição');
```

### ⚠️ NUNCA use em produção

A função `debug()` produz saída HTML (`<pre>`) diretamente. Em uma API REST, isso **quebra o JSON** da resposta e pode expor dados sensíveis.

| Ambiente | Uso |
| --- | --- |
| `development` | ✅ Livre para usar |
| `testing` | ✅ Com cuidado |
| `production` | ❌ NUNCA — remove antes do merge |

> **Dica:** Use `debug($var, 'label', true)` como substituto rápido do `dd()` do Laravel ou do `var_dump()` puro.

---

## 5. uuid() — Geração de UUID v4

**Arquivo:** `src/app/Helpers/myUuid_helper.php`

### Assinatura

```php
function uuid(): string
```

Não recebe parâmetros. Retorna uma string no formato `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.

### O que é um UUID v4

UUID (*Universally Unique Identifier*) versão 4 é um identificador de 128 bits gerado **aleatoriamente**. Formato:

```
550e8400-e29b-41d4-a716-446655440000
│        │    │    │    │
│        │    │    │    └── 12 hex aleatórios
│        │    │    └─────── 4 hex (variante: começa com 8, 9, a ou b)
│        │    └──────────── 4 hex (versão: começa com 4)
│        └───────────────── 4 hex aleatórios
└────────────────────────── 8 hex aleatórios
```

### Por que `random_int` e não `rand`?

| Função | Tipo | Segurança |
| --- | --- | --- |
| `rand()` | Pseudoaleatório | ❌ Previsível — não usar para IDs únicos |
| `mt_rand()` | Mersenne Twister | ❌ Ainda previsível |
| `random_int()` | CSPRNG (SO) | ✅ Criptograficamente seguro — imprevisível |

A função `uuid()` usa `random_int(0, 0xffff)` em cada segmento, garantindo que cada UUID gerado seja **praticamente impossível de prever ou colidir**.

### Implementação comentada

```php
function uuid(): string
{
    return sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        random_int(0, 0xffff),           // 8 hex — segmento 1
        random_int(0, 0xffff),           // 8 hex — segmento 1 (cont.)
        random_int(0, 0xffff),           // 4 hex — segmento 2
        random_int(0, 0x0fff) | 0x4000, // 4 hex — versão 4 (bit fixo)
        random_int(0, 0x3fff) | 0x8000, // 4 hex — variante RFC 4122 (bit fixo)
        random_int(0, 0xffff),           // 12 hex — segmento 3
        random_int(0, 0xffff),           // 12 hex — segmento 3 (cont.)
        random_int(0, 0xffff),           // 12 hex — segmento 3 (cont.)
    );
}
```

### Exemplos de uso no projeto

**Exemplo 1 — Geração ao criar um registro:**
```php
// No Processor, ao preparar dados para inserção
protected function prepareData(array $data): array
{
    $data['uuid'] = uuid();  // gera UUID único para o novo registro
    return $data;
}
```

**Exemplo 2 — No Model, como valor padrão:**
```php
// Em um SqlTableModel filho
protected array $allowedFields = [
    'uuid', 'name', 'user_saas_tenants_id', ...
];
```

**Exemplo 3 — Verificar o formato gerado:**
```php
debug(uuid(), 'UUID gerado');
// Saída: 3f2504e0-4f89-11d3-9a0c-0305e82c3301
```

**Exemplo 4 — Múltiplos UUIDs:**
```php
// Cada chamada gera um UUID diferente
$uuid1 = uuid(); // ex: 550e8400-e29b-41d4-a716-446655440000
$uuid2 = uuid(); // ex: 7d793037-a076-491d-986d-6b3e0c03a52b
```

### Como o UUID é usado no banco de dados

As tabelas do projeto armazenam o UUID como `VARCHAR(36)`:

```sql
CREATE TABLE mec_01_vehicle_brand (
    id   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid VARCHAR(36) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    ...
);
```

O `id` é a chave primária para JOINs internos (performance). O `uuid` é o identificador público exposto pela API — nunca exponha o `id` numérico sequencial para clientes externos.

---

## 6. Como criar um novo Helper

Siga o padrão em 3 passos:

### Passo 1 — Criar o arquivo

Crie `src/app/Helpers/meu{Nome}_helper.php` com a convenção de guarda `function_exists`:

```php
<?php

if (! function_exists('minhaFuncao')) {
    function minhaFuncao(string $param): string
    {
        // sua lógica aqui
        return $param;
    }
}
```

> **Por que `function_exists`?** Evita erro fatal se o arquivo for carregado duas vezes ou se outro código já definiu a mesma função.

### Passo 2 — Registrar no Autoload

Em `src/app/Config/Autoload.php`, adicione o nome do helper (sem `_helper`):

```php
public $helpers = [
    'myDebug',
    'myUuid',
    'meuNome',  // ← adicionar aqui
];
```

### Passo 3 — Usar em qualquer lugar

```php
// Em um Controller, Service, Model ou View
$resultado = minhaFuncao('valor');
```

### Convenções do projeto

| Regra | Exemplo correto | Errado |
| --- | --- | --- |
| Nome do arquivo com prefixo `my` | `mySlug_helper.php` | `slug_helper.php` |
| Sufixo `_helper.php` | `mySlug_helper.php` | `mySlug.php` |
| Guarda `function_exists` | `if (! function_exists('slug'))` | Sem guarda |
| Funções independentes | Sem estado, sem `$this` | Usar classe em vez de helper |

---

## 7. Erros Comuns

| Erro | Causa | Solução |
| --- | --- | --- |
| `Call to undefined function debug()` | Helper não carregado | Verificar se `'myDebug'` está em `Config/Autoload.php` |
| `Call to undefined function uuid()` | Helper não carregado | Verificar se `'myUuid'` está em `Config/Autoload.php` |
| JSON da API corrompido com `<pre>` | `debug()` chamado em código de produção/rota API | Remover todas as chamadas `debug()` antes do merge |
| `Cannot redeclare function debug()` | Helper carregado duas vezes | Verificar se a guarda `function_exists` está presente no arquivo |
| UUID com formato incorreto | Usando `rand()` em vez de `uuid()` | Substituir por `uuid()` |

---

## 8. Sobre o Autor

| Campo    | Informação |
| -------- | ---------- |
| Nome     | Gustavo Hammes |
| Cargo    | Analista de Sistemas |
| Empresa  | Habilidade .Com |
| Site     | [habilidade.com](https://habilidade.com) |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
