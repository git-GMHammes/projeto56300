src/app/
│
├── modules/                            # Módulos de funcionalidades (Feature Modules)
│   │
│   ├── authentication/                 # Módulo de autenticação de usuários
│   │   ├── components/                 # Componentes específicos de autenticação
│   │   │   ├── ForgotPasswordForm/     # Formulário de recuperação de senha
│   │   │   ├── LoginForm/              # Formulário de login
│   │   │   └── RegisterForm/           # Formulário de cadastro
│   │   ├── hooks/                      # Hooks específicos de autenticação
│   │   ├── screens/                    # Telas do módulo de autenticação
│   │   │   ├── ForgotPasswordScreen/   # Tela de esqueci minha senha
│   │   │   ├── LoginScreen/            # Tela de login
│   │   │   └── RegisterScreen/         # Tela de cadastro
│   │   ├── services/                   # Serviços de API para autenticação
│   │   ├── store/                      # Estado local do módulo (slices/actions)
│   │   ├── types/                      # Tipos TypeScript do módulo
│   │   └── utils/                      # Utilitários específicos de autenticação
│   │