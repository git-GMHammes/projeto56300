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
│   ├── main/                           # Módulo principal (área logada)
│   │   ├── navigation/                 # Navegação interna do módulo (tabs, stacks)
│   │   └── screens/                    # Telas principais da aplicação
│   │       ├── AccountScreen/          # Tela de conta do usuário
│   │       ├── HomeScreen/             # Tela inicial/dashboard
│   │       ├── NotificationsScreen/    # Tela de notificações
│   │       ├── ProfileScreen/          # Tela de perfil (visualização)
│   │       └── SettingsScreen/         # Tela de configurações
│   │
│   └── userProfile/                    # Módulo de gerenciamento de perfil
│       ├── components/                 # Componentes de perfil
│       │   ├── AvatarUpload/           # Componente de upload de avatar
│       │   ├── ProfileForm/            # Formulário de edição de perfil
│       │   └── ProfileHeader/          # Cabeçalho do perfil
│       ├── hooks/                      # Hooks específicos do perfil
│       ├── screens/                    # Telas do módulo
│       │   ├── EditProfileScreen/      # Tela de edição de perfil
│       │   └── ProfileScreen/          # Tela de visualização de perfil
│       ├── services/                   # Serviços de API para perfil
│       ├── store/                      # Estado local do módulo
│       ├── types/                      # Tipos TypeScript do módulo
│       └── utils/                      # Utilitários de perfil
│