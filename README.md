# Habilidade — API Hub SaaS

# Resumo Técnico do Projeto SaaS

Este documento descreve as tecnologias utilizadas e a fundamentação do modelo SaaS (Software as a Service) aplicado ao desenvolvimento deste ecossistema.

---

## 1. Tecnologias Utilizadas

### Backend e Infraestrutura
* **CodeIgniter 4.x**: Framework PHP robusto e leve. Utilizado para a construção da API RESTful, garantindo performance e uma estrutura MVC clara para a lógica de negócio e persistência de dados.
* **MySQL**: Sistema de Gerenciamento de Banco de Dados Relacional (RDBMS). Responsável pelo armazenamento estruturado de dados, garantindo integridade referencial e suporte a consultas complexas.
* **Docker Compose**: Ferramenta para definição e execução de aplicações multi-contêiner. Facilita a orquestração do ambiente de desenvolvimento e produção, garantindo paridade entre os ambientes.
* **Podman**: Motor de contêineres sem daemon (daemonless) e rootless. Utilizado como alternativa segura e eficiente ao Docker para gerenciar imagens e contêineres, focando em segurança e conformidade com padrões OCI.

### Frontend e Mobile
* **React JS (Versão Atual)**: Biblioteca JavaScript para construção de interfaces de usuário dinâmicas na web. Focada em componentes reutilizáveis e no gerenciamento eficiente do estado da aplicação (Single Page Application).
* **React Native (Versão Atual)**: Framework para desenvolvimento de aplicativos móveis nativos (Android e iOS) utilizando a mesma base lógica do React, permitindo alta performance e acesso a APIs nativas do dispositivo.
* **Bootstrap (Versão Atual)**: Framework CSS para desenvolvimento de interfaces responsivas e "mobile-first". Fornece uma base sólida de componentes visuais para agilizar o design do frontend web.

---

## 2. O Modelo SaaS (Software as a Service)

### O que é?
O **SaaS** é um modelo de distribuição e licenciamento de software onde a aplicação é hospedada centralmente por um provedor e acessada pelos usuários via internet, geralmente através de um navegador web ou aplicativo móvel. 

Diferente do modelo tradicional, o cliente não precisa instalar, manter ou atualizar o software em seus próprios servidores; tudo é gerenciado pelo provedor do serviço.

### Distribuição para Empresas e Instituições
A distribuição em um contexto corporativo ou colaborativo ocorre das seguintes formas:

1.  **Multi-tenancy (Arquitetura Multilocatária)**: Uma única instância do software atende a vários clientes (empresas), mas os dados de cada cliente são isolados logicamente. Isso reduz custos de manutenção e escala a operação.
2.  **Modelos de Assinatura**: O acesso é concedido mediante pagamento recorrente (mensal/anual), permitindo que empresas ajustem o número de licenças conforme a necessidade.
3.  **Acesso Centralizado**: A distribuição é feita via nuvem (Cloud Computing). Empresas colaborativas podem acessar as mesmas ferramentas de qualquer local, facilitando o trabalho remoto e a sincronização de dados em tempo real.
4.  **Integração e API**: O serviço pode ser integrado a outros sistemas já existentes na instituição através de APIs (construídas com o CodeIgniter), permitindo um fluxo de trabalho unificado.

---

## 3. Estrutura de Execução

Para iniciar o ambiente de desenvolvimento utilizando os orquestradores de contêineres:

```bash
# Caso utilize Docker Compose
docker-compose up -d

# Caso utilize Podman Compose
podman-compose up -d

API REST multi-módulo construída em **CodeIgniter 4 / PHP 8.2**.

Arquitetura baseada em classes base abstratas (Template Method): cada módulo herda
toda a infraestrutura de leitura, escrita e exclusão das bases, implementando apenas
as regras específicas do domínio.

Multi-tenant nativo: toda tabela de domínio possui a FK `user_saas_tenants_id` para
isolamento de dados por empresa/plano.

---

## Resumo do banco de dados

| Módulo                   | Prefixo    | Tabelas | Views |
| ------------------------ | ---------- | ------- | ----- |
| Usuários e Autenticação  | `user_`    | 6       | 3     |
| Agenda / Calendário      | `alog_`    | 8       | 1     |
| Estoque                  | `est_`     | 19      | 4     |
| Mecânica / Oficina       | `mec_`     | 16      | —     |
| Mensagens / Comunicação  | `msg_`     | 8       | 7     |
| Gestão Documental (SGD)  | `sgd_`     | 28      | —     |
| Gestão de Tarefas        | `task_`    | 4       | —     |
| Clínica Veterinária      | `vet_`     | 8       | —     |
| Contato e Comunicação    | `contact_` | 2       | —     |
| **Total**                |            | **99**  | **15**|

---

## Módulos do sistema

O banco de dados é organizado por prefixo de tabela. Cada prefixo representa um domínio
de negócio independente, podendo ser ativado como um micro-serviço isolado dentro do hub.

---

### Usuários e Autenticação (`user_`)

Núcleo transversal do sistema. Todo acesso às APIs passa pela autenticação JWT gerada aqui.
Implementa multi-tenant completo: `user_004_saas_tenants` define as empresas e
`user_005_tenants` vincula usuários a tenants com papéis (roles).

#### Tabelas

| Tabela                      | Descrição                                                   |
| --------------------------- | ----------------------------------------------------------- |
| `user_001_management`       | Credenciais de acesso (login, senha bcrypt, UUID, is_active)|
| `user_002_customer`         | Dados cadastrais do cliente vinculado ao usuário            |
| `user_003_customer_files`   | Anexos e documentos do cliente (UUID, checksum SHA-256)     |
| `user_004_saas_tenants`     | Empresas/tenants SaaS (slug único, plano free/paid)         |
| `user_005_tenants`          | Vínculo usuário ↔ tenant com role (member / admin)          |
| `user_006_password_resets`  | Tokens de recuperação de senha (hash SHA-256, expiração, IP)|

#### Views

| View                            | Descrição                                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| `view_auth_user`                | JOIN management + customer + tenant (usada na autenticação JWT)    |
| `view_customer`                 | Dados consolidados do cliente (management + customer)              |
| `view_user_customer_management` | JOIN management + customer sem filtro de tenant                    |

---

### ALOG — Agenda / Calendário (`alog_`)

Gestão completa de agenda corporativa: eventos, categorias com cor/ícone, recursos
físicos reserváveis, recorrência iCal-like, participantes com RSVP e lembretes
multicanal (e-mail / push).

#### Tabelas

| Tabela                     | Descrição                                             |
| -------------------------- | ----------------------------------------------------- |
| `alog_001_users`           | Referência de usuários para a agenda (sem auth)       |
| `alog_002_categories`      | Categorias de eventos com cor hexadecimal e ícone     |
| `alog_003_resources`       | Recursos físicos reserváveis (salas, equipamentos)    |
| `alog_004_recurrences`     | Regras de recorrência iCal-like (diária/semanal/mensal/anual) |
| `alog_005_events`          | Eventos/compromissos com suporte a recorrência        |
| `alog_006_event_attendees` | Participantes de eventos com RSVP (pending/confirmed/declined) |
| `alog_007_event_resource`  | Recursos reservados por evento — N:N                  |
| `alog_008_reminders`       | Lembretes por usuário com controle de envio e minutos |

#### Views

| View                    | Descrição                                                        |
| ----------------------- | ---------------------------------------------------------------- |
| `view_alog_events_full` | Eventos completos com categoria, criador e dados de recorrência  |

---

### EST — Estoque (`est_`)

Gestão completa de estoque: produtos, fornecedores, movimentações, pedidos de compra,
ajustes, controle de lote/validade, reservas e inventário físico.

#### Tabelas

| Tabela                        | Descrição                                             |
| ----------------------------- | ----------------------------------------------------- |
| `est_001_warehouse`           | Armazéns / depósitos com endereço completo            |
| `est_002_category`            | Categorias de produto com hierarquia (parent_id)      |
| `est_003_supplier`            | Fornecedores (PF/PJ) com dados bancários e Pix        |
| `est_004_product`             | Cadastro de produtos (SKU, código de barras, unidade) |
| `est_005_storage_location`    | Localizações físicas dentro do armazém                |
| `est_006_product_stock`       | Saldo atual por produto/armazém (qtd + custo médio)   |
| `est_007_stock_movement`      | Histórico de movimentações (entrada/saída/transferência) |
| `est_008_transaction`         | Cabeçalho de transação de estoque                     |
| `est_009_transaction_item`    | Itens de cada transação                               |
| `est_010_purchase_order`      | Pedidos de compra                                     |
| `est_011_purchase_order_item` | Itens do pedido de compra                             |
| `est_012_stock_adjustment`    | Ajustes manuais de estoque                            |
| `est_013_price_history`       | Histórico de preços por produto                       |
| `est_014_minimum_stock`       | Estoque mínimo e ponto de reposição por produto/armazém |
| `est_015_product_supplier`    | Multi-fornecedor por produto (preços e prazos individuais) |
| `est_016_batch_lot`           | Controle de lotes e validade para produtos perecíveis |
| `est_017_stock_reservation`   | Reservas de estoque (reserva antes da saída física)   |
| `est_018_inventory_count`     | Sessão de inventário (cabeçalho)                      |
| `est_019_inventory_count_item`| Itens contados em uma sessão de inventário            |

#### Views

| View                           | Descrição                                                      |
| ------------------------------ | -------------------------------------------------------------- |
| `view_est_saldo_atual`         | Saldo por produto/armazém com valor financeiro calculado       |
| `view_est_abaixo_minimo`       | Produtos abaixo do estoque mínimo com nível de alerta          |
| `view_est_lotes_proximos_vencer` | Lotes com vencimento nos próximos 90 dias com nível de urgência |
| `view_est_movimentacoes_recentes` | Movimentações dos últimos 90 dias com origens/destinos      |

---

### MEC — Mecânica / Oficina (`mec_`)

Controle de ordens de serviço, peças, mão de obra, pagamentos e despesas para oficinas mecânicas.

#### Tabelas

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

### MSG — Mensagens / Comunicação (`msg_`)

Sistema completo de comunicação interna: mural corporativo (timeline) com reações,
mensagens privadas ponto-a-ponto com read receipts, grupos de chat com threads/reply,
controle de leitura por grupo e anexos multimídia polimórficos.

#### Tabelas

| Tabela                     | Descrição                                                       |
| -------------------------- | --------------------------------------------------------------- |
| `msg_001_timeline`         | Posts públicos do mural da empresa por tenant (fixáveis)        |
| `msg_002_timeline_reaction`| Reações a posts do mural (like/love/haha/wow/sad/angry)         |
| `msg_003_private`          | Mensagens diretas ponto a ponto com read receipt                |
| `msg_004_group`            | Grupos de chat privado com avatar e descrição                   |
| `msg_005_group_member`     | Membros e roles de grupo (admin/member) com data de entrada/saída|
| `msg_006_group_message`    | Mensagens de grupo com suporte a reply (auto-referência)        |
| `msg_007_group_read`       | Ponteiro da última mensagem lida por usuário por grupo          |
| `msg_008_file`             | Anexos multimídia polimórficos (timeline / private / group)     |

#### Views

| View                       | Descrição                                                       |
| -------------------------- | --------------------------------------------------------------- |
| `view_msg_timeline`        | Timeline com dados do autor (JOIN user_001_management)          |
| `view_msg_timeline_reaction` | Reações com dados do usuário que reagiu                       |
| `view_msg_private`         | Mensagens privadas com dados do remetente                       |
| `view_msg_group_member`    | Membros com perfil completo do usuário                          |
| `view_msg_group_message`   | Mensagens de grupo com autor e mensagem citada (reply)          |
| `view_msg_group_read`      | Ponteiro de leitura com dados do grupo                          |
| `view_msg_group_summary`   | Resumo do grupo: última mensagem e total de membros ativos      |
| `view_msg_file`            | Anexos com dados do uploader                                    |

---

### SGD — Sistema de Gestão Documental (`sgd_`)

Gestão completa do ciclo de vida de documentos: criação, aprovação, assinatura,
arquivamento e descarte.

#### Tabelas

| Tabela                        | Descrição                                       |
| ----------------------------- | ----------------------------------------------- |
| `sgd_001_document_categories` | Categorias de documento                         |
| `sgd_002_document_types`      | Tipos de documento por categoria                |
| `sgd_003_departments`         | Departamentos / setores                         |
| `sgd_004_entities`            | Entidades externas (clientes, parceiros)        |
| `sgd_005_workflows`           | Fluxos de aprovação configuráveis               |
| `sgd_006_templates`           | Templates de documentos                         |
| `sgd_007_numbering_sequences` | Sequências de numeração automática              |
| `sgd_008_retention_schedules` | Tabela de temporalidade (prazo de guarda)       |
| `sgd_009_tags`                | Tags livres para classificação                  |
| `sgd_010_documents`           | Documentos (cabeçalho principal)                |
| `sgd_011_files`               | Arquivos físicos vinculados ao documento        |
| `sgd_012_versions`            | Controle de versões de cada documento           |
| `sgd_013_signatures`          | Assinaturas digitais                            |
| `sgd_014_approvals`           | Aprovações por etapa de workflow                |
| `sgd_015_relationships`       | Vínculos entre documentos                       |
| `sgd_016_parties`             | Partes envolvidas em contratos/processos        |
| `sgd_017_protocols`           | Protocolos de entrega/recebimento               |
| `sgd_018_movements`           | Movimentação física de documentos               |
| `sgd_019_indexes`             | Índices de busca por metadados                  |
| `sgd_020_document_tags`       | Relacionamento documento ↔ tag                  |
| `sgd_021_disposals`           | Descarte e eliminação de documentos             |
| `sgd_022_access_logs`         | Log de acessos e visualizações                  |
| `sgd_023_permissions`         | Permissões de acesso por usuário/documento      |
| `sgd_024_notifications`       | Notificações de prazo, aprovação e vencimento   |
| `sgd_025_comments`            | Comentários e anotações nos documentos          |
| `sgd_026_contracts`           | Contratos (extensão do documento)               |
| `sgd_027_processes`           | Processos administrativos / jurídicos           |
| `sgd_028_invoices`            | Notas fiscais vinculadas a documentos           |

---

### TASK — Gestão de Tarefas e Projetos (`task_`)

Controle de projetos, colaboradores e tarefas com categorização.

#### Tabelas

| Tabela                      | Descrição                     |
| --------------------------- | ----------------------------- |
| `task_001_projects`         | Projetos                      |
| `task_002_collaborators`    | Colaboradores por projeto     |
| `task_003_task_categories`  | Categorias de tarefa          |
| `task_004_tasks_in_project` | Tarefas vinculadas a projetos |

---

### VET — Clínica Veterinária (`vet_`)

Agendamento, prontuários e gestão de consultas para clínicas veterinárias.

#### Tabelas

| Tabela                                | Descrição                              |
| ------------------------------------- | -------------------------------------- |
| `vet_001_breeds`                      | Raças de animais (espécie, porte, temperamento) |
| `vet_002_veterinarians`               | Veterinários                           |
| `vet_003_pets`                        | Animais cadastrados                    |
| `vet_004_veterinarian_schedules`      | Grade de horários do veterinário       |
| `vet_005_veterinarian_unavailability` | Bloqueios de agenda (folgas, férias)   |
| `vet_006_appointments`                | Consultas agendadas                    |
| `vet_007_medical_records`             | Prontuários médicos                    |
| `vet_008_medical_record_attachments`  | Exames e anexos do prontuário          |

---

### Contato e Comunicação (`contact_`)

| Tabela             | Descrição                                 |
| ------------------ | ----------------------------------------- |
| `contact_us`       | Formulários de contato recebidos          |
| `contact_us_files` | Anexos enviados via formulário de contato |

---

## Arquitetura

```
API V1
├── Autenticação JWT (AuthUser)
│   └── Token Bearer — obrigatório em todas as rotas protegidas
│
├── Multi-tenant
│   ├── user_004_saas_tenants  ← empresa/plano
│   └── user_005_tenants       ← vínculo usuário ↔ tenant (role)
│
├── Módulos de negócio (ALOG / EST / MEC / MSG / SGD / TASK / VET / ...)
│   ├── ResourceTableController  ← CRUD completo (14 endpoints)
│   └── ResourceViewController  ← Leitura via View SQL (8 endpoints)
│
└── Usuários (user_001_management + user_002_customer)
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
| Multi-tenant  | `user_saas_tenants_id` FK |
| Soft Delete   | `deleted_at` (CI4 nativo) |
| Cache / Queue | Redis / Laravel Queue     |
| Container     | Podman                    |

---

## Desenvolvedor

| Campo    | Informação                                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Nome     | Gustavo Hammes                                                                                                                                  |
| Cargo    | Analista de Sistemas                                                                                                                            |
| Empresa  | Habilidade .Com                                                                                                                                 |
| Site     | [habilidade.com](https://habilidade.com)                                                                                                        |
| LinkedIn | [linkedin.com/in/gustavo-hammes](https://www.linkedin.com/in/gustavo-hammes?utm_source=share_via&utm_content=profile&utm_medium=member_android) |
