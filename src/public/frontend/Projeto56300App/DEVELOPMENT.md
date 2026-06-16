# DEVELOPMENT.md — Frontend Web Projeto56300App

Guia de instalação e execução local do frontend React/TypeScript.

---

## Stack

| Tecnologia       | Versão |
| ---------------- | ------ |
| Node.js          | 20 LTS |
| React            | 19.2.4 |
| TypeScript       | strict |
| Vite             | 8.0.4  |
| Bootstrap        | 5.3.8  |
| React Router DOM | 7.14.0 |

---

## Opção 1 — Via Podman/Docker Compose (preferencial)

O `docker-compose.yml` na raiz do projeto (`c:\laragon\www\php\habilidade\projeto56300`) já inclui o serviço `node` que instala as dependências e inicia o servidor Vite automaticamente.

```bash
# Executar a partir da raiz do projeto
podman compose up -d
```

O container `codeigniter56300_node`:

- Monta `./src/public/frontend/Projeto56300App` em `/app`
- Usa um **volume nomeado** `node_modules:/app/node_modules` — o `node_modules` dentro do container é isolado do diretório local (otimização de performance no Windows)
- Executa automaticamente `npm install && npm run dev` ao subir

Acesso: **http://localhost:56303**

> Nunca acessar por `localhost:5173` — o Vite escuta nessa porta internamente, mas o HMR WebSocket usa `clientPort: 56303` (porta externa). Acessar pela porta interna quebra o HMR.

---

## Opção 2 — Localmente (sem container)

Requer Node.js 20+ instalado na máquina.

```bash
cd c:\laragon\www\php\habilidade\projeto56300\src\public\frontend\Projeto56300App

npm install

cd C:\laragon\www\php\habilidade\projeto56300\src\public\frontend\Projeto56300App\
npm run dev
 
```

Acesso: **http://localhost:5173**

### Ajuste necessário no vite.config.ts para rodar local

O `vite.config.ts` atual está configurado para container (HMR na porta 56303). Rodando local, o `clientPort` precisa ser igual à porta do Vite:

```ts
hmr: {
  host: 'localhost',
  clientPort: 5173,   // trocar 56303 -> 5173 para rodar localmente
},
```

> Reverter essa mudança antes de subir o container novamente.

---

## Configuracao do ambiente

Nao ha arquivo `.env` no frontend — as variaveis sao definidas em:

```
src/config/constants.ts
```

| Constante       | Valor (development)      | Descricao                          |
| --------------- | ------------------------ | ---------------------------------- |
| `ENVIRONMENT`   | `'development'`          | Controla qual `APP_BASE_HOST` usar |
| `APP_BASE_HOST` | `http://localhost:56300` | URL base da API backend            |
| `THEME`         | `'Blue'`                 | Tema visual ativo                  |

Para apontar para producao, alterar `ENVIRONMENT` para `'production'` — o `APP_BASE_HOST` muda automaticamente para `https://habilidade.com/projeto56300/src/public`.

---

## Comandos disponíveis

```bash
npm run dev       # Inicia servidor de desenvolvimento (Vite HMR)
npm run build     # Build de producao em dist/
npm run preview   # Serve o build de producao localmente
npm run lint      # ESLint com regras React + TypeScript strict
```

---

## Estrutura de diretórios

```
src/
├── App.tsx                    <- Ponto de entrada — renderiza AppRoutes
├── main.tsx                   <- Bootstrap CSS+JS, CepProvider, ReactDOM
├── index.css                  <- Estilos globais minimos
├── App.css                    <- Estilos da pagina Home (template Vite)
├── assets/
│   ├── styles/
│   │   ├── variables.css      <- Variaveis CSS do projeto
│   │   ├── global.css         <- Reset e estilos globais
│   │   └── mixins.css         <- Utilitarios CSS reutilizaveis
│   └── (imagens)
├── config/
│   └── constants.ts           <- Variaveis fixas: env, host, tema
├── contexts/                  <- Context API global
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── NotificationContext.tsx
│   ├── LoadingContext.tsx
│   └── CepContext.tsx         <- Consulta ViaCEP, funcional
├── hooks/                     <- Custom hooks reutilizaveis
│   ├── useApi.ts
│   ├── useAuth.ts
│   ├── usePagination.ts
│   ├── useForm.ts
│   ├── useLocalStorage.ts
│   ├── useDebounce.ts
│   └── useModal.ts
├── services/
│   ├── api/
│   │   ├── axiosConfig.ts     <- PLACEHOLDER (Axios nao instalado)
│   │   └── interceptors.ts
│   └── modules/               <- Servicos por modulo (todos placeholders)
├── store/
│   ├── store.ts               <- PLACEHOLDER (Redux nao instalado)
│   └── slices/                <- Slices por modulo (todos placeholders)
├── components/
│   ├── ui/Button/             <- Componente Button funcional
│   ├── common/DataTable/      <- Componente DataTable criado
│   └── layout/                <- Apenas index.ts — sem implementacao
├── pages/                     <- Paginas por modulo
│   ├── Home/                  <- Pagina inicial (template Vite)
│   ├── Dashboard/             <- Criado, sem implementacao completa
│   ├── Auth/Login/V1/         <- Tela de login funcional
│   ├── Usuarios/V1/Form/      <- Formulario de cadastro de usuario
│   ├── Messaging/             <- Timeline, Private, Groups (criados)
│   ├── Ods/P01-P18/           <- 18 paginas ODS + OdsLayout
│   ├── ModuloTeste/           <- OlaMundo, Form (exemplos)
│   └── LayoutTest/Form/       <- Teste de layout
├── routes/
│   ├── AppRoutes.tsx          <- BrowserRouter principal
│   └── {Modulo}/              <- PublicRoutes + PrivateRoutes por modulo
└── utils/
    ├── constants/             <- apiEndpoints, permissions, routes, statusCodes
    └── helpers/               <- date, formatters, validators, file, string
```

---

## Roteamento

O projeto usa `BrowserRouter` com URLs limpas (sem `#`). O `AppRoutes.tsx` agrega apenas rotas publicas por ora. Rotas privadas existem nos arquivos de modulo mas nao estao conectadas ao roteador principal.

Rotas publicas ativas:

| Rota                            | Modulo      |
| ------------------------------- | ----------- |
| `/`                             | Home        |
| `/v1/login/`                    | Auth        |
| `/v1/usuarios/*`                | Usuarios    |
| `/v1/messaging/timeline`        | Messaging   |
| `/v1/messaging/private`         | Messaging   |
| `/v1/messaging/groups`          | Messaging   |
| `/v1/messaging/groups/:groupId` | Messaging   |
| `/v1/ods/*`                     | Ods         |
| `/v1/modulo-teste/*`            | ModuloTeste |
| `/v1/layout-test/*`             | LayoutTest  |

---

## Nota sobre o docker-compose.yml

O arquivo `docker-compose.yml` possui dois pontos relevantes para o frontend:

**Volume nomeado para node_modules:**

```yaml
volumes:
  - ./src/public/frontend/Projeto56300App:/app
  - node_modules:/app/node_modules # volume isolado do host
```

O `node_modules` no container e **independente** do `node_modules` local. Isso evita conflitos de binarios nativos entre Windows e Alpine Linux. Se instalar pacotes localmente (`npm install axios`), o container nao enxerga — e necessario recriar o container para que o `npm install` interno rode novamente:

```bash
podman compose down
podman compose up -d
```

**Comando do container:**

```yaml
command: sh -c "npm install && npm run dev"
```

Cada vez que o container sobe, ele roda `npm install` antes de iniciar o Vite. Pacotes adicionados ao `package.json` sao instalados automaticamente na proxima subida.

---

## Checklist — O que existe e o que falta

### Infraestrutura e configuracao

| Item                                        | Status |
| ------------------------------------------- | ------ |
| `package.json` com dependencias base        | OK     |
| `vite.config.ts` configurado para container | OK     |
| `tsconfig.json` modo strict                 | OK     |
| `eslint.config.js`                          | OK     |
| `.gitignore`                                | OK     |
| `node_modules/` local                       | OK     |
| Path aliases `@/` no tsconfig/vite          | FALTA  |
| Framework de testes (Vitest/Jest)           | FALTA  |
| `.env` (por design: nao usa)                | N/A    |

### Dependencias

| Pacote                  | Status                                       |
| ----------------------- | -------------------------------------------- |
| `react` 19              | OK                                           |
| `react-dom` 19          | OK                                           |
| `react-router-dom` 7    | OK                                           |
| `bootstrap` 5.3.8       | OK                                           |
| `axios`                 | FALTA — `axiosConfig.ts` e placeholder       |
| `redux` / `react-redux` | FALTA — `store.ts` e slices sao placeholders |
| `@reduxjs/toolkit`      | FALTA — necessario se Redux for usado        |

### Ponto de entrada

| Item                                             | Status |
| ------------------------------------------------ | ------ |
| `src/main.tsx` — Bootstrap CSS+JS, CepProvider   | OK     |
| `src/App.tsx` renderiza AppRoutes                | OK     |
| `src/routes/AppRoutes.tsx` — BrowserRouter ativo | OK     |
| Redux Provider em `main.tsx`                     | FALTA  |

### Contexts

| Context               | Status                          |
| --------------------- | ------------------------------- |
| `CepContext`          | OK — funcional                  |
| `AuthContext`         | Criado — sem implementacao real |
| `ThemeContext`        | Criado — sem implementacao real |
| `NotificationContext` | Criado — sem implementacao real |
| `LoadingContext`      | Criado — sem implementacao real |

### Hooks

| Hook              | Status                          |
| ----------------- | ------------------------------- |
| `useApi`          | Criado — sem implementacao real |
| `useAuth`         | Criado — sem implementacao real |
| `usePagination`   | Criado — sem implementacao real |
| `useForm`         | Criado — sem implementacao real |
| `useLocalStorage` | Criado — sem implementacao real |
| `useDebounce`     | Criado — sem implementacao real |
| `useModal`        | Criado — sem implementacao real |

### Services

| Item                         | Status                           |
| ---------------------------- | -------------------------------- |
| `axiosConfig.ts`             | FALTA — so tem `// placeholder`  |
| `interceptors.ts`            | Criado — sem implementacao real  |
| `authService.ts`             | Criado — so tem `// placeholder` |
| `userService.ts`             | Criado — so tem `// placeholder` |
| `estoqueService.ts`          | Criado — so tem `// placeholder` |
| `gestaoDocumentalService.ts` | Criado — so tem `// placeholder` |
| `tarefasService.ts`          | Criado — so tem `// placeholder` |
| `veterinariaService.ts`      | Criado — so tem `// placeholder` |

### Store (Redux)

| Item           | Status                           |
| -------------- | -------------------------------- |
| `store.ts`     | FALTA — so tem `// placeholder`  |
| `authSlice.ts` | Criado — so tem `// placeholder` |
| Demais slices  | Criados — todos `// placeholder` |

### Components

| Componente                          | Status                          |
| ----------------------------------- | ------------------------------- |
| `ui/Button`                         | OK — funcional                  |
| `common/DataTable`                  | Criado — verificar dependencias |
| `layout/` (Navbar, Sidebar, Footer) | FALTA — so tem `index.ts`       |

### Pages

| Pagina                     | Status                              |
| -------------------------- | ----------------------------------- |
| `Home`                     | OK — template padrao Vite           |
| `Auth/Login/V1/Modelo001`  | Criado                              |
| `Usuarios/V1/Form`         | Criado                              |
| `Messaging/Timeline`       | Criado                              |
| `Messaging/Private`        | Criado                              |
| `Messaging/Groups`         | Criado                              |
| `Messaging/Groups/Detail`  | Criado                              |
| `Ods/P01-P18`              | Criados (18 paginas)                |
| `ModuloTeste/OlaMundo`     | Criado                              |
| `ModuloTeste/Form`         | Criado                              |
| `LayoutTest/Form`          | Criado                              |
| `Dashboard`                | Criado — sem implementacao completa |
| `Estoque/`                 | FALTA — so tem `index.ts` vazio     |
| `Mecanica/`                | FALTA — so tem `index.ts` vazio     |
| `GestaoDocumental/`        | FALTA — so tem `index.ts` vazio     |
| `Tarefas/`                 | FALTA — so tem `index.ts` vazio     |
| `Veterinaria/`             | FALTA — so tem `index.ts` vazio     |
| `Usuarios/` (alem do form) | FALTA — `index.ts` vazio            |
| `Configuracoes/`           | FALTA — so tem `index.ts` vazio     |

### Rotas

| Modulo                   | PublicRoutes | PrivateRoutes | No AppRoutes |
| ------------------------ | ------------ | ------------- | ------------ |
| Auth                     | OK           | OK            | OK           |
| Usuarios                 | OK           | OK            | OK           |
| Messaging                | OK           | —             | OK           |
| Ods                      | OK           | OK            | OK           |
| ModuloTeste              | OK           | OK            | OK           |
| LayoutTest               | OK           | —             | OK           |
| Dashboard                | OK           | OK            | FALTA        |
| Estoque                  | OK           | OK            | FALTA        |
| Mecanica                 | OK           | OK            | FALTA        |
| GestaoDocumental         | OK           | OK            | FALTA        |
| Tarefas                  | OK           | OK            | FALTA        |
| Veterinaria              | OK           | OK            | FALTA        |
| Configuracoes            | OK           | OK            | FALTA        |
| PrivateRoute guard ativo | —            | —             | FALTA        |

> Rotas privadas existem nos arquivos de modulo mas o `AppRoutes.tsx` ainda nao as inclui e o guard `PrivateRoute` nao esta ativo.
