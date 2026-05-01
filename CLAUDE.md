# CLAUDE.md — Projeto56300

Instruções globais do projeto. Carregado automaticamente em toda conversa.

---

## Stack de Tecnologias

| Camada         | Tecnologia                       |
| -------------- | -------------------------------- |
| Infraestrutura | Podman (compatível com Docker)   |
| Backend        | CodeIgniter 4 / PHP 8.2          |
| Banco de Dados | MySQL 8.0                        |
| Frontend Web   | React / TypeScript, Bootstrap    |
| Mobile         | React Native, Bootstrap          |
| Servidor HTTP  | Nginx (Alpine)                   |
| Node.js Dev    | Node 20 Alpine (Vite dev server) |

---

## Infraestrutura — Podman / Docker Compose

| Serviço   | Container                  | Porta Externa | Porta Interna | Observação                   |
| --------- | -------------------------- | ------------- | ------------- | ---------------------------- |
| `mysql`   | `codeigniter56300_mysql`   | `56301`       | `3306`        | MySQL 8.0, healthcheck ativo |
| `adminer` | `codeigniter56300_adminer` | `56302`       | `8080`        | Interface web para o banco   |
| `php`     | `codeigniter56300_php`     | —             | `9000`        | PHP-FPM, volume `./src`      |
| `nginx`   | `codeigniter56300_nginx`   | `56300`       | `80`          | Serve o backend PHP          |
| `node`    | `codeigniter56300_node`    | `56303`       | `5173`        | Vite dev server do frontend  |

- Rede: `codeigniter56300_network` (bridge)
- Usar `podman` ou `podman-compose`; `docker-compose.yml` é compatível com ambos
- Root do backend: `./src` → `/var/www/html`

---

## Multi-Tenancy SaaS

Toda tabela de módulo **deve ter** `user_saas_tenants_id` (FK para `user_004_saas_tenants.id`) — isolador de dados por empresa/tenant.

| Tabela                     | Papel                                                 |
| -------------------------- | ----------------------------------------------------- |
| `user_001_management`      | Usuários do sistema (login, uuid, senha hash)         |
| `user_002_customer`        | Perfil estendido do usuário (CPF, WhatsApp, endereço) |
| `user_003_customer_files`  | Arquivos vinculados ao perfil do cliente              |
| `user_004_saas_tenants`    | Empresas/tenants do SaaS (name, slug, plan, active)   |
| `user_005_tenants`         | Relacionamento user ↔ tenant com papel (role)         |
| `user_006_password_resets` | Tokens de reset de senha (SHA-256, com expiração)     |

---

## Módulos do Sistema

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

> Novo módulo: prefixo único de 3-4 letras + numeração sequencial (`prefixo_NNN_nome`).

---

## Requisito Prévio — Obrigatório Antes de Qualquer Módulo/Feature

**1. Listar tabelas do banco:**

```
podman exec -i codeigniter56300_mysql mysql -ucodeigniter56300_user -p'codeigniter56300_P@ssw0rd_2024' -e "SHOW FULL TABLES IN codeigniter56300_api_db;"
```

**2. Analisar colunas da tabela envolvida:**

```sql
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

---

## Regras Absolutas

1. **Sempre herdar das BASES V1** — nunca reimplementar lógica de `BaseTableModel`, `BaseViewModel`, `BaseViewService`, `BaseTableService`, `BaseResourceTableController` ou `BaseResourceViewController`
2. **Seguir o prefixo de módulo** — ao criar novas tabelas ou classes, manter o prefixo correto
3. **Incluir `user_saas_tenants_id`** em toda nova tabela de módulo (FK para `user_004_saas_tenants.id`)
4. **V1 é imutável** — não alterar assinaturas públicas das BASES sem criar uma V2
5. **Rotas descentralizadas** — cada módulo gerencia suas próprias rotas
6. **Soft delete sempre** — nunca `DELETE` físico; usar `deleted_at`
7. **Separação total Frontend/Backend** — backend só APIs REST; frontend nunca contém lógica de banco
8. **Máscaras no serviço** — CPF, telefone e CEP armazenados sem máscara; formatação é do frontend
9. **Nomenclatura em inglês** para código; comentários e docs podem ser em português
10. **Infraestrutura Podman** — preferir `podman` ou `podman-compose`

---

## Fluxo de Trabalho Obrigatório — Planejamento e Registro

Aplicar em toda tarefa que envolva criação, edição ou exclusão de arquivos, queries ou execução de comandos. Não se aplica a perguntas, explicações ou consultas simples.

### Passo 1 — Criar JSON de planejamento e aguardar permissão

Antes de executar qualquer ação, criar o arquivo:
```
src/writable/claude/{titulo}_{codigo}_planejamento.json
```

- `{titulo}` = slug do prompt (lowercase, espaços → `_`, sem caracteres especiais). Ex: `criar_modulo_estoque`
- `{codigo}` = sequencial de 3 dígitos (`001`, `002`, ...) — verificar arquivos existentes na pasta para determinar o próximo número

Estrutura do JSON de planejamento:
```json
{
  "titulo": "Título legível da tarefa",
  "codigo": "001",
  "prompt_resumo": "Resumo do que foi solicitado",
  "data": "YYYY-MM-DD",
  "acoes_planejadas": [
    {
      "ordem": 1,
      "tipo": "create | edit | delete | read | bash | query",
      "acao": "Descrição da ação",
      "arquivo": "caminho/do/arquivo (se aplicável)"
    }
  ]
}
```

Após criar o arquivo, **apresentar o plano ao usuário e aguardar aprovação antes de prosseguir**.

### Passo 2 — Executar após aprovação

Executar somente as ações aprovadas no planejamento.

### Passo 3 — Criar JSON de ações não planejadas

Ao final da tarefa, criar o arquivo:
```
src/writable/claude/{titulo}_{codigo}_nao_planejado.json
```

Registrar toda ação que foi necessária mas não constava no planejamento original. Se nenhuma ação adicional foi necessária, criar o arquivo com `"acoes_nao_planejadas": []`.

Estrutura do JSON de não planejadas:
```json
{
  "titulo": "Título legível da tarefa",
  "codigo": "001",
  "data": "YYYY-MM-DD",
  "acoes_nao_planejadas": [
    {
      "ordem": 1,
      "tipo": "create | edit | delete | read | bash | query",
      "acao": "Descrição da ação não planejada",
      "motivo": "Por que foi necessária",
      "arquivo": "caminho/do/arquivo (se aplicável)"
    }
  ]
}
```

---

## Detalhes por Área

O Claude Code carrega automaticamente o `CLAUDE.md` do subdiretório ao trabalhar em cada área:

- **Backend (Controllers, Models, Services):** `src/app/CLAUDE.md`
- **Frontend Web:** `src/public/frontend/Projeto56300App/CLAUDE.md`
- **Mobile React Native:** `src/public/mobile/Projeto56300App/CLAUDE.md`
