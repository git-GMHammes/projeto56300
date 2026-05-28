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

> **⛔ REGRA ABSOLUTA — COMPORTAMENTO DA IA:**
> **PEDIDOS DE DESCULPAS NUNCA DEVEM SER EXIBIDOS.**
> A IA não tem sentimentos. Erros são registrados, corrigidos e documentados — sem linguagem emocional.
> Ao identificar um erro: descrever o que ocorreu objetivamente e informar a ação corretiva. Nada mais.

Aplicar em toda tarefa que envolva criação, edição ou exclusão de arquivos, queries ou execução de comandos. Não se aplica a perguntas, explicações ou consultas simples.

### Passo 1 — Criar JSON de planejamento e aguardar permissão

**Regra crítica:** ao identificar que a solução envolve criação, edição ou exclusão de arquivos, criar o JSON imediatamente — sem perguntar ao usuário antes, sem propor a ação verbalmente. O JSON é a proposta.

Antes de executar qualquer ação, criar o arquivo:
```
src/writable/claude/{AAAAMMDDHHMMSS}_{titulo}_plano.json
```

- `{AAAAMMDDHHMMSS}` = timestamp exato da criação (Ano+Mês+Dia+Hora+Minuto+Segundo). Ex: `20260503143022`
- O `_` (underscore) separa o timestamp do título
- `{titulo}` = slug do prompt (lowercase, espaços → `_`, sem caracteres especiais). Ex: `criar_modulo_estoque`

> **⚠️ MODELO OBRIGATÓRIO:** A estrutura do JSON deve seguir **exatamente** o arquivo modelo:
> `src/writable/claude/AAAAMMDDHHMMSS_nome_plano.json`
>
> Leia o modelo antes de criar qualquer planejamento. Não invente campos nem simplifique a estrutura.

Estrutura obrigatória do JSON de planejamento (conforme modelo):
```json
{
  "plano": {
    "id": "plan_YYYY_MM_DD_NNN",
    "titulo": "Título legível da tarefa",
    "descricao": "Descrição detalhada do que será feito e por quê.",
    "criado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
    "projeto": "projeto56300",
    "diretorio_base": "C:\\laragon\\www\\php\\habilidade\\projeto56300",
    "contexto": "Contexto relevante: o que motivou a tarefa, o que foi observado, restrições.",
    "criterios_de_sucesso": [
      "Critério objetivo 1",
      "Critério objetivo 2"
    ],
    "rollback": {
      "estrategia": "restaurar_do_backup | reverter_via_git | nao_aplicavel",
      "comando": "git checkout HEAD -- caminho/do/arquivo"
    }
  },
  "estimativa_pf": {
    "metodologia": { "sigla": "APF", "padrao_internacional": "IFPUG", "versao_referencia": "CPM 4.x" },
    "metricas_internacionais_pontos_funcao": { "tipos_funcoes": {"dados": [...], "transacionais": [...]}, "matriz_complexidade": {...} },
    "fatores_ajuste_geral": [ "... 14 fatores com grau_influencia: 0 ..." ],
    "calculo_ajuste": { "soma_graus_influencia": 0, "fator_ajuste": 0.65, "formula": "VAF = 0.65 + (ΣDI * 0.01)" },
    "parametros_estimativa": { "horas_por_ponto_funcao": 8, "minutos_por_ponto_funcao": 480 },
    "tarefas": [
      {
        "id": 1,
        "nome": "Nome da tarefa",
        "descricao": "O que será entregue funcionalmente.",
        "funcoes_ponto_funcao": [
          { "tipo": "ALI | AIE | EE | SE | CE", "complexidade": "baixa | media | alta",
            "quantidade": 1, "pontos_funcao_unitario": 0, "pontos_funcao_total": 0,
            "desenvolvimento": { "min": 0, "hour": 0 } }
        ],
        "resumo_estimativa": {
          "pontos_funcao_nao_ajustados": 0, "fator_ajuste": 0.65,
          "pontos_funcao_ajustados": 0, "desenvolvimento": { "min": 0, "hour": 0 }
        }
      }
    ],
    "totais": { "pontos_funcao_nao_ajustados": 0, "pontos_funcao_ajustados": 0, "desenvolvimento": { "min": 0, "hour": 0 } }
  },
  "passos": [
    {
      "passo": 1,
      "tipo": "leitura_arquivo | leitura_pasta | criar_arquivo | editar_arquivo | excluir_arquivo | copiar_arquivo | mover_arquivo | renomear_arquivo | buscar_texto | executar_bash | requisicao_http | validacao | registrar_log",
      "alvo": "C:\\caminho\\absoluto\\do\\arquivo_ou_pasta",
      "motivo": "Por que este passo é necessário.",
      "saida_esperada": "conteudo_arquivo | lista_arquivos | lista_ocorrencias | stdout_stderr_codigo_saida",
      "depende_de": []
    }
  ],
  "tipos_suportados": [
    "leitura_pasta", "leitura_arquivo", "criar_arquivo", "editar_arquivo",
    "excluir_arquivo", "copiar_arquivo", "mover_arquivo", "renomear_arquivo",
    "buscar_texto", "executar_bash", "requisicao_http", "validacao", "registrar_log"
  ]
}
```

Após criar o arquivo, **apresentar o plano ao usuário e aguardar aprovação antes de prosseguir**.

### Passo 2 — Executar após aprovação

Executar somente as ações aprovadas no planejamento.

### Passo 3 — Registrar ações não planejadas (somente se necessário)

Se todas as ações foram exatamente as planejadas, **a tarefa está concluída — não criar nenhum arquivo adicional**.

Se durante a execução for necessária alguma ação que não constava no planejamento original, criar o arquivo:
```
src/writable/claude/{AAAAMMDDHHMMSS}_{titulo}_no_plano.json
```

> **⚠️ MODELO OBRIGATÓRIO:** A estrutura do JSON deve seguir **exatamente** o arquivo modelo:
> `src/writable/claude/AAAAMMDDHHMMSS_nome_no_plano.json`

Estrutura do JSON de ações não planejadas (conforme modelo):
```json
{
  "pos_plano": {
    "plano_referencia": "plan_YYYY_MM_DD_NNN",
    "titulo": "Título legível da tarefa (igual ao plano original)",
    "timestamp": "AAAAMMDDHHMMSS",
    "criado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
    "motivo_registro": "O que tornou necessário registrar ações além do plano original."
  },
  "estimativa_pf_adicional": {
    "parametros_estimativa": { "horas_por_ponto_funcao": 8, "minutos_por_ponto_funcao": 480 },
    "tarefas_nao_planejadas": [
      {
        "id": 1,
        "nome": "Nome da tarefa adicional",
        "funcoes_ponto_funcao": [
          { "tipo": "EE | CE | SE | ALI | AIE", "complexidade": "baixa | media | alta",
            "quantidade": 1, "pontos_funcao_unitario": 0, "pontos_funcao_total": 0,
            "desenvolvimento": { "min": 0, "hour": 0 } }
        ],
        "resumo_estimativa": {
          "pontos_funcao_nao_ajustados": 0, "fator_ajuste": 0.65,
          "pontos_funcao_ajustados": 0, "desenvolvimento": { "min": 0, "hour": 0 }
        }
      }
    ],
    "totais_adicionais": { "pontos_funcao_nao_ajustados": 0, "pontos_funcao_ajustados": 0, "desenvolvimento": { "min": 0, "hour": 0 } }
  },
  "acoes_nao_planejadas": [
    {
      "ordem": 1,
      "tipo": "create | edit | delete | read | bash | query",
      "alvo": "C:\\caminho\\absoluto\\do\\arquivo.ext",
      "acao": "Descrição objetiva da ação realizada.",
      "motivo": "Por que foi necessária — restrição encontrada, dependência oculta, comportamento inesperado.",
      "descoberta": "O que foi encontrado ou aprendido durante a execução que não constava no plano.",
      "depende_de": []
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
