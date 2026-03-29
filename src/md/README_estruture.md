```
projeto56300/
├── .git/ [ignorado] ---------------------------- Controle de versão Git
├── Doc/ [ignorado] ----------------------------- Documentação do projeto
└── src/ ---------------------------------------- CÓDIGO FONTE PRINCIPAL
    ├── .bundle/ [ignorado] --------------------- Cache de build do React Native
    ├── android/ [ignorado] --------------------- Código nativo Android
    ├── app/ ------------------------------------ **NÚCLEO DA APLICAÇÃO**
    │   ├── core/ ------------------------------- **FUNCIONALIDADES CENTRAIS**
    │   │   ├── api/ ---------------------------- **COMUNICAÇÃO COM SERVIDOR**
    │   │   │   ├── client.ts ------------------- Cliente HTTP (Axios/Fetch)
    │   │   │   ├── interceptors.ts ------------- Interceptadores de requisições/respostas
    │   │   │   └── types.ts -------------------- Tipos TypeScript para API
    │   │   ├── config/ ------------------------- **CONFIGURAÇÕES GLOBAIS**
    │   │   │   ├── constants.ts ---------------- Constantes da aplicação
    │   │   │   └── env.ts ---------------------- Variáveis de ambiente
    │   │   ├── hooks/ -------------------------- **HOOKS CUSTOMIZADOS PRINCIPAIS**
    │   │   │   ├── useApi.ts ------------------- Hook para chamadas de API
    │   │   │   ├── useAsyncStorage.ts----------- Hook para armazenamento local
    │   │   │   └── useNetworkState.ts----------- Hook para status da conexão
    │   │   ├── navigation/ --------------------- **NAVEGAÇÃO ENTRE TELAS**
    │   │   │   ├── AppNavigator.tsx ------------ Navegação principal da app
    │   │   │   ├── AuthNavigator.tsx ----------- Navegação de autenticação
    │   │   │   ├── linking.ts ------------------ Deep linking/URLs da app
    │   │   │   └── types.ts -------------------- Tipos para navegação
    │   │   ├── providers/ ---------------------- **PROVEDORES DE CONTEXTO**
    │   │   │   ├── ApiProvider.tsx ------------- Provedor de contexto da API
    │   │   │   ├── index.tsx ------------------- Exportações dos providers
    │   │   │   └── ThemeProvider.tsx ----------- Provedor de temas
    │   │   ├── store/ -------------------------- **GERENCIAMENTO DE ESTADO (Redux)**
    │   │   │   ├── index.ts -------------------- Configuração da store
    │   │   │   ├── middleware.ts --------------- Middlewares do Redux
    │   │   │   └── rootReducer.ts -------------- Reducer principal
    │   │   ├── styles/ ------------------------- **SISTEMA DE DESIGN**
    │   │   │   ├── colors.ts ------------------- Paleta de cores
    │   │   │   ├── index.ts -------------------- Exportações de estilos
    │   │   │   ├── spacing.ts ------------------ Espaçamentos padronizados
    │   │   │   ├── theme.ts -------------------- Tema principal
    │   │   │   └── typography.ts --------------- Tipografia/fontes
    │   │   ├── types/ -------------------------- **TIPOS TYPESCRIPT GLOBAIS**
    │   │   │   ├── api.ts ---------------------- Tipos para respostas da API
    │   │   │   ├── global.ts ------------------- Tipos globais da aplicação
    │   │   │   └── navigation.ts --------------- Tipos para navegação
    │   │   └── utils/ -------------------------- **UTILITÁRIOS PRINCIPAIS**
    │   │       ├── formatters.ts --------------- Formatação de dados
    │   │       ├── helpers.ts ------------------ Funções auxiliares
    │   │       ├── storage.ts ------------------ Gerenciamento de storage
    │   │       └── validation.ts --------------- Validações gerais
    │   ├── modules/ [ignorado] ----------------- **MÓDULOS/FEATURES ESPECÍFICOS**
    │   ├── shared/ ----------------------------- **COMPONENTES E UTILS COMPARTILHADOS**
    │   │   ├── components/ --------------------- **COMPONENTES REUTILIZÁVEIS**
    │   │   │   ├── forms/ ---------------------- **COMPONENTES DE FORMULÁRIO**
    │   │   │   │   ├── FormError/ -------------- Componente para exibir erros
    │   │   │   │   │   ├── FormError.styles.ts - Estilos do FormError
    │   │   │   │   │   ├── FormError.tsx ------- Componente FormError
    │   │   │   │   │   └── index.ts ------------ Exportação do componente
    │   │   │   │   ├── FormInput/ -------------- Input personalizado para forms
    │   │   │   │   │   ├── FormInput.styles.ts - Estilos do FormInput
    │   │   │   │   │   ├── FormInput.tsx ------- Componente FormInput
    │   │   │   │   │   └── index.ts ------------ Exportação do componente
    │   │   │   │   └── index.ts ---------------- Exportações de componentes de form
    │   │   │   ├── layout/ --------------------- **COMPONENTES DE LAYOUT**
    │   │   │   │   ├── Container/ -------------- Container principal das telas
    │   │   │   │   │   ├── Container.styles.ts - Estilos do Container
    │   │   │   │   │   ├── Container.tsx ------- Componente Container
    │   │   │   │   │   └── index.ts ------------ Exportação do componente
    │   │   │   │   ├── Header/ ----------------- Cabeçalho das telas
    │   │   │   │   │   ├── Header.styles.ts ---- Estilos do Header
    │   │   │   │   │   ├── Header.tsx ---------- Componente Header
    │   │   │   │   │   └── index.ts ------------ Exportação do componente
    │   │   │   │   └── index.ts ---------------- Exportações de layout
    │   │   │   ├── ui/ ------------------------- **COMPONENTES DE INTERFACE**
    │   │   │   │   ├── Button/ ----------------- Botão customizado
    │   │   │   │   │   ├── Button.styles.ts ---- Estilos do Button
    │   │   │   │   │   ├── Button.tsx ---------- Componente Button
    │   │   │   │   │   └── index.ts ------------ Exportação do componente
    │   │   │   │   ├── Input/ ------------------ Input customizado
    │   │   │   │   │   ├── index.ts ------------ Exportação do componente
    │   │   │   │   │   ├── Input.styles.ts ----- Estilos do Input
    │   │   │   │   │   └── Input.tsx ----------- Componente Input
    │   │   │   │   ├── Loading/ ---------------- Componente de loading
    │   │   │   │   │   ├── index.ts ------------ Exportação do componente
    │   │   │   │   │   ├── Loading.styles.ts --- Estilos do Loading
    │   │   │   │   │   └── Loading.tsx --------- Componente Loading
    │   │   │   │   ├── Modal/ ------------------ Modal customizado
    │   │   │   │   │   ├── index.ts ------------ Exportação do componente
    │   │   │   │   │   ├── Modal.styles.ts ----- Estilos do Modal
    │   │   │   │   │   └── Modal.tsx ----------- Componente Modal
    │   │   │   │   └── index.ts ---------------- Exportações de componentes UI
    │   │   │   └── index.ts -------------------- Exportações gerais de componentes
    │   │   ├── hooks/ -------------------------- **HOOKS COMPARTILHADOS**
    │   │   │   ├── index.ts -------------------- Exportações de hooks
    │   │   │   ├── useDebounce.ts -------------- Hook para debounce
    │   │   │   ├── useForm.ts ------------------ Hook para formulários
    │   │   │   └── useKeyboard.ts -------------- Hook para teclado
    │   │   └── utils/ -------------------------- **UTILITÁRIOS COMPARTILHADOS**
    │   │       ├── formatters/ ----------------- **FORMATADORES**
    │   │       │   ├── currency.ts ------------- Formatação de moeda
    │   │       │   ├── date.ts ----------------- Formatação de datas
    │   │       │   └── index.ts ---------------- Exportações de formatadores
    │   │       ├── validation/ ----------------- **VALIDAÇÕES**
    │   │       │   ├── index.ts ---------------- Exportações de validações
    │   │       │   ├── rules.ts ---------------- Regras de validação
    │   │       │   └── schemas.ts -------------- Schemas de validação
    │   │       └── index.ts -------------------- Exportações de utils
    │   └── README_estruture.md ----------------- Documentação da API de login
    ├── ios/ [ignorado] ------------------------- Código nativo iOS
    ├── node_modules/ [ignorado] ---------------- Dependências do projeto
    ├── __tests__/ [ignorado] ------------------- Testes automatizados
    ├── app.json -------------------------------- Configuração do Expo/React Native
    ├── App.tsx --------------------------------- **COMPONENTE RAIZ DA APLICAÇÃO**
    ├── index.js -------------------------------- **PONTO DE ENTRADA DA APLICAÇÃO**
    ├── package.json ---------------------------- Dependências e scripts do projeto
    └── tsconfig.json --------------------------- Configuração do TypeScript
```
