# ROADMAP — Libraries (ApiExceptionHandler + JwtHelper + ContentFilter)

> **Público-alvo:** Desenvolvedor júnior que precisa entender as três classes de infraestrutura crítica da API V1: como os erros são capturados e formatados, como o JWT é gerado e validado e como o conteúdo das mensagens é moderado.
>
> **Pasta documentada:** `src/app/Libraries/`

---

← [Voltar ao README](../../../README.md)

---

## Sumário

1. [Visão Geral da pasta Libraries](#1-visão-geral-da-pasta-libraries)
2. [ApiExceptionHandler — Handler Global de Exceções](#2-apiexceptionhandler--handler-global-de-exceções)
3. [JwtHelper — Geração e Validação de Tokens JWT](#3-jwthelper--geração-e-validação-de-tokens-jwt)
4. [Msg/ContentFilter — Moderação de Conteúdo](#4-msgcontentfilter--moderação-de-conteúdo)
5. [Como as três classes se conectam](#5-como-as-três-classes-se-conectam)
6. [Erros Comuns](#6-erros-comuns)
7. [Sobre o Autor](#7-sobre-o-autor)

---

## 1. Visão Geral da pasta Libraries

A pasta `Libraries` contém classes de **infraestrutura transversal** — componentes que não pertencem a um módulo específico, mas que toda a aplicação utiliza.

| Arquivo | Classe | Responsabilidade | Usada por |
| --- | --- | --- | --- |
| `ApiExceptionHandler.php` | `ApiExceptionHandler` | Captura qualquer erro não tratado em rotas `api/*` e retorna JSON padronizado | `Config/Exceptions.php` (automático) |
| `JwtHelper.php` | `JwtHelper` | Gera e valida tokens JWT HS256 em PHP puro | `AuthFilter` — toda requisição protegida |
| `Msg/ContentFilter.php` | `ContentFilter` | Substitui palavras e frases proibidas em textos de mensagens | Processors do módulo `Msg` |

> Estas são as classes mais críticas do projeto. Uma falha aqui afeta **toda** a API.

---

## 2. ApiExceptionHandler — Handler Global de Exceções

**Arquivo:** `src/app/Libraries/ApiExceptionHandler.php`

### O problema que ela resolve

Sem um handler customizado, quando um erro não tratado ocorre numa rota de API, o CI4 retorna uma **página HTML de erro** — que quebra qualquer cliente que espera JSON.

O `ApiExceptionHandler` garante que **toda exceção não capturada em rotas `api/*` sempre retorne JSON padronizado**.

### Como é registrado

Em `src/app/Config/Exceptions.php`, o método `handler()` decide qual handler usar baseado na URL:

```php
public function handler(int $statusCode, Throwable $exception): ExceptionHandlerInterface
{
    $path = ltrim(service('request')->getUri()->getPath(), '/');

    if (str_starts_with($path, 'api/')) {
        return new ApiExceptionHandler();   // ← rotas API: sempre JSON
    }

    return new ExceptionHandler($this);     // ← outras rotas: HTML padrão do CI4
}
```

### Lógica interna

```
Throwable não tratado chega ao handler
    │
    ├── É PageNotFoundException?
    │       → statusCode = 404
    │       → message = "Rota não encontrada"
    │       → NÃO loga (rota inexistente não é erro interno)
    │
    └── É qualquer outro Throwable?
            → statusCode = original (se >= 400) ou 500
            → message = "Erro interno no servidor"
            → loga detalhes com log_message('error', ...)
                  [API 500] {mensagem} em {arquivo}:{linha}
```

### Resposta JSON (404 — rota não encontrada)

```json
{
  "method": "GET",
  "endpoint": "/api/v1/rota/inexistente",
  "statusCode": 404,
  "message": "Rota não encontrada",
  "success": false
}
```

### Resposta JSON (500 — erro interno)

```json
{
  "method": "POST",
  "endpoint": "/api/v1/mec/vehicle-brand/create",
  "statusCode": 500,
  "message": "Erro interno no servidor",
  "success": false
}
```

> O detalhe do erro (`$exception->getMessage()`, arquivo, linha) é **logado internamente** mas nunca exposto ao cliente — segurança por design.

### Fluxo completo

```
Controller lança exceção não capturada
    │
    ▼
CI4 — Config/Exceptions.php::handler()
    │  str_starts_with(path, 'api/') → true
    ▼
ApiExceptionHandler::handle()
    │
    ├── PageNotFoundException → HTTP 404 JSON (sem log)
    │
    └── Qualquer outro erro   → HTTP 500 JSON + log_message('error', ...)
    │
    ▼
$response->setStatusCode()->setContentType('application/json')->setBody()->send()
```

---

## 3. JwtHelper — Geração e Validação de Tokens JWT

**Arquivo:** `src/app/Libraries/JwtHelper.php`

### O que é um JWT

JWT (*JSON Web Token*) é um token em 3 partes separadas por ponto:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9   ← Header  (Base64url)
.
eyJ1c2VyX2lkIjoxLCJleHAiOjE2OTk5OTk5fQ ← Payload (Base64url)
.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c ← Assinatura (HMAC-SHA256)
```

- **Header**: declara o algoritmo (`HS256`) e o tipo (`JWT`)
- **Payload**: dados do usuário + `iat` (emissão) + `exp` (expiração)
- **Assinatura**: garante que o token não foi adulterado

### Constantes

```php
private const ALGORITHM   = 'HS256';   // algoritmo HMAC-SHA256
private const DEFAULT_TTL = 36000;     // 10 horas em segundos
```

---

### encode() — Gera um token JWT

```php
public static function encode(array $payload, int $ttl = self::DEFAULT_TTL): string
```

**O que recebe:** um array com dados do usuário (ex: `user_id`, `email`, `tenant_id`)
**O que retorna:** string no formato `header.payload.signature`

**Passo a passo interno:**

```php
$now = time();
$payload['iat'] = $now;           // "issued at" — quando foi gerado
$payload['exp'] = $now + $ttl;    // "expires at" — quando expira (now + 10h)

// 1. Monta o header JSON e codifica em Base64url
$header = base64url( json_encode(['alg' => 'HS256', 'typ' => 'JWT']) );

// 2. Monta o payload JSON e codifica em Base64url
$body   = base64url( json_encode($payload) );

// 3. Calcula a assinatura HMAC-SHA256
$signing   = $header . '.' . $body;
$signature = base64url( hash_hmac('sha256', $signing, $secret, true) );

// 4. Retorna o token completo
return $signing . '.' . $signature;
```

**Exemplo de uso (no Processor de login):**

```php
$token = JwtHelper::encode([
    'user_id'              => 42,
    'uuid'                 => 'abc-def-...',
    'email'                => 'usuario@email.com',
    'user_saas_tenants_id' => 1,
]);
// Retorna: "eyJ...header...eyJ...payload...SflK...signature"
```

---

### decode() — Valida e decodifica um token JWT

```php
public static function decode(string $token): array
```

**O que recebe:** o token JWT como string bruta (sem `Bearer `)
**O que retorna:** o payload decodificado como array PHP
**O que lança:** `\RuntimeException` se qualquer validação falhar

**As 3 validações em ordem:**

```
Token recebido: "aaa.bbb.ccc"
    │
    ▼
1. Estrutura
    │  explode('.', $token) → deve ter exatamente 3 partes
    └── ≠ 3 partes → RuntimeException("Token JWT malformado")
    │
    ▼
2. Assinatura (timing-safe)
    │  recalcula: hash_hmac('sha256', "aaa.bbb", $secret, true)
    │  compara:   hash_equals($esperado, $recebido)
    └── diferente → RuntimeException("Assinatura do token JWT inválida")
    │
    ▼
3. Expiração
    │  json_decode(base64url_decode("bbb")) → payload
    │  $payload['exp'] < time() ?
    └── expirado → RuntimeException("Token JWT expirado")
    │
    ▼
Retorna $payload como array
```

**Por que `hash_equals` em vez de `===`?**

```php
// ERRADO — vulnerável a timing attack
if ($expected === $received) { ... }

// CORRETO — tempo de comparação constante, independente do conteúdo
if (hash_equals($expected, $received)) { ... }
```

Um atacante que mede o tempo de resposta pode deduzir quantos caracteres da assinatura estão corretos. `hash_equals` sempre compara byte a byte até o fim, tornando esse ataque impossível.

---

### O segredo JWT — getSecret()

```php
private static function getSecret(): string
{
    $secret = defined('E61E7DE603852182385DA5E907B4B232')
        ? E61E7DE603852182385DA5E907B4B232        // constante ofuscada (Puipuia.php)
        : (getenv('JWT_SECRET') ?: '');           // fallback: variável de ambiente

    if (empty($secret)) {
        throw new \RuntimeException('JWT_SECRET não configurado');
    }

    return $secret;
}
```

**Prioridade do segredo:**

```
1º — Constante E61E7DE603852182385DA5E907B4B232
         → definida em src/system/HotReloader/Puipuia.php
         → carregada automaticamente via Config/Constants.php
         → ofuscada por nome sem sentido (proteção extra)

2º — Variável de ambiente JWT_SECRET
         → definida no arquivo .env na raiz do projeto
         → fallback para ambientes sem o Puipuia.php
```

> **Nunca commite o segredo JWT em texto claro no código.** A ofuscação via constante com nome aleatório é uma camada de proteção adicional.

---

### Base64url — Por que não Base64 comum?

O Base64 comum usa os caracteres `+`, `/` e `=` (padding). Estes caracteres têm significado especial em URLs e headers HTTP, o que causaria corrupção do token.

**Base64url** (RFC 4648 §5) substitui:
- `+` → `-`
- `/` → `_`
- Remove o padding `=`

```php
// Encode
rtrim(strtr(base64_encode($data), '+/', '-_'), '=');

// Decode
$padded = str_pad(strtr($data, '-_', '+/'), strlen($data) + (4 - strlen($data) % 4) % 4, '=');
base64_decode($padded);
```

---

### Como o JwtHelper se conecta ao AuthFilter

```
Cliente → Authorization: Bearer {token}
    │
    ▼
AuthFilter::before()
    │  $token = substr($authHeader, 7)  // remove "Bearer "
    │  JwtHelper::decode($token)        // valida tudo
    │      ├── RuntimeException → HTTP 401
    │      └── array $payload   → continua para o controller
    ▼
Controller executa normalmente
```

---

## 4. Msg/ContentFilter — Moderação de Conteúdo

**Arquivo:** `src/app/Libraries/Msg/ContentFilter.php`

### O que faz

Sanitiza textos de mensagens substituindo palavras e frases proibidas por marcadores. É uma classe `final` com dois métodos estáticos: um para texto puro e outro para arrays de dados.

### As duas listas de proibições

#### BANNED_PHRASES — Frases multi-palavra

Verificadas **primeiro**, sem `\b` (word-boundary) — captura a frase em qualquer posição do texto.

```php
private const BANNED_PHRASES = [
    'vai tomar no cu'   => '_____________',
    'filho da puta'     => '_____________',
    'sua mãe'           => '_____________',
    // frases mais longas PRIMEIRO para evitar substituição parcial
];
```

> **Regra importante:** coloque frases mais longas antes das mais curtas. Ex: `'vai tomar no cu'` deve vir antes de `'tomar no cu'` — caso contrário `'vai tomar no cu'` seria parcialmente substituída pela frase menor primeiro.

#### BANNED_WORDS — Palavras isoladas

Verificadas **depois**, com `\b` (word-boundary) — captura apenas a palavra completa, não partes de outras palavras.

```php
private const BANNED_WORDS = [
    // Palavrões → substituto genérico
    'merda'   => '_______',
    'porra'   => '_______',
    'caralho' => '_______',

    // Nomes restritos → substituto diferenciado
    'gustavo' => '#######',
    'fábio'   => '@@@@@@@',
];
```

**O `\b` (word-boundary) na prática:**

```
Texto: "Que cúmulo de absurdo!"

Palavra proibida: 'cu'  com \b
→ NÃO substitui: 'cú' em 'cúmulo' não é palavra isolada

Palavra proibida: 'cu'  sem \b
→ SUBSTITUIRIA: qualquer ocorrência, inclusive em outras palavras
```

### Flags de regex: `/iu`

```
i → case-insensitive: "Merda", "MERDA", "merda" são tratados igual
u → Unicode: funciona com acentos (ã, é, ç, ú...)
```

---

### sanitize() — Sanitiza um texto completo

```php
public static function sanitize(string $text): string
```

**Fluxo interno:**

```
Texto de entrada: "Que merda! Vai tomar no cu seu idiota"
    │
    ▼
Passo 1: BANNED_PHRASES (sem \b)
    │  'vai tomar no cu' → '_____________'
    │  Resultado: "Que merda! _____________ seu idiota"
    │
    ▼
Passo 2: BANNED_WORDS (com \b)
    │  'merda' → '_______'
    │  'idiota' → '_______'
    │  Resultado: "Que _______! _____________ seu _______"
    │
    ▼
Retorna: "Que _______! _____________ seu _______"
```

**Exemplo de uso direto:**

```php
$texto = "Filho da puta, que merda!";
$sanitizado = ContentFilter::sanitize($texto);
// → "_____________, que _______!"
```

---

### sanitizeFields() — Sanitiza campos específicos de um array

```php
public static function sanitizeFields(array $data, array $fields): array
```

**O que recebe:**
- `$data` — array de dados (ex: body da requisição decodificado)
- `$fields` — lista de campos a sanitizar (campos ausentes ou não-string são ignorados)

**Exemplo de uso (em um Processor do módulo Msg):**

```php
// No GroupMessage\Processor::prepareData()
protected function prepareData(array $data): array
{
    return ContentFilter::sanitizeFields($data, ['content']);
}
```

**O que acontece internamente:**

```php
foreach ($fields as $field) {
    if (isset($data[$field]) && is_string($data[$field])) {
        $data[$field] = self::sanitize($data[$field]);
        //              ↑ aplica as duas passagens (frases + palavras)
    }
    // campo ausente ou não-string → ignora silenciosamente
}
return $data;
```

---

### Onde é usado no projeto

O `ContentFilter` é chamado nos `prepareData()` dos Processors do módulo Msg, aplicado ao campo `content` antes de persistir no banco:

| Processor | Campo sanitizado |
| --- | --- |
| `Msg\GroupMessage\Processor` | `content` |
| `Msg\Private\Processor` | `content` |
| `Msg\Timeline\Processor` | `content` |

---

### Como adicionar novas palavras ou frases

**Para adicionar uma frase:**

```php
private const BANNED_PHRASES = [
    // coloque frases mais longas ANTES
    'nova frase proibida longa'   => '_____________',
    'nova frase curta'            => '_____________',
    // ... existentes ...
];
```

**Para adicionar uma palavra:**

```php
private const BANNED_WORDS = [
    // palavra + substituto adequado ao tipo
    'novapalavra' => '_______',    // palavrão genérico
    'nomepessoa'  => '#######',    // nome restrito
    'outrotipo'   => '@@@@@@@',    // outro tipo de restrição
    // ... existentes ...
];
```

> A classe é `final` — não pode ser herdada. Toda extensão é feita editando diretamente as constantes.

---

## 5. Como as três classes se conectam

```
Requisição HTTP recebida
    │
    ▼
┌─────────────────────────────────────────────────────────────┐
│  AuthFilter::before()                                       │
│      JwtHelper::decode($token)  ← valida JWT               │
│          ├── falha → HTTP 401 (AuthFilter responde)         │
│          └── ok    → continua                               │
└─────────────────────────────────────────────────────────────┘
    │
    ▼
Controller → Processor → prepareData()
    │             │
    │             └── ContentFilter::sanitizeFields($data, [...])
    │                     ← sanitiza mensagens antes de salvar
    │
    ▼
Banco de dados (dados limpos)
    │
    ▼
Resposta HTTP 200 JSON
    │
    │  (se qualquer exceção não tratada ocorrer)
    ▼
┌─────────────────────────────────────────────────────────────┐
│  ApiExceptionHandler::handle()                              │
│      ← captura tudo que escapou dos try/catch               │
│      ← retorna JSON 404 ou 500 (nunca HTML)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. Erros Comuns

| Erro | Causa | Solução |
| --- | --- | --- |
| API retorna HTML de erro em vez de JSON | `ApiExceptionHandler` não registrado ou rota não começa com `api/` | Verificar `Config/Exceptions.php` e o prefixo da rota |
| `RuntimeException: JWT_SECRET não configurado` | Nem `Puipuia.php` nem `.env` definem o segredo | Verificar `src/system/HotReloader/Puipuia.php` ou adicionar `JWT_SECRET=valor` no `.env` |
| `RuntimeException: Assinatura do token JWT inválida` | Token foi gerado com segredo diferente do atual | Regenerar o token via login |
| `RuntimeException: Token JWT expirado` | TTL de 10 horas expirou | Cliente deve fazer refresh ou novo login |
| Palavra proibida não é substituída | `\b` impede match em parte de outra palavra (comportamento correto) | Verificar se a palavra aparece de forma isolada no texto |
| Frase substituída parcialmente | Frase mais curta está antes da mais longa em `BANNED_PHRASES` | Reordenar — frases mais longas SEMPRE primeiro |
| `ContentFilter` não sanitiza campo | Campo ausente no `$data` ou não é string | Verificar se o campo existe e é string antes de chamar `sanitizeFields` |

---

## 7. Sobre o Autor

| Campo    | Informação |
| -------- | ---------- |
| Nome     | Gustavo Hammes |
| Cargo    | Analista de Sistemas |
| Empresa  | Habilidade .Com |
| Site     | [habilidade.com](https://habilidade.com) |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
