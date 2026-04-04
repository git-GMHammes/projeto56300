# Vue Vite Pinia — Estrutura do Projeto

> **33 arquivos criados. Projeto 100% completo.**

## Estrutura de Pastas

```text
vue_vite_pinia/
├── .env.development / .env.production
├── index.html · package.json · vite.config.js
├── tailwind.config.js · postcss.config.js
├── dist/
│   └── .htaccess          ← Apache SPA + cache + gzip + segurança
└── src/
    ├── main.js · App.vue
    ├── assets/main.css    ← Tailwind + utilitários (.form-input, .badge-*)
    ├── api/
    │   └── axios-config.js   ← Interceptors Auth + erros normalizados
    ├── services/
    │   ├── tokenService.js   ← Sem dep. circular com o axios
    │   ├── apiFactory.js     ← 15 endpoints gerados automaticamente
    │   ├── userService.js    ← 1 linha para criar um novo service
    │   ├── paymentService.js ← Factory + métodos customizados (process, refund)
    │   └── externalService.js← ViaCEP, IBGE, câmbio
    ├── stores/
    │   ├── auth.js           ← JWT, permissões, roles
    │   ├── dashboardStore.js ← Promise.allSettled para N APIs em paralelo
    │   └── settings.js       ← Dark mode + sidebar, auto-persistido
    ├── router/index.js       ← Hash Mode + guards + lazy loading
    ├── composables/
    │   └── useApiWidget.js   ← Ciclo loading/fetch/error encapsulado
    ├── utils/formatters.js   ← currency, date, CPF, CNPJ, phone, initials...
    ├── components/
    │   ├── common/  BaseCard · SkeletonLoader · BaseButton
    │   ├── layout/  AppNavbar · AppSidebar · AppFooter
    │   └── widgets/ ApiWidget ← O coração do HUB
    └── views/
        ├── Login.vue        ← Form + toggle senha + animações
        ├── Dashboard.vue    ← KPIs + widgets independentes + atalhos
        └── ServiceHub.vue   ← Tabela dinâmica gerada pelo serviceMap
```

## Primeiros Passos

```bash
cd vue_vite_pinia
npm install
npm run dev        # http://localhost:3000
```

### Build para Produção

```bash
npm run build      # gera a pasta dist/ — copie para o Apache
```

## Como adicionar um novo módulo (3 passos)

1. Crie o service:
   - `src/services/productService.js` →
     ```js
     export const productService = createApiService("products");
     ```
2. Adicione entrada no `serviceMap` em `ServiceHub.vue`
3. Adicione item no menu em `AppSidebar.vue`

---

## Documentação Técnica

Guia completo do ecossistema **Vue 3 + Vite + Pinia**, organizado por nível de conhecimento (Básico ao Avançado).

### Índice de Navegação

| #   | Módulo                              | Resumo                                                                                    | Detalhes                                                                                                                                    |
| --- | ----------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Vite — Config JS**                | Centraliza plugins, alias, proxy de dev e estratégia de build em um único arquivo.        | [README_vite_config_js.md](C:\laragon\www\php\habilidade\projeto56300\src\public\frontend\vue_vite_pinia\markdown\README_vite_config_js.md) |
| 2   | **Vue — Componentes e Reatividade** | Define a estrutura de componentes, Composition API, composables e ciclo de vida reativos. | `em breve`                                                                                                                                  |
| 3   | **Pinia — Estado Global**           | Gerencia o estado compartilhado entre componentes de forma modular, tipada e persistível. | `em breve`                                                                                                                                  |

---

### 1. Vite Config JS

> O arquivo `vite.config.js` centraliza toda a configuração do ecossistema Vite: plugins, alias de caminhos, servidor de desenvolvimento com proxy e pipeline de build otimizado para produção.

[Acessar Detalhes da Configuração](C:\laragon\www\php\habilidade\projeto56300\src\public\frontend\vue_vite_pinia\markdown\README_vite_config_js.md)

---

### 2. Vue — Componentes e Reatividade

> Os componentes Vue utilizam a Composition API com `<script setup>`, composables reutilizáveis e reatividade granular via `ref`, `computed` e `watch` para interfaces dinâmicas e desacopladas.

`Documentação em breve`

---

### 3. Pinia — Estado Global

> O Pinia organiza o estado global em stores modulares com `defineStore`, suportando actions assíncronas, getters computados e persistência automática via plugin, sem a complexidade do Vuex.

`Documentação em breve`
