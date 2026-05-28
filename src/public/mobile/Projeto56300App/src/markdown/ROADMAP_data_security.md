# ROADMAP — Controle de Visibilidade por Rota e Perfil

> **Versão:** 1.0.0 &nbsp;|&nbsp; **Data:** 2026-05-16 &nbsp;|&nbsp; **Plano:** plan_2026_05_16_001  
> **Público-alvo:** Desenvolvedor júnior que precisa entender, aplicar ou estender o padrão de controle de visibilidade declarativo do app React Native.

---

> **Regra de Ouro**
>
> Se você está colocando `if/else` em um componente para decidir se um item de menu aparece ou não, **algo está errado**.  
> Toda a lógica de visibilidade fica no JSON — o componente apenas lê e filtra.

---

## Sumário

- [01 — Visão Geral](#01--visão-geral)
- [02 — Diagrama de Fluxo](#02--diagrama-de-fluxo)
- [03 — Tabela de Roles](#03--tabela-de-roles)
- [04 — Tabela de Rotas](#04--tabela-de-rotas)
- [05 — Inventário Completo (57 itens)](#05--inventário-completo-57-itens)
- [06 — Como Adicionar um Novo Item](#06--como-adicionar-um-novo-item)
- [07 — Exemplos Práticos](#07--exemplos-práticos)
- [08 — Erros Comuns](#08--erros-comuns)
- [09 — Glossário](#09--glossário)
- [Sobre o Autor](#sobre-o-autor)

---

## 01 — Visão Geral

Todo item de navegação do app (menus, abas, waffle) possui **duas chaves obrigatórias** que controlam, de forma declarativa, **SE** e **QUANDO** ele aparece na tela.

### As duas chaves

| Chave             | Tipo       | Pergunta que responde                               |
| ----------------- | ---------- | --------------------------------------------------- |
| `visibleOnRoutes` | `string[]` | Em quais **telas (rotas)** este item deve aparecer? |
| `allowedRoles`    | `string[]` | Quais **perfis de usuário** podem ver este item?    |

### Valores possíveis

```json
// visibleOnRoutes
"visibleOnRoutes": ["*"]                     // qualquer tela
"visibleOnRoutes": ["Messaging"]             // só na tela Messaging
"visibleOnRoutes": ["Home", "Dashboard"]     // em duas telas específicas

// allowedRoles
"allowedRoles": ["*"]                        // qualquer pessoa (inclusive visitante)
"allowedRoles": ["guest"]                    // só quem NAO está logado
"allowedRoles": ["admin", "manager", "user"] // só quem está logado
"allowedRoles": ["admin"]                    // só admin
```

---

### Por que declarativo?

Antes dessas chaves, cada componente de menu precisava de lógica própria para decidir o que exibir. Isso criava duplicação de código, inconsistência entre menus e dificuldade de manutenção.

#### ERRADO — lógica espalhada no componente

```tsx
// Dentro de UserMenuDrawer.tsx — NAO faça assim
const items = menuData.filter(item => {
  if (item.key === 'login' && isAuthenticated) return false;
  if (item.key === 'logout' && !isAuthenticated) return false;
  if (item.key === 'dm' && currentRoute !== 'Messaging') return false;
  if (item.key === 'groups' && userRole !== 'admin') return false;
  return true;
});
```

**Problema:** cada nova regra exige alterar o componente. Se existem 5 menus diferentes, a mesma lógica precisa ser replicada em 5 lugares.

#### CORRETO — lógica declarada no JSON, componente só filtra

```json
// No JSON (footer_message.json) — a regra vive aqui
{
  "key": "dm",
  "visibleOnRoutes": ["Messaging"],
  "allowedRoles": ["admin", "manager", "user"]
}
```

```tsx
// No componente — UMA única vez para todos os menus
const visibleItems = items.filter(
  item =>
    matchesRoute(item.visibleOnRoutes, currentRoute) &&
    matchesRole(item.allowedRoles, userRole),
);
```

**Vantagem:** para mudar quem vê o quê, basta editar o JSON. Nenhum componente precisa ser alterado.

---

## 02 — Diagrama de Fluxo

Para cada item do JSON, o componente executa este fluxo antes de renderizá-lo:

```
                    ITEM DO MENU (lido do JSON)
          ┌──────────────────────────────────────┐
          │  {                                   │
          │    "key": "dm",                      │
          │    "label": "Mensagens Privadas",    │
          │    "visibleOnRoutes": ["Messaging"], │
          │    "allowedRoles": ["admin","user"]  │
          │  }                                   │
          └─────────────────┬────────────────────┘
                            │
          ┌─────────────────▼────────────────────┐
          │  visibleOnRoutes contém ["*"]        │
          │  OU a rota atual está na lista?      │
          └────────┬──────────────────┬──────────┘
              SIM  │                  │  NAO
                   │                  └────────────► NAO RENDERIZA
          ┌────────▼─────────────────────────────┐
          │  allowedRoles contém ["*"]           │
          │  OU o role do usuário está na lista? │
          └────────┬──────────────────┬──────────┘
              SIM  │                  │  NAO
                   │                  └────────────► NAO RENDERIZA
          ┌────────▼─────────────────────────────┐
          │           RENDERIZA o item           │
          └──────────────────────────────────────┘
```

> **Atenção:** As duas verificações são **independentes** e **ambas precisam passar**.  
> Se qualquer uma falhar, o item não aparece — sem exceção.

---

## 03 — Tabela de Roles

O campo `allowedRoles` aceita qualquer combinação dos valores abaixo.

| Role        | Quem é                    | Inclui                                      | Quando usar                                   | Exemplos no app                                 |
| ----------- | ------------------------- | ------------------------------------------- | --------------------------------------------- | ----------------------------------------------- |
| `"*"`       | Curinga — qualquer pessoa | Visitantes + todos os usuários autenticados | Itens públicos, conteúdo educativo            | `home`, `ods_01`–`ods_18`, descrições dos ODS   |
| `"guest"`   | Visitante não autenticado | Apenas quem **não** fez login               | Itens que somem após o login                  | `login` (menu_user), `login` (menu_ods)         |
| `"user"`    | Usuário comum autenticado | Usuários com papel básico no tenant         | Funcionalidades padrão para todos os logados  | `perfil`, `logout`, `dm`, `groups`, `messaging` |
| `"manager"` | Gerente / Supervisor      | Papel intermediário no tenant               | Relatórios, aprovações, gestão de equipe      | _(a definir em novos módulos)_                  |
| `"admin"`   | Administrador do tenant   | Acesso completo dentro do tenant            | Configurações, gestão de usuários, dashboards | _(a definir em novos módulos)_                  |

> **Regra importante:** `["*"]` e `["guest"]` são mutuamente excludentes na prática.  
> `["*"]` **inclui** o guest. Mas `["admin", "manager", "user"]` **exclui** o guest — visitante não autenticado não possui nenhum desses roles.  
> Se um item deve aparecer para logados **e** visitantes, use `["*"]`.

---

## 04 — Tabela de Rotas

O campo `visibleOnRoutes` aceita os nomes de rota conforme registrados no navigator do app.

| Valor                   | Significado                            | Quando usar                                          | Exemplos no app                           |
| ----------------------- | -------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| `["*"]`                 | Visível em qualquer rota               | Menus globais, navegação principal                   | `home`, `perfil`, `logout`, todos os ODS  |
| `["Messaging"]`         | Visível apenas na tela de Mensagens    | Abas internas de uma feature específica              | `timeline`, `dm`, `groups`                |
| `["Home", "Dashboard"]` | Visível em múltiplas rotas específicas | Item relevante em mais de uma tela, mas não em todas | _(padrão para novos módulos contextuais)_ |

### Rotas existentes no app

```
Home · Login · Profile · OdsP01–OdsP18 · Messaging · OdsHome · Register · helper · logout
```

> **Atenção — Case Sensitive:** Os nomes de rota distinguem maiúsculas de minúsculas.  
> `"messaging"` **não é igual a** `"Messaging"`. Sempre copie o nome exato conforme declarado no navigator.

---

## 05 — Inventário Completo (57 itens)

Estado atual em **2026-05-16** de todos os itens configurados nos 5 arquivos JSON.

---

### `src/data/navigation/menu_user.json` — Menu do avatar/hamburguer (4 itens)

| key      | visibleOnRoutes | allowedRoles                 | Justificativa                               |
| -------- | --------------- | ---------------------------- | ------------------------------------------- |
| `login`  | `["*"]`         | `["guest"]`                  | Só aparece para quem **não** está logado    |
| `perfil` | `["*"]`         | `["admin","manager","user"]` | Visível apenas para usuários autenticados   |
| `home`   | `["*"]`         | `["*"]`                      | Atalho global, qualquer pessoa pode ver     |
| `logout` | `["*"]`         | `["admin","manager","user"]` | Só aparece se há sessão ativa para encerrar |

---

### `src/data/ods/menu_ods.json` — Navegação entre as ODS (21 itens)

| key         | visibleOnRoutes | allowedRoles                 | Justificativa                |
| ----------- | --------------- | ---------------------------- | ---------------------------- |
| `home`      | `["*"]`         | `["*"]`                      | Painel público               |
| `ods_01`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_02`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_03`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_04`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_05`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_06`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_07`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_08`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_09`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_10`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_11`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_12`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_13`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_14`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_15`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_16`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_17`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `ods_18`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público       |
| `login`     | `["*"]`         | `["guest"]`                  | Só para quem não está logado |
| `mensagens` | `["*"]`         | `["admin","manager","user"]` | Chat exige autenticação      |

---

### `src/data/ods/description.json` — Descrições dos ODS (18 itens)

> Todos os 18 itens têm `visibleOnRoutes: ["*"]` e `allowedRoles: ["*"]` — conteúdo educacional público, sem restrição de rota ou perfil.

| key       | visibleOnRoutes | allowedRoles |
| --------- | --------------- | ------------ |
| `pods001` | `["*"]`         | `["*"]`      |
| `pods002` | `["*"]`         | `["*"]`      |
| `pods003` | `["*"]`         | `["*"]`      |
| `pods004` | `["*"]`         | `["*"]`      |
| `pods005` | `["*"]`         | `["*"]`      |
| `pods006` | `["*"]`         | `["*"]`      |
| `pods007` | `["*"]`         | `["*"]`      |
| `pods008` | `["*"]`         | `["*"]`      |
| `pods009` | `["*"]`         | `["*"]`      |
| `pods010` | `["*"]`         | `["*"]`      |
| `pods011` | `["*"]`         | `["*"]`      |
| `pods012` | `["*"]`         | `["*"]`      |
| `pods013` | `["*"]`         | `["*"]`      |
| `pods014` | `["*"]`         | `["*"]`      |
| `pods015` | `["*"]`         | `["*"]`      |
| `pods016` | `["*"]`         | `["*"]`      |
| `pods017` | `["*"]`         | `["*"]`      |
| `pods018` | `["*"]`         | `["*"]`      |

---

### `src/data/messaging/footer_message.json` — Abas do footer de Mensagens (5 itens)

| key        | visibleOnRoutes | allowedRoles                 | Justificativa                                       |
| ---------- | --------------- | ---------------------------- | --------------------------------------------------- |
| `timeline` | `["Messaging"]` | `["*"]`                      | Mural público — mas só aparece na tela Messaging    |
| `helper`   | `["*"]`         | `["*"]`                      | Ajuda é global e pública                            |
| `home`     | `["*"]`         | `["*"]`                      | Atalho para Home, global e público                  |
| `dm`       | `["Messaging"]` | `["admin","manager","user"]` | Mensagens diretas: só logado e só na tela Messaging |
| `groups`   | `["Messaging"]` | `["admin","manager","user"]` | Grupos: só logado e só na tela Messaging            |

---

### `src/data/waffle/waffle_home_menu.json` — Waffle menu da Home (9 itens)

| key         | visibleOnRoutes | allowedRoles                 | Justificativa                      |
| ----------- | --------------- | ---------------------------- | ---------------------------------- |
| `logout`    | `["*"]`         | `["admin","manager","user"]` | Encerrar sessão exige sessão ativa |
| `messaging` | `["*"]`         | `["admin","manager","user"]` | Chat exige autenticação            |
| `ods_02`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |
| `ods_03`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |
| `helper`    | `["*"]`         | `["*"]`                      | Ajuda é pública                    |
| `ods_05`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |
| `ods_06`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |
| `ods_07`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |
| `ods_08`    | `["*"]`         | `["*"]`                      | Conteúdo ODS é público             |

---

## 06 — Como Adicionar um Novo Item

Siga exatamente esta sequência ao adicionar qualquer item novo a qualquer um dos 5 arquivos JSON.

---

### Passo 1 — Identifique o arquivo correto

Cada arquivo tem um propósito específico. Adicionar no arquivo errado causa comportamento inesperado.

| Pergunta                                           | Arquivo                 |
| -------------------------------------------------- | ----------------------- |
| É um item do menu do avatar/hamburguer do usuário? | `menu_user.json`        |
| É uma navegação entre as páginas ODS (1–18)?       | `menu_ods.json`         |
| É uma descrição longa de um ODS?                   | `description.json`      |
| É uma aba do footer da tela de Mensagens?          | `footer_message.json`   |
| É um atalho no waffle menu da Home?                | `waffle_home_menu.json` |

---

### Passo 2 — Monte o objeto com TODOS os campos obrigatórios

Campos faltando causam erros silenciosos no componente. Use o template correspondente ao arquivo.

**menu_user.json · footer_message.json · waffle_home_menu.json**

```json
{
  "key": "nome_unico",
  "icon": "nome-do-icone-bootstrap",
  "label": "Texto exibido na tela",
  "description": "Descricao curta do que o item faz",
  "route": "NomeDaRota",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["*"]
}
```

**menu_ods.json**

```json
{
  "key": "ods_XX",
  "label": "ODS X",
  "description": "Descricao do ODS",
  "route": "OdsPXX",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["*"]
}
```

**description.json**

```json
{
  "key": "podsXXX",
  "title": "Titulo do ODS",
  "description": "Texto longo de descricao...",
  "image": "qXX.png",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["*"]
}
```

---

### Passo 3 — Defina `visibleOnRoutes`

**Pergunta:** _Em quais telas este item faz sentido aparecer?_

| Se...                                                         | Use                  |
| ------------------------------------------------------------- | -------------------- |
| O item é de navegação global (pode aparecer em qualquer tela) | `["*"]`              |
| O item pertence a uma feature específica (ex: aba da tela X)  | `["NomeDaRota"]`     |
| O item é relevante em 2 ou 3 telas específicas                | `["Rota1", "Rota2"]` |

---

### Passo 4 — Defina `allowedRoles`

**Pergunta:** _Quem pode ver este item?_

| Se...                                                   | Use                            |
| ------------------------------------------------------- | ------------------------------ |
| Qualquer pessoa (logado ou não) pode ver                | `["*"]`                        |
| Apenas visitantes não autenticados devem ver            | `["guest"]`                    |
| Apenas usuários autenticados (qualquer nível) podem ver | `["admin", "manager", "user"]` |
| Apenas gerentes e admins podem ver                      | `["admin", "manager"]`         |
| Apenas admins podem ver                                 | `["admin"]`                    |

---

### Passo 5 — Valide o JSON antes de salvar

Um erro de vírgula ou aspas derruba todo o menu. Valide antes de commitar.

```bash
# Terminal — valida o arquivo e imprime OK se estiver correto
node -e "JSON.parse(require('fs').readFileSync('nome_do_arquivo.json','utf8'))" && echo OK
```

> O **VS Code** exibe o ícone de erro vermelho na barra inferior imediatamente quando o JSON fica inválido — não ignore esse sinal.

---

### Passo 6 — Teste no emulador

Pressione `R` no emulador (reload) após salvar o JSON. Verifique:

- O item **aparece** para o perfil e rota esperados
- O item **não aparece** para perfis e rotas não autorizados

---

## 07 — Exemplos Práticos

---

### Exemplo 1 — Item "Configurações" visível apenas para admins

**Arquivo:** `src/data/waffle/waffle_home_menu.json`

```json
// ANTES — o item não existe
```

```json
// DEPOIS — adicionar ao final do array (antes do colchete de fechamento ])
{
  "key": "settings",
  "icon": "gear",
  "label": "Configuracoes",
  "description": "Configuracoes do sistema e do tenant",
  "route": "Settings",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["admin"]
}
```

**Por que essa configuração?**  
`visibleOnRoutes: ["*"]` — configurações podem ser acessadas de qualquer tela.  
`allowedRoles: ["admin"]` — só admin pode configurar o sistema. Managers e users não verão este item.

**Teste mental:**  
Login como admin → vê o item | Login como user → não vê | Sem login → não vê

---

### Exemplo 2 — Item "Relatórios" visível só no Dashboard para managers e admins

**Arquivo:** `src/data/navigation/menu_user.json`

```json
// ANTES — o item não existe
```

```json
// DEPOIS — adicionar ao array
{
  "key": "reports",
  "icon": "bar-chart",
  "label": "Relatorios",
  "description": "Relatorios gerenciais e dashboards",
  "route": "Reports",
  "showWhen": "auth",
  "visibleOnRoutes": ["Dashboard"],
  "allowedRoles": ["admin", "manager"]
}
```

**Por que essa configuração?**  
`visibleOnRoutes: ["Dashboard"]` — relatórios só fazem sentido no contexto do Dashboard.  
`allowedRoles: ["admin", "manager"]` — usuário comum não acessa relatórios gerenciais.

**Teste mental:**  
Admin no Dashboard → vê | Admin na Home → **não vê** | Manager no Dashboard → vê | User em qualquer tela → não vê

---

### Exemplo 3 — Tornar "ODS 4" restrito a usuários autenticados

**Arquivo:** `src/data/ods/menu_ods.json`

```json
// ANTES
{
  "key": "ods_04",
  "label": "ODS 4",
  "description": "Educacao de qualidade",
  "route": "OdsP04",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["*"]
}
```

```json
// DEPOIS — apenas allowedRoles muda
{
  "key": "ods_04",
  "label": "ODS 4",
  "description": "Educacao de qualidade",
  "route": "OdsP04",
  "visibleOnRoutes": ["*"],
  "allowedRoles": ["admin", "manager", "user"]
}
```

**Por que essa configuração?**  
Mudança mínima: apenas `allowedRoles` foi alterado de `["*"]` para a lista de roles autenticados.  
Se o produto decide que certo conteúdo ODS requer login, **esta é a única linha que muda** — nenhum componente precisa ser tocado.

**Teste mental:**  
Visitante → não vê ODS 4 no menu | Após login como user → ODS 4 aparece

---

### Exemplo 4 — Nova aba "Notificações" no footer de mensagens

**Arquivo:** `src/data/messaging/footer_message.json`

```json
// ANTES — o item não existe
```

```json
// DEPOIS — adicionar ao array
{
  "key": "notifications",
  "icon": "bell",
  "label": "Notificacoes",
  "description": "Central de notificacoes do sistema",
  "route": "notifications",
  "visibleOnRoutes": ["Messaging"],
  "allowedRoles": ["admin", "manager", "user"]
}
```

**Por que essa configuração?**  
`visibleOnRoutes: ["Messaging"]` — é uma aba que só existe dentro da tela de Mensagens.  
`allowedRoles: ["admin", "manager", "user"]` — notificações pressupõem conta ativa.

**Teste mental:**  
Logado na tela Messaging → vê a aba | Logado na Home → **não vê** | Visitante em qualquer tela → não vê

---

## 08 — Erros Comuns

---

### Erro 1 — Item aparece para todo mundo mesmo com `allowedRoles` restrito

**Sintoma:** O item aparece para visitantes e perfis não autorizados.

```json
// ERRADO — string em vez de array (sem colchetes)
"allowedRoles": "admin"
```

```json
// CORRETO — sempre array, mesmo com um único valor
"allowedRoles": ["admin"]
```

**Por que acontece:** JSON aceita string sem reclamar. O componente de filtro, ao receber uma string em vez de um array, pode não conseguir fazer a verificação corretamente e deixa o item passar.

**Regra:** SEMPRE use colchetes `[ ]` em torno dos valores, mesmo que seja um único role ou uma única rota.

---

### Erro 2 — Item não aparece para ninguém, nem para admin

**Sintoma:** O item sumiu do menu independentemente do perfil.

```json
// ERRADO — maiúscula no role
"allowedRoles": ["Admin", "Manager"]
```

```json
// CORRETO — roles sempre em minúsculas
"allowedRoles": ["admin", "manager"]
```

**Por que acontece:** A comparação no componente é **case-sensitive**. O sistema retorna o role como `"admin"` (minúsculo). `"Admin"` não é igual a `"admin"` para o JavaScript.

**Regra:** Roles sempre em letras **minúsculas**: `guest`, `user`, `manager`, `admin`.

---

### Erro 3 — Item não aparece na tela esperada

**Sintoma:** O item existe no JSON mas não aparece na tela X.

```json
// ERRADO — minúscula no nome da rota
"visibleOnRoutes": ["messaging"]
```

```json
// CORRETO — nome exato conforme o navigator
"visibleOnRoutes": ["Messaging"]
```

**Por que acontece:** Nomes de rota também são **case-sensitive**. A rota foi registrada como `"Messaging"` (M maiúsculo) mas o JSON tem `"messaging"` (m minúsculo).

**Regra:** Copie o nome exato da rota conforme declarado no navigator. Em dúvida, consulte `src/core/navigation/` ou os arquivos de rotas do app.

---

### Erro 4 — O menu inteiro some ou o app crasha ao abrir a tela

**Sintoma:** Após editar o JSON, o menu desaparece completamente ou o app quebra.

```json
// ERRADO — vírgula depois do último item (trailing comma)
[
  { "key": "home", "allowedRoles": ["*"] },
  { "key": "logout", "allowedRoles": ["admin"] }
]
```

```json
// CORRETO — sem vírgula depois do último item
[
  { "key": "home", "allowedRoles": ["*"] },
  { "key": "logout", "allowedRoles": ["admin"] }
]
```

**Por que acontece:** JSON **não aceita** trailing comma (vírgula após o último elemento). O componente que importa o JSON quebra em runtime, derrubando o menu inteiro.

**Regra:** Sempre valide o JSON após editar. O VS Code mostra erro em vermelho imediatamente quando o JSON fica inválido.

---

### Erro 5 — Um item existente desapareceu após adicionar um novo

**Sintoma:** Após inserir um novo item, um item anterior sumiu.

```json
// ERRADO — vírgula faltando entre dois objetos
[
  { "key": "home" }
  { "key": "novo" }
]
```

```json
// CORRETO — vírgula entre objetos, sem vírgula no último
[{ "key": "home" }, { "key": "novo" }]
```

**Por que acontece:** Em JSON, objetos dentro de um array são separados por vírgula — mas o **último não tem vírgula depois**. É o erro mais comum ao editar arrays manualmente.

**Regra:** Vírgula **entre** itens, nunca **depois** do último. Use um formatter automático (Prettier) para garantir.

---

## 09 — Glossário

**RBAC** _(Role-Based Access Control)_  
Modelo de controle de acesso onde as permissões são atribuídas a roles (papéis), não diretamente a usuários. Um usuário recebe um role, e o role define o que ele pode ver/fazer. Neste projeto: `guest`, `user`, `manager`, `admin`.  
_No app:_ `allowedRoles: ["admin", "manager"]` implementa RBAC declarativo no JSON.

---

**Role** _(Papel / Perfil de usuário)_  
String que identifica o nível de acesso do usuário no sistema. Vem da sessão de autenticação após o login. Valores possíveis: `guest` (não logado), `user`, `manager`, `admin`.  
_No app:_ O campo `ut_role` na resposta de login define o role do usuário autenticado.

---

**Route** _(Rota de navegação)_  
Nome da tela ativa no momento. Cada tela do app tem um nome único de rota registrado no navigator. Exemplos: `"Home"`, `"Messaging"`, `"Profile"`.  
_No app:_ `visibleOnRoutes: ["Messaging"]` significa "este item só aparece quando a rota ativa é Messaging".

---

**Wildcard** _(Curinga)_  
O caractere `*` (asterisco) usado como valor especial que significa "qualquer coisa". No contexto deste projeto, `["*"]` em qualquer das duas chaves significa "sem restrição".  
_No app:_ `visibleOnRoutes: ["*"]` = aparece em qualquer rota. `allowedRoles: ["*"]` = qualquer perfil pode ver.

---

**Declarativo** _(Estilo declarativo de programação)_  
Abordagem onde você **descreve o que quer** (no JSON) em vez de escrever **o como fazer** (if/else no componente). O componente lê a configuração e a aplica automaticamente.  
_No app:_ Colocar `allowedRoles` no JSON é declarativo. Escrever `if (userRole === 'admin')` no componente é imperativo — evite.

---

**Guard** _(Guarda de acesso)_  
Verificação que impede a exibição ou navegação quando o usuário não tem permissão. As chaves `visibleOnRoutes` e `allowedRoles` implementam guards declarativos ao nível de componente de menu.  
_No app:_ O filtro do componente que verifica ambas as chaves antes de renderizar o item é o guard.

---

**Guest** _(Visitante não autenticado)_  
Usuário que ainda não realizou login. Não possui JWT nem refresh token. O role `"guest"` é atribuído implicitamente a esses usuários pelo sistema de controle de visibilidade.  
_No app:_ `allowedRoles: ["guest"]` faz o item aparecer **apenas** para quem não está logado — como o botão de Login.

---

**Trailing comma** _(Vírgula final)_  
Vírgula colocada após o último elemento de um array ou objeto JSON. É inválida em JSON (embora válida em JavaScript/TypeScript). Causa erro de parse ao carregar o arquivo.  
_No app:_ Erro mais comum ao editar os arquivos JSON manualmente. Sempre valide após editar.

---

**Case-sensitive** _(Sensível a maiúsculas e minúsculas)_  
Quando a comparação distingue letras maiúsculas de minúsculas. `"Admin"` não é igual a `"admin"` em comparação case-sensitive.  
_No app:_ Tanto os nomes de role quanto os nomes de rota são case-sensitive. Use sempre os valores exatos documentados.

---

## 10 — Operador de Negação ( ! )

O prefixo `!` transforma uma lista de inclusão em uma lista de exclusão. Em vez de declarar *quem pode ver*, você declara *quem não pode ver* — o item é exibido para todos os demais.

### Como funciona

```json
// Inclusão — somente os roles listados podem ver
"allowedRoles": ["admin", "manager"]

// Exclusão — todos podem ver, EXCETO os roles listados
"allowedRoles": ["!guest"]

// Inclusão de rota — só na tela Messaging
"visibleOnRoutes": ["Messaging"]

// Exclusão de rota — em qualquer tela EXCETO Messaging
"visibleOnRoutes": ["!Messaging"]
```

### Tabela de combinações

| Array | Modo | Resultado |
|---|---|---|
| `["*"]` | Wildcard | Qualquer valor passa |
| `["admin", "user"]` | Inclusão | Apenas admin e user passam |
| `["!admin"]` | Exclusão | Todos passam, exceto admin |
| `["!admin", "!manager"]` | Exclusão | Todos passam, exceto admin e manager |
| `["!Messaging"]` | Exclusão de rota | Aparece em qualquer rota, exceto Messaging |

### Regra absoluta — nunca misturar

```json
// CORRETO — puro inclusão
"allowedRoles": ["admin", "manager"]

// CORRETO — puro exclusão
"allowedRoles": ["!guest"]

// ERRADO — mistura inclusão e exclusão (comportamento indefinido)
"allowedRoles": ["admin", "!guest"]
```

> **Por que não misturar?** A lógica do `menuFilter.ts` detecta o modo pelo primeiro caractere de **todos** os itens do array. Array com mistura entra em modo inclusão e o `!guest` é tratado como um role literal (que nunca existirá), causando comportamento silencioso e incorreto.

### Casos de uso ideais para o operador !

| Objetivo | Sem negação | Com negação |
|---|---|---|
| Esconder Login após autenticar | `["admin","manager","user"]` | *(não se aplica — use `["guest"]`)* |
| Mostrar aviso só para não-admins | `["guest","user","manager"]` | `["!admin"]` |
| Ocultar banner em uma tela específica | `["Home","Profile","OdsP01",...]` | `["!Messaging"]` |
| Esconder item de manutenção para todos exceto admins | `["admin"]` | *(inclusão é mais claro aqui)* |

### Implementação — onde vive a lógica

```ts
// src/shared/utils/menuFilter.ts

export function matchesRole(allowedRoles: string[], userRole: string): boolean {
  if (allowedRoles.includes('*')) return true

  const isExclusionMode = allowedRoles.length > 0 && allowedRoles.every(r => r.startsWith('!'))

  if (isExclusionMode) {
    return !allowedRoles.includes(`!${userRole}`)
  }

  return allowedRoles.includes(userRole)
}
```

### Limitação conhecida — visibleOnRoutes no AppNavigator

O `MessageFooterBar` é renderizado no `AppNavigator`, que não rastreia a rota ativa. Por isso, o filtro `visibleOnRoutes` (incluindo negação) **não é aplicado** ao footer bar nesta versão. Apenas `allowedRoles` é filtrado.

Para habilitar filtragem por rota no footer, será necessário expor o estado de navegação ativo via contexto React ou hook dedicado — escopo de uma tarefa futura.

---

## Sobre o Autor

| Campo        | Valor                          |
| ------------ | ------------------------------ |
| **Nome**     | Gustavo Hammes                 |
| **Cargo**    | Analista de Sistemas           |
| **Empresa**  | Habilidade .Com                |
| **Site**     | habilidade.com                 |
| **LinkedIn** | linkedin.com/in/gustavo-hammes |

_Documento gerado em 2026-05-16, baseado na implementação real do plano `plan_2026_05_16_001`._  
_Para dúvidas ou atualizações, consulte os 5 arquivos JSON em `src/data/` e o plano de referência em `src/writable/claude/`._
