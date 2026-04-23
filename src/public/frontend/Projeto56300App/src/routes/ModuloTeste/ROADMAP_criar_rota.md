# ROADMAP — Como criar uma nova Rota e Página

> Padrão utilizado neste projeto: **HashRouter** (`#/caminho/aqui`)  
> Stack: React 19 + Vite + react-router-dom v7  
> Modelo de referência: **ModuloTeste / OlaMundo** (`#/modulo-teste/ola-mundo`)

---

## Visão Geral da Arquitetura de Rotas

```
src/
├── App.jsx                          ← Renderiza AppRoutes (ponto de entrada)
├── routes/
│   ├── AppRoutes.tsx                ← HashRouter central, agrega todos os módulos
│   ├── ModuloTeste/
│   │   ├── PublicRoutes.tsx         ← Array de rotas públicas do módulo
│   │   ├── PrivateRoutes.tsx        ← Array de rotas privadas do módulo (futuro)
│   │   ├── ModuloTeste.types.ts     ← Tipos TypeScript do módulo (futuro)
│   │   └── index.ts                 ← Re-exporta as rotas do módulo
│   └── NovoModulo/                  ← Cada novo módulo segue o mesmo padrão
│       ├── PublicRoutes.tsx
│       └── index.ts
└── pages/
    └── ModuloTeste/
        └── OlaMundo/
            └── index.jsx            ← Componente da página
```

**Fluxo:** `App.jsx` → `AppRoutes.tsx` → `ModuloTeste/index.ts` → `PublicRoutes.tsx` → `OlaMundo`

---

## Passo a Passo Completo

### PASSO 1 — Instalar react-router-dom (apenas na primeira vez)

```bash
cd src/public/frontend/react
npm install react-router-dom
```

Verificar se foi instalado:
```bash
npm list react-router-dom
```

---

### PASSO 2 — Criar o componente da Página

Crie a pasta e o arquivo `index.jsx` dentro de `src/pages/NomeModulo/NomePagina/`:

**Arquivo:** `src/pages/ModuloTeste/OlaMundo/index.jsx`

```jsx
function OlaMundo() {
  return (
    <div>
      <h1>Olá Mundo</h1>
    </div>
  )
}

export default OlaMundo
```

> **Convenção de nomes:**
> - Pasta do módulo: `PascalCase` → `ModuloTeste`
> - Pasta da página: `PascalCase` → `OlaMundo`
> - Arquivo do componente: `index.jsx`
> - Rota URL: `kebab-case` → `/modulo-teste/ola-mundo`

---

### PASSO 3 — Criar as Rotas Públicas do Módulo

**Arquivo:** `src/routes/ModuloTeste/PublicRoutes.tsx`

```tsx
import OlaMundo from '../../pages/ModuloTeste/OlaMundo'

const moduloTestePublicRoutes = [
  {
    path: '/modulo-teste/ola-mundo',
    element: <OlaMundo />,
  },
  // Adicione mais rotas públicas do módulo aqui:
  // {
  //   path: '/modulo-teste/outra-pagina',
  //   element: <OutraPagina />,
  // },
]

export default moduloTestePublicRoutes
```

> **Regra:** cada entrada do array representa uma rota.  
> `path` = caminho da URL sem o `#` (o HashRouter adiciona automaticamente).  
> `element` = componente React a ser renderizado.

---

### PASSO 4 — Exportar as Rotas pelo index do Módulo

**Arquivo:** `src/routes/ModuloTeste/index.ts`

```ts
export { default as moduloTestePublicRoutes } from './PublicRoutes'
// Futuramente, adicione também as rotas privadas:
// export { default as moduloTestePrivateRoutes } from './PrivateRoutes'
```

---

### PASSO 5 — Registrar o Módulo no AppRoutes Central

**Arquivo:** `src/routes/AppRoutes.tsx`

Importe e adicione o spread do novo módulo no array `publicRoutes`:

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import { moduloTestePublicRoutes } from './ModuloTeste'
// import { novoModuloPublicRoutes } from './NovoModulo'  ← adicione aqui

// Agrupa todas as rotas públicas de todos os módulos
const publicRoutes = [
  ...moduloTestePublicRoutes,
  // ...novoModuloPublicRoutes,  ← e aqui
]

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes
```

---

### PASSO 6 — Garantir que App.jsx usa o AppRoutes

**Arquivo:** `src/App.jsx`

```jsx
import AppRoutes from './routes/AppRoutes'

function App() {
  return <AppRoutes />
}

export default App
```

> Este arquivo não precisa ser modificado ao adicionar novos módulos.  
> Toda a lógica fica em `AppRoutes.tsx`.

---

### PASSO 7 — Testar

```bash
npm run dev
```

Acesse no navegador:
```
http://localhost:5173/#/modulo-teste/ola-mundo
```

---

## Resumo Visual do Fluxo

```
Navegador acessa:  http://localhost:5173/#/modulo-teste/ola-mundo
                                              │
                                        HashRouter lê o hash
                                              │
                                        AppRoutes.tsx
                                              │
                               publicRoutes.map(Route)
                                              │
                         path: '/modulo-teste/ola-mundo'
                                              │
                                   <OlaMundo /> renderizado
```

---

## Adicionando um Novo Módulo Completo

### Exemplo: Criar o módulo `Financeiro` com página `Resumo`

**1. Crie o componente da página**

`src/pages/Financeiro/Resumo/index.jsx`:
```jsx
function Resumo() {
  return (
    <div>
      <h1>Financeiro — Resumo</h1>
    </div>
  )
}

export default Resumo
```

**2. Crie as rotas públicas do módulo**

`src/routes/Financeiro/PublicRoutes.tsx`:
```tsx
import Resumo from '../../pages/Financeiro/Resumo'

const financeiroPublicRoutes = [
  {
    path: '/financeiro/resumo',
    element: <Resumo />,
  },
]

export default financeiroPublicRoutes
```

**3. Crie o index do módulo**

`src/routes/Financeiro/index.ts`:
```ts
export { default as financeiroPublicRoutes } from './PublicRoutes'
```

**4. Registre em AppRoutes.tsx**

```tsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import { moduloTestePublicRoutes } from './ModuloTeste'
import { financeiroPublicRoutes } from './Financeiro'   // ← adicionar

const publicRoutes = [
  ...moduloTestePublicRoutes,
  ...financeiroPublicRoutes,   // ← adicionar
]

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes
```

**Pronto.** Acesse: `#/financeiro/resumo`

---

## Convenções de Nomenclatura

| Contexto              | Padrão       | Exemplo                      |
|-----------------------|--------------|------------------------------|
| Pasta do módulo       | PascalCase   | `ModuloTeste`                |
| Pasta da página       | PascalCase   | `OlaMundo`                   |
| Componente JSX        | PascalCase   | `function OlaMundo()`        |
| Arquivo de componente | `index.jsx`  | `OlaMundo/index.jsx`         |
| Arquivo de rota       | `PublicRoutes.tsx` | por módulo             |
| Variável de rotas     | camelCase    | `moduloTestePublicRoutes`    |
| Caminho da URL        | kebab-case   | `/modulo-teste/ola-mundo`    |
| Hash final            | automático   | `#/modulo-teste/ola-mundo`   |

---

## Arquivos Modificados Nesta Implementação

| Arquivo | Ação |
|---|---|
| `package.json` | `react-router-dom` adicionado via npm install |
| `src/App.jsx` | Substituído para usar `<AppRoutes />` |
| `src/routes/AppRoutes.tsx` | HashRouter central criado |
| `src/routes/ModuloTeste/PublicRoutes.tsx` | Rotas públicas do módulo |
| `src/routes/ModuloTeste/index.ts` | Re-exportação das rotas |
| `src/pages/ModuloTeste/OlaMundo/index.jsx` | Página "Olá Mundo" criada |
