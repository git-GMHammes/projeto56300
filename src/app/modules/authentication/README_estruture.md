```
├── modules/ --------------------------------------------- Módulos funcionais específicos da aplicação
│   ├── authentication/ ---------------------------------- Módulo completo de autenticação de usuários
│   │   ├── components/ ---------------------------------- Componentes visuais específicos de autenticação
│   │   │   ├── ForgotPasswordForm/ ---------------------- Formulário para recuperação de senha
│   │   │   │   ├── ForgotPasswordForm.styles.ts (.ts) --- Estilos do formulário de recuperação
│   │   │   │   ├── ForgotPasswordForm.tsx (.tsx) -------- Componente React do formulário
│   │   │   │   ├── ForgotPasswordForm. types.ts (.ts) --- Tipagens TypeScript do componente
│   │   │   │   └── index.ts (.ts) ----------------------- Arquivo de exportação do componente
│   │   │   ├── LoginForm/ ------------------------------- Formulário de login/entrada
│   │   │   │   ├── index.ts (.ts) ----------------------- Arquivo de exportação do componente
│   │   │   │   ├── LoginForm.styles.ts (.ts) ------------ Estilos do formulário de login
│   │   │   │   ├── LoginForm.tsx (.tsx) ----------------- Componente React do formulário
│   │   │   │   └── LoginForm.types.ts (.ts) ------------- Tipagens TypeScript do componente
│   │   │   ├── RegisterForm/ ---------------------------- Formulário de cadastro/registro
│   │   │   │   ├── index.ts (.ts) ----------------------- Arquivo de exportação do componente
│   │   │   │   ├── RegisterForm.styles.ts (.ts) --------- Estilos do formulário de cadastro
│   │   │   │   ├── RegisterForm.tsx (.tsx) -------------- Componente React do formulário
│   │   │   │   └── RegisterForm.types.ts (.ts) ---------- Tipagens TypeScript do componente
│   │   │   └── index.ts (.ts) --------------------------- Arquivo de exportação dos componentes
│   │   ├── hooks/ --------------------------------------- Hooks customizados para autenticação
│   │   │   ├── index.ts (.ts) --------------------------- Arquivo de exportação dos hooks
│   │   │   ├── useAuth.ts (.ts) ------------------------- Hook principal de autenticação
│   │   │   ├── useLogin.ts (.ts) ------------------------ Hook específico para login
│   │   │   └── useRegister.ts (.ts) --------------------- Hook específico para registro
│   │   ├── screens/ ------------------------------------- Telas/páginas do módulo de autenticação
│   │   │   ├── ForgotPasswordScreen/ -------------------- Tela de recuperação de senha
│   │   │   │   ├── ForgotPasswordScreen.styles.ts (.ts) - Estilos da tela de recuperação
│   │   │   │   ├── ForgotPasswordScreen.tsx (.tsx) ------ Componente React da tela
│   │   │   │   └── index.ts (.ts) ----------------------- Arquivo de exportação da tela
│   │   │   ├── LoginScreen/ ----------------------------- Tela de login principal
│   │   │   │   ├── index.ts (.ts) ----------------------- Arquivo de exportação da tela
│   │   │   │   ├── LoginScreen.styles.ts (.ts) ---------- Estilos da tela de login
│   │   │   │   └── LoginScreen.tsx (.tsx) --------------- Componente React da tela
│   │   │   ├── RegisterScreen/ -------------------------- Tela de cadastro de usuários
│   │   │   │   ├── index.ts (.ts) ----------------------- Arquivo de exportação da tela
│   │   │   │   ├── RegisterScreen.styles.ts (.ts) ------- Estilos da tela de cadastro
│   │   │   │   └── RegisterScreen.tsx (.tsx) ------------ Componente React da tela
│   │   │   └── index.ts (.ts) --------------------------- Arquivo de exportação das telas
│   │   ├── services/ ------------------------------------ Serviços de comunicação com API
│   │   │   ├── authApi.ts (.ts) ------------------------- Chamadas de API para autenticação
│   │   │   ├── index.ts (.ts) --------------------------- Arquivo de exportação dos serviços
│   │   │   └── tokenService.ts (.ts) -------------------- Gerenciamento de tokens JWT
│   │   ├── store/ --------------------------------------- Gerenciamento de estado global
│   │   │   ├── authActions.ts (.ts) --------------------- Ações do Redux para autenticação
│   │   │   ├── authSelectors.ts (.ts) ------------------- Seletores para acessar estado
│   │   │   ├── authSlice.ts (.ts) ----------------------- Slice do Redux Toolkit
│   │   │   └── index.ts (.ts) --------------------------- Arquivo de exportação do store
│   │   ├── types/ --------------------------------------- Definições de tipos TypeScript
│   │   │   ├── auth.ts (.ts) ---------------------------- Tipos relacionados à autenticação
│   │   │   ├── index.ts (.ts) --------------------------- Arquivo de exportação dos tipos
│   │   │   └── user.ts (.ts) ---------------------------- Tipos relacionados ao usuário
│   │   ├── utils/ --------------------------------------- Utilitários específicos do módulo
│   │   │   ├── index.ts (.ts) --------------------------- Arquivo de exportação dos utilitários
│   │   │   ├── storage.ts (.ts) ------------------------- Funções de armazenamento local
│   │   │   └── validation.ts (.ts) ---------------------- Validações específicas de auth
│   │   └── index.ts (.ts) ------------------------------- Arquivo principal de exportação do módulo
```
