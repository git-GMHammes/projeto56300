## Análise Estrutural Obrigatória Antes de Criar/Atualizar Módulos ou Features

**Antes de criar ou atualizar qualquer Módulo ou Feature, é obrigatório analisar as colunas e chaves das tabelas envolvidas.**

Utilize comandos como:

```
SELECT column_name, data_type, character_maximum_length AS tamanho_maximo
FROM information_schema.columns 
WHERE table_name = 'nome_da_tabela' AND table_schema = 'codeigniter56300_api_db'
ORDER BY ordinal_position;

SELECT 
  column_name AS Coluna,
  CASE 
    WHEN column_key = 'PRI' THEN 'Chave Primária'
    WHEN column_key = 'MUL' THEN 'Chave Estrangeira'
    ELSE 'Não'
  END AS Eh_Chave
FROM information_schema.columns 
WHERE table_name = 'nome_da_tabela' AND table_schema = 'codeigniter56300_api_db';
```

Essa análise agiliza a criação de Models, definição de campos permitidos, validações de Requests e entendimento das relações entre tabelas.
# Copilot Instructions — Projeto56300



## Requisito Prévio para Desenvolvimento

**Antes de iniciar qualquer trabalho com módulos ou features, é OBRIGATÓRIO acessar o banco de dados de desenvolvimento e obter a lista completa de tabelas e views do banco vigente.**

Essa consulta garante que toda implementação, modelagem e herança de BASES estejam alinhadas com a estrutura real do banco, evitando inconsistências e retrabalho. Sempre utilize o comando:

```
SHOW FULL TABLES IN nome_do_banco;
```
Ou equivalente via terminal/container:
```
podman exec -i codeigniter56300_mysql mysql -ucodeigniter56300_user -p'codeigniter56300_P@ssw0rd_2024' -e "SHOW FULL TABLES IN codeigniter56300_api_db;"
```

Somente após obter e analisar a lista de tabelas/views, inicie a implementação de qualquer módulo/feature.

Este sistema **NÃO DUPLICA FUNÇÕES** em hipótese alguma. Toda lógica comum e funções básicas estão centralizadas em **BASES** obrigatórias, que DEVEM ser herdadas por todos os Módulos ou Features. Nenhum controller, service, request ou model pode reimplementar funções já presentes nas BASES.

### Arquivos BASES obrigatórios:

- `src/app/Controllers/BaseController.php`
- `src/app/Controllers/Api/V1/BaseResourceTableController.php`
- `src/app/Controllers/Api/V1/BaseResourceViewController.php`
- `src/app/Models/V1/BaseTableModel.php`
- `src/app/Models/V1/BaseViewModel.php`
- `src/app/Services/V1/BaseTableService.php`
- `src/app/Services/V1/BaseViewService.php`

**Todas as funções básicas (CRUD, busca, paginação, validação, helpers de resposta, soft delete, timestamps, sanitização, etc) estão nestas BASES e nunca devem ser duplicadas em nenhum controller, service, request ou model.**

Somente dados muito exclusivos de tabelas, como conjunto de chaves, campos, ordem de colunas, podem ser definidos fora das BASES, diretamente nos filhos.

Essa separação rígida garante **escalabilidade**, facilidade de **atualizações evolutivas/corretivas** e manutenção simples. Qualquer atualização nas BASES deve sempre prever o impacto em todas as heranças e módulos dependentes.

A API é versionada e todas as implementações atuais pertencem à versão **V1**. Qualquer novo recurso deve seguir o padrão V1 enquanto não houver migração para uma versão superior.

---

## Stack de Tecnologias

| Camada         | Tecnologia                       |
| -------------- | -------------------------------- |
| Infraestrutura | Podman (compatível com Docker)   |
| Backend        | CodeIgniter 4 / PHP              |
| Banco de Dados | MySQL 8.0                        |
| Frontend Web   | React / TypeScript, Bootstrap    |
| Mobile         | React Native, Bootstrap          |
| Servidor HTTP  | Nginx (Alpine)                   |
| Node.js Dev    | Node 20 Alpine (Vite dev server) |

---

## Infraestrutura — Podman / Docker Compose

O arquivo `docker-compose.yml` define os serviços abaixo. O ambiente é gerenciado via **Podman** (substituto rootless do Docker).

| Serviço   | Container                  | Porta Externa | Porta Interna | Observação                   |
| --------- | -------------------------- | ------------- | ------------- | ---------------------------- |
| `mysql`   | `codeigniter56300_mysql`   | `56301`       | `3306`        | MySQL 8.0, healthcheck ativo |
| `adminer` | `codeigniter56300_adminer` | `56302`       | `8080`        | Interface web para o banco   |
| `php`     | `codeigniter56300_php`     | —             | `9000`        | PHP-FPM, volume `./src`      |
| `nginx`   | `codeigniter56300_nginx`   | `56300`       | `80`          | Serve o backend PHP          |
| `node`    | `codeigniter56300_node`    | `56303`       | `5173`        | Vite dev server do frontend  |

- **Rede:** `codeigniter56300_network` (bridge)
- **Volume persistente:** `mysql_data` para dados do banco; `node_modules` para dependências npm
- **Root do backend:** `./src` mapeado para `/var/www/html`
- **Nginx config:** `./docker/nginx/default.conf` — aponta root para `/var/www/html/public`, roteia `.php` via `fastcgi` para `php:9000`
- **PHP Dockerfile:** `./docker/php/Dockerfile`
- **Podman:** usar `podman-compose` ou `podman play kube` como alternativa ao `docker compose`

---

## Multi-Tenancy SaaS

Toda tabela de módulo possui a coluna `user_saas_tenants_id` (FK para `user_004_saas_tenants.id`). Essa chave é o **isolador de dados por empresa/tenant**.

### Tabelas de identidade e controle de acesso

| Tabela                     | Papel                                                 |
| -------------------------- | ----------------------------------------------------- |
| `user_001_management`      | Usuários do sistema (login, uuid, senha hash)         |
| `user_002_customer`        | Perfil estendido do usuário (CPF, WhatsApp, endereço) |
| `user_003_customer_files`  | Arquivos vinculados ao perfil do cliente              |
| `user_004_saas_tenants`    | Empresas/tenants do SaaS (name, slug, plan, active)   |
| `user_005_tenants`         | Relacionamento user ↔ tenant com papel (role)         |
| `user_006_password_resets` | Tokens de reset de senha (SHA-256, com expiração)     |

> **Regra:** Nunca armazenar token de reset em plain text. Usar SHA-256 (`token_hash`). O campo `used_at` deve ser preenchido ao consumir o token.

---

## Módulos do Sistema

Cada módulo é identificado pelo **prefixo das tabelas**. Todas as tabelas de módulo têm `user_saas_tenants_id` para isolamento de tenant.

| Prefixo      | Módulo                 | Tabelas principais                                                                            |
| ------------ | ---------------------- | --------------------------------------------------------------------------------------------- |
| `alog_`      | Agenda / Logística     | users, categories, resources, recurrences, events, event_attendees, event_resource, reminders |
| `est_`       | Controle de Estoque    | warehouse, category, supplier, product, storage_location, product_stock, ...                  |
| `msg_`       | Mensageria             | timeline, group, group_member, group_read, private, timeline_reaction, ...                    |
| `sgd_`       | Gestão de Documentos   | document_categories, ...                                                                      |
| `task_`      | Tarefas / Projetos     | projects, ...                                                                                 |
| `vet_`       | Veterinário            | breeds, veterinarians, ...                                                                    |
| `mec_`       | Mecânica / Veículos    | vehicle_brand, ...                                                                            |
| `user_`      | Usuários / Auth / SaaS | (ver tabelas acima)                                                                           |
| `contact_us` | Formulário de Contato  | contact_us, contact_us_files                                                                  |

> Ao criar um novo módulo, definir um **prefixo único de 3-4 letras** e seguir o padrão de numeração sequencial das tabelas (`prefixo_NNN_nome`).

---

## Separação Frontend / Backend

O Frontend e o Backend são **100% desacoplados**:

- O backend expõe **apenas APIs REST** sob `/api/v1/...`
- O frontend e o mobile consomem essas APIs via **token de autenticação** (Bearer Token / JWT)
- Após o login (`POST /api/v1/auth/login`), o token é retornado e deve ser enviado no header `Authorization: Bearer {token}` em todas as requisições privadas
- **Rotas públicas:** login, registro, recuperação de senha, `contact_us`
- **Rotas privadas:** todo o restante — protegidas por filtro de autenticação no CodeIgniter

### Localização dos projetos

| Projeto       | Caminho                                |
| ------------- | -------------------------------------- |
| Backend (CI4) | `src/`                                 |
| Frontend Web  | `src/public/frontend/Projeto56300App/` |
| Mobile        | `src/public/mobile/Projeto56300App/`   |

---

## Arquitetura V1 — Padrão de BASES

### Princípio

Todo recurso da API V1 é construído sobre uma hierarquia de classes BASE. **Nunca duplicar lógica** — sempre herdar da base correta e sobrescrever apenas o que é específico do módulo.

### Hierarquia de Controllers (Backend)

```
CodeIgniter\Controller
  └── App\Controllers\BaseController          (bootstrap, helpers globais)
        └── App\Controllers\Api\V1\BaseResourceTableController   (14 endpoints: leitura + escrita + exclusão)
              └── App\Controllers\Api\V1\BaseResourceViewController  (8 endpoints: somente leitura via View)
                    └── Controllers específicos de cada módulo (ex: UserManagementController)
```

- **`BaseResourceTableController`** — fornece os 14 endpoints REST completos:
  `find`, `getGrouped`, `search`, `get`, `getAll`, `getNoPagination`, `getDeleted`, `getDeletedAll`, `create`, `update`, `delete`, `restore`, `forceDelete` + helpers de resposta padronizados
- **`BaseResourceViewController`** — herda de `BaseResourceTableController`, desabilita escrita (`getCreateRules`/`getUpdateRules` retornam `[]` e são `final`), fornece 8 endpoints de leitura via view SQL
- **Controllers de módulo** devem:
  1. Herdar da base correta
  2. Declarar `$this->processor` no `initController`
  3. Implementar `getCreateRules()` e `getUpdateRules()` (tabela) ou nenhum (view)

### Hierarquia de Models (Backend)

```
CodeIgniter\Model
  ├── App\Models\V1\BaseTableModel   (tabelas físicas — CRUD completo, soft delete, timestamps)
  └── App\Models\V1\BaseViewModel    (views SQL — somente leitura, sem timestamps, allowedFields=[])
        └── SqlViewModel do módulo
```

- **`BaseTableModel`** — `useSoftDeletes=true`, `useTimestamps=true`, `protectFields=true`; campos configuráveis: `$sortableFields`, `$likeFields`, `$hidden`
- **`BaseViewModel`** — `useSoftDeletes=false`, `useTimestamps=false`; campos configuráveis: `$sortableFields`, `$likeFields`, `$searchFields`
- Todo model filho deve declarar `$table`, `$allowedFields` e sobrescrever os arrays de configuração

### Hierarquia de Services / Processors (Backend)

```
App\Services\V1\BaseViewService        (utilitários: sanitização, máscaras, paginação + leitura de view)
  └── App\Services\V1\BaseTableService (herda BaseViewService + leitura de tabela + escrita + exclusão)
        └── Processor do módulo (ex: UserManagementProcessor)
```

- **`BaseViewService`** — sanitização de strings, remoção de máscaras (`cpf`, `whatsapp`, `phone`, `zip_code` e variantes `uc_`), utilitários de paginação e formatação de datas
- **`BaseTableService`** — adiciona `find`, `getGrouped`, `search`, `get`, `getAll`, `getNoPagination`, `getDeleted`, `getDeletedAll`, `create`, `update`, `delete`, `restore`, `forceDelete`
- **Processor do módulo:** declara `$this->tableModel` e/ou `$this->viewModel` no construtor; implementa regras de negócio específicas

---

## Estrutura de Diretórios

### Backend (`src/`)

```
src/
├── app/
│   ├── Controllers/
│   │   ├── BaseController.php                        ← Base global
│   │   └── Api/
│   │       └── V1/
│   │           ├── BaseResourceTableController.php   ← Base tabela (14 endpoints)
│   │           ├── BaseResourceViewController.php    ← Base view (8 endpoints, read-only)
│   │           ├── User/   (AuthUser, UserCustomer, UserManagement, UserPasswordResets)
│   │           ├── Msg/    (MessageFile, MessageGroup, MessageGroupMember, ...)
│   │           └── Mec/    (VehicleBrand, ...)
│   ├── Models/
│   │   └── V1/
│   │       ├── BaseTableModel.php                    ← Base model tabela física
│   │       ├── BaseViewModel.php                     ← Base model view SQL
│   │       ├── User/
│   │       ├── Msg/
│   │       └── Mec/
│   ├── Services/
│   │   └── V1/
│   │       ├── BaseViewService.php                   ← Utilitários + leitura view
│   │       ├── BaseTableService.php                  ← Escrita + exclusão + herda view
│   │       ├── User/
│   │       ├── Msg/
│   │       └── Mec/
│   ├── Requests/   ← Regras de validação por módulo/ação (CreateRequest, UpdateRequest)
│   ├── Filters/    ← Filtros de autenticação (token Bearer)
│   ├── Config/     ← Rotas, banco, app config
│   └── ...
└── public/
    ├── index.php   ← Entry point do CI4
    ├── frontend/
    │   └── Projeto56300App/   ← App React/Vite (Web)
    └── mobile/
        └── Projeto56300App/   ← App React Native (Mobile)
```

### Frontend Web (`src/public/frontend/Projeto56300App/src/`)

```
src/
├── components/   ← Componentes reutilizáveis (Bootstrap)
├── contexts/     ← Context API (auth, tenant, theme)
├── hooks/        ← Custom hooks reutilizáveis
├── pages/        ← Páginas por módulo
├── routes/       ← Rotas descentralizadas por módulo
├── services/     ← Chamadas à API (Axios/Fetch com token)
├── store/        ← Estado global (Redux/Zustand)
├── themes/       ← Temas visuais
├── types/        ← Tipos TypeScript globais
└── utils/        ← Funções utilitárias
```

> **Rotas descentralizadas:** cada módulo define seu próprio arquivo de rotas dentro de `routes/`, importado pelo roteador principal. Isso facilita atualizações evolutivas e corretivas sem impactar outros módulos.

> **Componentes reutilizáveis:** criar em `components/` com props bem tipadas. Nunca duplicar componentes entre módulos. Utilizar Bootstrap como base de estilo.

---

## Convenções de Desenvolvimento

### Versionamento — V1

- Todo novo controller de API deve estar em `App\Controllers\Api\V1\{Modulo}\`
- Todo novo model deve estar em `App\Models\V1\{Modulo}\`
- Todo novo service/processor deve estar em `App\Services\V1\{Modulo}\`
- Rotas de API sempre prefixadas com `/api/v1/`
- Ao criar uma V2, replicar a estrutura de pastas sem alterar a V1

### Banco de Dados

- Toda tabela de módulo **deve ter** `user_saas_tenants_id` (FK para `user_004_saas_tenants.id`)
- Padrão de nomeação: `{prefixo}_{NNN}_{nome}` (ex: `est_004_product`)
- Soft delete obrigatório: coluna `deleted_at datetime DEFAULT NULL`
- Timestamps obrigatórios: `created_at`, `updated_at`
- Charset padrão: `utf8mb4`, collation `utf8mb4_unicode_ci`
- Engine: `InnoDB`
- Campos com máscara (`cpf`, `whatsapp`, `phone`, `zip_code`) armazenados **somente com dígitos** — remoção feita pelo `BaseViewService::removeMasks()`

### Campos sensíveis

- Senhas: **nunca armazenar em plain text** — usar hash seguro
- Tokens de reset: armazenar apenas `SHA-256` do token (`token_hash`), nunca o token original
- Campos `$hidden` no `BaseTableModel`: declarar nos filhos os campos que não devem aparecer nas respostas da API

### Respostas da API

- Usar os helpers padronizados herdados de `BaseResourceTableController`: `respondPaginated()`, `respondValidationError()`, `respondServerError()`
- Todas as respostas seguem estrutura JSON consistente com paginação quando aplicável
- Erros de validação retornam HTTP 422; erros de servidor retornam HTTP 500

### Autenticação

- Autenticação via Bearer Token no header `Authorization`
- Filtro de auth aplicado no CodeIgniter (`src/app/Filters/`) protege todas as rotas privadas
- Login via `POST /api/v1/auth/login` — retorna token
- Logout invalida o token no servidor
- Reset de senha: token com expiração (`expires_at`), invalidado após uso (`used_at`)

### Frontend / Mobile

- Nunca embutir lógica de negócio diretamente em componentes de UI — usar `hooks/` ou `services/`
- Chamadas à API centralizadas em `services/` com interceptors para injeção do token
- Rotas privadas protegidas por guard que verifica o token antes de renderizar
- Bootstrap como framework CSS principal — evitar estilos inline ou CSS redundante

---

## Regras para o Copilot

1. **Sempre herdar das BASES V1** — nunca reimplementar lógica já existente em `BaseTableModel`, `BaseViewModel`, `BaseViewService`, `BaseTableService`, `BaseResourceTableController` ou `BaseResourceViewController`
2. **Seguir o prefixo de módulo** — ao criar novas tabelas ou classes, manter o prefixo correto do módulo
3. **Incluir `user_saas_tenants_id`** em toda nova tabela de módulo, com FK para `user_004_saas_tenants.id`
4. **V1 é imutável para compatibilidade** — não alterar assinaturas de métodos públicos das BASES sem criar uma V2
5. **Rotas descentralizadas** — cada módulo gerencia suas próprias rotas; não concentrar tudo em um único arquivo de rotas
6. **Soft delete sempre** — não usar `DELETE` físico; usar `deleted_at`
7. **Separação total Frontend/Backend** — o backend nunca renderiza HTML de aplicação; o frontend nunca contém lógica de banco
8. **Máscaras no serviço** — CPF, telefone e CEP são armazenados sem máscara; a formatação é responsabilidade do frontend
9. **Nomenclatura em inglês** para código (classes, métodos, variáveis); comentários e documentação podem ser em português
10. **Infraestrutura Podman** — ao gerar comandos de container, preferir `podman` ou `podman-compose`; os arquivos `docker-compose.yml` são compatíveis com ambos

## Padrão de Serviços HTTP no Frontend

- Nunca utilize axios diretamente em componentes React.
- Toda chamada HTTP deve ser centralizada em um service (ex: AuthService, UserService) usando fetch ou helpers globais.
- O padrão é:
  - Criar funções assíncronas no service para cada endpoint (ex: createUser, createCustomer)
  - O componente apenas importa e chama a função do service, recebendo o envelope de resposta.
- Isso garante:
  - Reutilização, testabilidade e padronização das chamadas
  - Facilidade de troca de implementação (fetch, axios, etc) sem alterar componentes
  - Consistência com o padrão já usado em AuthService/Login

> Exemplo de uso correto:
>
> ```ts
> // services/modules/V1/userService.ts
> export async function createUser(payload: UserPayload) {
>   return fetch('/api/v1/user-management/create', {
>     method: 'POST',
>     headers: { 'Content-Type': 'application/json' },
>     body: JSON.stringify(payload),
>   }).then(r => r.json())
> }
> // No componente:
> import { createUser } from '.../userService'
> const res = await createUser(payload)
> ```

Nunca use axios direto no formulário. Sempre crie/consuma um service dedicado.
