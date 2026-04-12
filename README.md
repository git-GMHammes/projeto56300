# Habilidade — API Hub SaaS

API REST multi-módulo construída em **CodeIgniter 4 / PHP 8.2**.

Arquitetura baseada em classes base abstratas (Template Method): cada módulo herda
toda a infraestrutura de leitura, escrita e exclusão das bases, implementando apenas
as regras específicas do domínio.

---

## Módulos do sistema

O banco de dados é organizado por prefixo de tabela. Cada prefixo representa um domínio
de negócio independente, podendo ser ativado como um micro-serviço isolado dentro do hub.

---

### Usuários e Autenticação

Núcleo transversal do sistema. Todo acesso às APIs passa pela autenticação JWT gerada aqui.

| Tabela                  | Descrição                                              |
| ----------------------- | ------------------------------------------------------ |
| `user_management`       | Credenciais de acesso (login, senha bcrypt, perfil)    |
| `user_customer`         | Dados cadastrais do cliente vinculado ao usuário       |
| `user_customer_files`   | Anexos e documentos do cliente                         |
| `user_password_resets`  | Tokens de recuperação de senha                         |
| `users`                 | Tabela auxiliar legado / integração                    |
| `password_reset_tokens` | Tokens de reset (framework)                            |
| `view_auth_user`        | View de autenticação (JOIN user_management + customer) |
| `view_customer`         | View consolidada de dados do cliente                   |

---

### EST — Estoque

Gestão completa de estoque: produtos, fornecedores, movimentações, compras e ajustes.

| Tabela                        | Descrição                                  |
| ----------------------------- | ------------------------------------------ |
| `est_001_warehouse`           | Armazéns / depósitos                       |
| `est_002_category`            | Categorias de produto                      |
| `est_003_supplier`            | Fornecedores                               |
| `est_004_product`             | Cadastro de produtos                       |
| `est_005_storage_location`    | Localizações físicas dentro do armazém     |
| `est_006_product_stock`       | Saldo atual por produto/armazém            |
| `est_007_stock_movement`      | Histórico de movimentações (entrada/saída) |
| `est_008_transaction`         | Cabeçalho de transação de estoque          |
| `est_009_transaction_item`    | Itens de cada transação                    |
| `est_010_purchase_order`      | Pedidos de compra                          |
| `est_011_purchase_order_item` | Itens do pedido de compra                  |
| `est_012_stock_adjustment`    | Ajustes manuais de estoque                 |
| `est_013_price_history`       | Histórico de preços por produto            |
| `est_014_minimum_stock`       | Estoque mínimo por produto/armazém         |

---

### MEC — Mecânica / Oficina

Controle de ordens de serviço, peças, mão de obra, pagamentos e despesas para oficinas mecânicas.

| Tabela                        | Descrição                               |
| ----------------------------- | --------------------------------------- |
| `mec_01_vehicle_brand`        | Marcas de veículos                      |
| `mec_02_vehicle_model`        | Modelos de veículos por marca           |
| `mec_03_vehicle`              | Veículos cadastrados (cliente + modelo) |
| `mec_04_service_category`     | Categorias de serviço                   |
| `mec_05_service`              | Serviços disponíveis (tabela de preços) |
| `mec_06_labor`                | Mão de obra / técnicos                  |
| `mec_07_part`                 | Peças disponíveis                       |
| `mec_08_part_supplier`        | Fornecedores de peças                   |
| `mec_09_payment_method`       | Formas de pagamento                     |
| `mec_10_service_order`        | Ordem de serviço (cabeçalho)            |
| `mec_11_service_order_item`   | Serviços executados na OS               |
| `mec_12_service_order_part`   | Peças utilizadas na OS                  |
| `mec_13_service_order_status` | Histórico de status da OS               |
| `mec_14_payment`              | Pagamentos recebidos por OS             |
| `mec_15_expense`              | Despesas operacionais da oficina        |
| `mec_16_system_config`        | Configurações gerais do módulo          |

---

### SGD — Sistema de Gestão Documental

Gestão completa do ciclo de vida de documentos: criação, aprovação, assinatura, arquivamento e descarte.

| Tabela                        | Descrição                                     |
| ----------------------------- | --------------------------------------------- |
| `sgd_001_document_categories` | Categorias de documento                       |
| `sgd_002_document_types`      | Tipos de documento por categoria              |
| `sgd_003_departments`         | Departamentos / setores                       |
| `sgd_004_entities`            | Entidades externas (clientes, parceiros)      |
| `sgd_005_workflows`           | Fluxos de aprovação configuráveis             |
| `sgd_006_templates`           | Templates de documentos                       |
| `sgd_007_numbering_sequences` | Sequências de numeração automática            |
| `sgd_008_retention_schedules` | Tabela de temporalidade (prazo de guarda)     |
| `sgd_009_tags`                | Tags livres para classificação                |
| `sgd_010_documents`           | Documentos (cabeçalho principal)              |
| `sgd_011_files`               | Arquivos físicos vinculados ao documento      |
| `sgd_012_versions`            | Controle de versões de cada documento         |
| `sgd_013_signatures`          | Assinaturas digitais                          |
| `sgd_014_approvals`           | Aprovações por etapa de workflow              |
| `sgd_015_relationships`       | Vínculos entre documentos                     |
| `sgd_016_parties`             | Partes envolvidas em contratos/processos      |
| `sgd_017_protocols`           | Protocolos de entrega/recebimento             |
| `sgd_018_movements`           | Movimentação física de documentos             |
| `sgd_019_indexes`             | Índices de busca por metadados                |
| `sgd_020_document_tags`       | Relacionamento documento ↔ tag                |
| `sgd_021_disposals`           | Descarte e eliminação de documentos           |
| `sgd_022_access_logs`         | Log de acessos e visualizações                |
| `sgd_023_permissions`         | Permissões de acesso por usuário/documento    |
| `sgd_024_notifications`       | Notificações de prazo, aprovação e vencimento |
| `sgd_025_comments`            | Comentários e anotações nos documentos        |
| `sgd_026_contracts`           | Contratos (extensão do documento)             |
| `sgd_027_processes`           | Processos administrativos / jurídicos         |
| `sgd_028_invoices`            | Notas fiscais vinculadas a documentos         |

---

### TASK — Gestão de Tarefas e Projetos

Controle de projetos, colaboradores e tarefas com categorização.

| Tabela                      | Descrição                     |
| --------------------------- | ----------------------------- |
| `task_001_projects`         | Projetos                      |
| `task_002_collaborators`    | Colaboradores por projeto     |
| `task_003_task_categories`  | Categorias de tarefa          |
| `task_004_tasks_in_project` | Tarefas vinculadas a projetos |

---

### VET — Clínica Veterinária

Agendamento, prontuários e gestão de consultas para clínicas veterinárias.

| Tabela                                | Descrição                            |
| ------------------------------------- | ------------------------------------ |
| `vet_001_breeds`                      | Raças de animais                     |
| `vet_002_veterinarians`               | Veterinários                         |
| `vet_003_pets`                        | Animais cadastrados                  |
| `vet_004_veterinarian_schedules`      | Grade de horários do veterinário     |
| `vet_005_veterinarian_unavailability` | Bloqueios de agenda (folgas, férias) |
| `vet_006_appointments`                | Consultas agendadas                  |
| `vet_007_medical_records`             | Prontuários médicos                  |
| `vet_008_medical_record_attachments`  | Exames e anexos do prontuário        |

---

### Contato e Comunicação

| Tabela             | Descrição                                 |
| ------------------ | ----------------------------------------- |
| `contact_us`       | Formulários de contato recebidos          |
| `contact_us_files` | Anexos enviados via formulário de contato |

---

### Infraestrutura (framework)

Tabelas internas do CodeIgniter / Laravel Queue. Não expostas via API.

| Tabela        | Descrição                 |
| ------------- | ------------------------- |
| `cache`       | Cache de aplicação        |
| `cache_locks` | Locks do sistema de cache |
| `jobs`        | Fila de jobs assíncronos  |
| `job_batches` | Batches de jobs           |
| `failed_jobs` | Jobs com falha            |
| `sessions`    | Sessões de usuário        |
| `migrations`  | Histórico de migrations   |
| `logs`        | Logs de aplicação         |

---

## Arquitetura

```
API V1
├── Autenticação JWT (AuthUser)
│   └── Token Bearer — obrigatório em todas as rotas protegidas
│
├── Módulos de negócio (EST / MEC / SGD / TASK / VET / ...)
│   ├── ResourceTableController  ← CRUD completo (14 endpoints)
│   └── ResourceViewController  ← Leitura via View SQL (8 endpoints)
│
└── Usuários (UserManagement + UserCustomer)
    └── Base do sistema — FK referenciada por todos os módulos
```

### Hierarquia das classes base

```
BaseTableModel          ← SqlTableModel de cada módulo
BaseViewModel           ← SqlViewModel de cada módulo

BaseViewService         ← Processor (módulos só-leitura)
  └── BaseTableService  ← Processor (módulos com tabela)

BaseResourceTableController  ← ResourceTableController de cada módulo
  └── BaseResourceViewController ← ResourceViewController de cada módulo
```

> Para criar um novo módulo, consulte:
> [`src/app/markdown/ROADMAP_novo_modulo.md`](src/app/markdown/ROADMAP_novo_modulo.md)

---

## Stack

| Componente    | Tecnologia                |
| ------------- | ------------------------- |
| Framework     | CodeIgniter 4             |
| Linguagem     | PHP 8.2                   |
| Banco         | MySQL                     |
| Autenticação  | JWT (Bearer Token)        |
| Soft Delete   | `deleted_at` (CI4 nativo) |
| Cache / Queue | Redis / Laravel Queue     |
| Container     | Podman                    |
