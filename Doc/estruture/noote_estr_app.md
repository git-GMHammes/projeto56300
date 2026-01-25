src/app/
│
├── core/                               # Núcleo da aplicação - configurações e funcionalidades centrais
│   ├── api/                            # Configuração de cliente HTTP e endpoints da API
│   ├── config/                         # Configurações gerais da aplicação (constantes, ambiente)
│   ├── hooks/                          # Hooks globais reutilizáveis em toda aplicação
│   ├── navigation/                     # Configuração principal de navegação (rotas raiz)
│   ├── providers/                      # Context Providers globais (Theme, Auth, etc.)
│   ├── store/                          # Configuração do estado global (Redux/Zustand)
│   ├── styles/                         # Estilos globais, tema e design tokens
│   ├── types/                          # Tipos TypeScript globais e interfaces base
│   └── utils/                          # Utilitários globais da aplicação
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
└── shared/                             # Recursos compartilhados entre módulos
    ├── components/                     # Componentes reutilizáveis
    │   ├── forms/                      # Componentes de formulário
    │   │   ├── FormError/              # Componente de exibição de erros
    │   │   └── FormInput/              # Campo de entrada de formulário
    │   ├── layout/                     # Componentes de layout
    │   │   ├── Container/              # Container/wrapper de telas
    │   │   └── Header/                 # Cabeçalho padrão
    │   └── ui/                         # Componentes de interface
    │       ├── Button/                 # Botão customizado
    │       ├── Input/                  # Campo de entrada base
    │       ├── Loading/                # Indicador de carregamento
    │       └── Modal/                  # Modal/popup
    ├── hooks/                          # Hooks compartilhados
    └── utils/                          # Utilitários compartilhados
        ├── formatters/                 # Funções de formatação (datas, moeda, etc.)
        └── validation/                 # Funções e schemas de validação

Documentação Técnica - Estrutura Completa da Aplicação
Diretório Raiz: src/app/
O diretório src/app/ é a raiz da aplicação React Native e está organizado em três grandes domínios: core/ para configurações centrais, modules/ para funcionalidades de negócio e shared/ para recursos compartilhados.

1. CORE (core/)
O diretório core/ representa o núcleo da aplicação, contendo todas as configurações e funcionalidades centrais que sustentam a infraestrutura do projeto.

1.1 API (core/api/)
O diretório api/ contém toda a configuração do cliente HTTP utilizado para comunicação com o backend. Aqui são definidos os endpoints da API, interceptors para tratamento de requisições e respostas, configuração de headers padrão, timeout, retry policies e instâncias do Axios ou Fetch configuradas. Este diretório centraliza toda a lógica de comunicação externa da aplicação.

1.2 Config (core/config/)
O diretório config/ armazena as configurações gerais da aplicação. Inclui constantes globais, variáveis de ambiente (development, staging, production), configurações de feature flags, URLs base, chaves de API e qualquer configuração que varie entre ambientes. Este diretório garante que todas as configurações estejam centralizadas e facilmente modificáveis.

1.3 Hooks (core/hooks/)
O diretório hooks/ contém hooks globais reutilizáveis em toda a aplicação. São hooks genéricos que não pertencem a nenhum módulo específico, como useDebounce, useThrottle, useNetworkStatus, useAppState, useKeyboard e outros hooks utilitários que podem ser consumidos por qualquer parte da aplicação.

1.4 Navigation (core/navigation/)
O diretório navigation/ contém a configuração principal de navegação da aplicação. Aqui são definidas as rotas raiz, o NavigationContainer, os navegadores principais (Stack, Tab, Drawer), linking configuration para deep links, e a lógica de navegação condicional baseada no estado de autenticação. Este é o ponto de entrada da estrutura de navegação.

1.5 Providers (core/providers/)
O diretório providers/ agrupa todos os Context Providers globais da aplicação. Inclui ThemeProvider para gerenciamento de temas (claro/escuro), AuthProvider para estado de autenticação, LocalizationProvider para internacionalização, e qualquer outro provider que precise envolver toda a aplicação. A composição destes providers geralmente ocorre no App.tsx.

1.6 Store (core/store/)
O diretório store/ contém a configuração do estado global da aplicação. Dependendo da biblioteca escolhida (Redux Toolkit, Zustand, Jotai), aqui ficam a configuração da store, middlewares, persistência de estado, combinação de reducers/slices e exportação dos hooks tipados (useAppDispatch, useAppSelector). Este diretório é o coração do gerenciamento de estado.

1.7 Styles (core/styles/)
O diretório styles/ armazena os estilos globais, tema e design tokens da aplicação. Inclui definição de cores, tipografia, espaçamentos, breakpoints, sombras e todos os tokens de design que garantem consistência visual. Também pode conter funções utilitárias para criação de estilos responsivos e o tema completo da aplicação.

1.8 Types (core/types/)
O diretório types/ contém tipos TypeScript globais e interfaces base utilizadas em toda a aplicação. Inclui tipos genéricos, interfaces de resposta de API, tipos de navegação, declarações de módulos externos e qualquer definição de tipo que seja compartilhada entre múltiplos módulos. Este diretório garante tipagem consistente em todo o projeto.

1.9 Utils (core/utils/)
O diretório utils/ agrupa utilitários globais da aplicação. São funções auxiliares genéricas que não se encaixam em nenhuma categoria específica, como helpers para manipulação de dados, funções de log, utilitários de storage, helpers para permissões e outras funções de propósito geral utilizadas em toda a aplicação.

2. MODULES (modules/)
O diretório modules/ contém os módulos de funcionalidades da aplicação, também conhecidos como Feature Modules. Cada módulo encapsula uma área de negócio completa com seus próprios componentes, telas, serviços e estado.

2.1 Módulo Authentication (modules/authentication/)
O módulo authentication/ é responsável por todo o fluxo de autenticação de usuários, incluindo login, cadastro e recuperação de senha.

2.1.1 Components (authentication/components/)
O diretório components/ contém componentes específicos de autenticação que são utilizados exclusivamente dentro deste módulo.

O componente ForgotPasswordForm/ implementa o formulário de recuperação de senha. Contém campos para entrada de email, validação, botão de envio e feedback visual do processo de recuperação. Este componente gerencia seu próprio estado de formulário e comunica-se com os serviços de autenticação.

O componente LoginForm/ implementa o formulário de login da aplicação. Inclui campos para email e senha, opção de "lembrar-me", link para recuperação de senha, validação de campos e integração com o serviço de autenticação. Gerencia estados de loading e exibição de erros.

O componente RegisterForm/ implementa o formulário de cadastro de novos usuários. Contém campos para nome, email, senha, confirmação de senha e aceite de termos. Inclui validação completa de todos os campos e integração com o serviço de registro.

2.1.2 Hooks (authentication/hooks/)
O diretório hooks/ contém hooks específicos de autenticação. Podem incluir useAuth para acesso ao contexto de autenticação, useLogin para lógica de login, useRegister para lógica de cadastro, useLogout para desconexão e outros hooks que encapsulam lógicas recorrentes do módulo.

2.1.3 Screens (authentication/screens/)
O diretório screens/ contém as telas do módulo de autenticação.

A tela ForgotPasswordScreen/ é a tela de recuperação de senha. Compõe o layout com o ForgotPasswordForm, exibe instruções ao usuário, trata estados de sucesso e erro, e permite navegação de volta ao login.

A tela LoginScreen/ é a tela principal de login. Compõe o layout com o LoginForm, pode incluir opções de login social, link para cadastro e branding da aplicação. Gerencia a navegação após login bem-sucedido.

A tela RegisterScreen/ é a tela de cadastro de novos usuários. Compõe o layout com o RegisterForm, pode incluir opções de cadastro social, link para login existente e exibição de termos de uso.

2.1.4 Services (authentication/services/)
O diretório services/ contém os serviços de API para autenticação. Inclui funções para login, registro, logout, recuperação de senha, refresh de tokens, verificação de email e qualquer outra chamada de API relacionada à autenticação. Estes serviços utilizam o cliente HTTP configurado no core.

2.1.5 Store (authentication/store/)
O diretório store/ contém o estado local do módulo de autenticação. Inclui slices/actions para gerenciamento do estado de autenticação, como dados do usuário logado, tokens de acesso, estado de loading e erros. Pode utilizar Redux Toolkit, Zustand ou outra solução de estado.

2.1.6 Types (authentication/types/)
O diretório types/ contém tipos TypeScript específicos do módulo de autenticação. Inclui interfaces para User, Credentials, AuthState, respostas de API de autenticação e qualquer outro tipo específico deste domínio.

2.1.7 Utils (authentication/utils/)
O diretório utils/ contém utilitários específicos de autenticação. Pode incluir funções para validação de senha forte, formatação de dados de usuário, helpers para tokens JWT, funções de criptografia e outras utilidades específicas do domínio de autenticação.

2.2 Módulo Main (modules/main/)
O módulo main/ representa a área principal da aplicação após o usuário estar autenticado. Contém as telas e navegação do fluxo logado.

2.2.1 Navigation (main/navigation/)
O diretório navigation/ contém a navegação interna do módulo main. Inclui configuração de Tab Navigator para navegação principal, Stack Navigators para fluxos específicos, definição de rotas internas e opções de navegação como headers e transições.

2.2.2 Screens (main/screens/)
O diretório screens/ contém as telas principais da aplicação logada.

A tela AccountScreen/ é a tela de conta do usuário. Exibe informações da conta, opções de gerenciamento como alteração de senha, exclusão de conta, histórico de atividades e outras funcionalidades relacionadas à conta do usuário.

A tela HomeScreen/ é a tela inicial/dashboard da aplicação. É a primeira tela exibida após o login, podendo conter resumos, atalhos para funcionalidades principais, notificações recentes e conteúdo personalizado para o usuário.

A tela NotificationsScreen/ é a tela de notificações do usuário. Lista todas as notificações recebidas, permite marcar como lidas, filtrar por tipo e navegar para conteúdos relacionados às notificações.

A tela ProfileScreen/ é a tela de visualização de perfil. Exibe as informações do perfil do usuário de forma somente leitura, com opção de navegar para edição. Pode exibir avatar, nome, bio e outras informações públicas.

A tela SettingsScreen/ é a tela de configurações da aplicação. Permite ao usuário configurar preferências como tema (claro/escuro), notificações, privacidade, idioma e outras opções de personalização da experiência.

2.3 Módulo UserProfile (modules/userProfile/)
O módulo userProfile/ é responsável pelo gerenciamento completo do perfil do usuário, incluindo visualização e edição de informações pessoais.

2.3.1 Components (userProfile/components/)
O diretório components/ contém componentes específicos para gerenciamento de perfil.

O componente AvatarUpload/ implementa a funcionalidade de upload de avatar. Inclui seleção de imagem da galeria ou câmera, crop/resize da imagem, preview antes do upload, indicador de progresso e tratamento de erros no upload.

O componente ProfileForm/ implementa o formulário de edição de perfil. Contém campos para todas as informações editáveis do perfil como nome, bio, data de nascimento, telefone e outras informações pessoais com validação apropriada.

O componente ProfileHeader/ implementa o cabeçalho do perfil. Exibe o avatar do usuário, nome, informações principais e pode incluir ações rápidas como editar perfil ou compartilhar.

2.3.2 Hooks (userProfile/hooks/)
O diretório hooks/ contém hooks específicos do módulo de perfil. Podem incluir useProfile para acesso aos dados do perfil, useUpdateProfile para lógica de atualização, useAvatar para gerenciamento de avatar e outros hooks que encapsulam lógicas do módulo.

2.3.3 Screens (userProfile/screens/)
O diretório screens/ contém as telas do módulo de perfil.

A tela EditProfileScreen/ é a tela de edição de perfil. Compõe o layout com ProfileForm e AvatarUpload, gerencia o estado de edição, validação, salvamento e feedback ao usuário sobre sucesso ou erro nas alterações.

A tela ProfileScreen/ é a tela de visualização de perfil dentro do módulo userProfile. Pode ser uma versão mais detalhada do perfil com todas as informações e opções de edição.

2.3.4 Services (userProfile/services/)
O diretório services/ contém os serviços de API para perfil. Inclui funções para buscar perfil, atualizar perfil, upload de avatar, deletar avatar e qualquer outra chamada de API relacionada ao gerenciamento de perfil do usuário.

2.3.5 Store (userProfile/store/)
O diretório store/ contém o estado local do módulo de perfil. Gerencia os dados do perfil em cache, estado de loading das operações, erros e sincronização com o backend.

2.3.6 Types (userProfile/types/)
O diretório types/ contém tipos TypeScript específicos do módulo de perfil. Inclui interfaces para Profile, ProfileUpdatePayload, AvatarUploadResponse e outros tipos do domínio de perfil.

2.3.7 Utils (userProfile/utils/)
O diretório utils/ contém utilitários específicos de perfil. Pode incluir funções para validação de campos de perfil, formatação de dados para exibição, helpers para manipulação de imagem e outras utilidades do domínio.

3. SHARED (shared/)
O diretório shared/ contém recursos compartilhados entre todos os módulos da aplicação. Esta camada fornece componentes reutilizáveis, hooks e utilitários que podem ser consumidos por qualquer módulo sem criar dependências circulares.

3.1 Components (shared/components/)
O diretório components/ agrupa todos os componentes reutilizáveis da aplicação, organizados em subcategorias por tipo.

3.1.1 Forms (shared/components/forms/)
O diretório forms/ contém componentes específicos para construção de formulários.

O componente FormError/ é responsável pela exibição padronizada de mensagens de erro em formulários. Recebe uma mensagem de erro e a exibe de forma consistente com estilo apropriado (cor vermelha, ícone de alerta). Garante que todos os erros de formulário tenham a mesma aparência em toda a aplicação.

O componente FormInput/ fornece um campo de entrada de formulário completo. Integra o componente Input base com label, mensagem de erro, estados de validação e estilos específicos para uso em formulários. Pode incluir integração com bibliotecas de formulário como React Hook Form.

3.1.2 Layout (shared/components/layout/)
O diretório layout/ agrupa componentes estruturais para organização das telas.

O componente Container/ funciona como wrapper padrão para telas. Aplica padding horizontal consistente, SafeAreaView para dispositivos com notch, cor de fundo do tema e outras configurações de layout que devem ser consistentes em todas as telas da aplicação.

O componente Header/ fornece o cabeçalho padrão da aplicação. Inclui título, botão de voltar, ações customizáveis no lado direito, suporte a diferentes estilos (transparente, colorido) e integração com a navegação para ação de voltar.

3.1.3 UI (shared/components/ui/)
O diretório ui/ contém componentes de interface genéricos que formam o design system da aplicação.

O componente Button/ implementa botões customizados da aplicação. Oferece variantes de estilo (primary, secondary, outline, ghost), tamanhos diferentes (small, medium, large), estado de loading com indicador, estado desabilitado, ícones opcionais e acessibilidade completa.

O componente Input/ é o campo de entrada base da aplicação. Implementa estilização consistente, estados de foco, erro e desabilitado, suporte a ícones à esquerda e direita, máscara de texto opcional e todas as props padrão de TextInput.

O componente Loading/ exibe indicadores de carregamento padronizados. Pode incluir diferentes variantes como spinner circular, skeleton loading, indicador de progresso e overlay de loading para tela inteira.

O componente Modal/ implementa popups e diálogos modais reutilizáveis. Inclui backdrop com opção de fechar ao tocar, animações de entrada e saída, suporte a diferentes tamanhos, header com título e botão de fechar, e área de conteúdo flexível.

3.2 Hooks (shared/hooks/)
O diretório hooks/ contém React hooks customizados compartilhados que encapsulam lógicas reutilizáveis em múltiplos módulos. Diferente dos hooks do core que são infraestruturais, estes hooks são focados em lógicas de UI e interação como useForm para gerenciamento de formulários, useModal para controle de modais, usePagination para listas paginadas e outros hooks de propósito compartilhado.

3.3 Utils (shared/utils/)
O diretório utils/ agrupa funções auxiliares compartilhadas entre módulos.

3.3.1 Formatters (shared/utils/formatters/)
O diretório formatters/ contém funções de formatação para apresentação de dados na interface. Inclui formatação de datas (formatDate, formatDateTime, formatRelativeTime), formatação de valores monetários (formatCurrency, formatNumber), formatação de strings (capitalize, truncate), formatação de documentos (formatCPF, formatCNPJ, formatPhone) e outras funções que transformam dados brutos em formato legível para o usuário.

3.3.2 Validation (shared/utils/validation/)
O diretório validation/ contém funções e schemas de validação utilizados em formulários e processamento de dados. Inclui funções de validação individual (isValidEmail, isValidCPF, isValidPhone), schemas de validação com Yup ou Zod para formulários completos, mensagens de erro padronizadas e regras de validação reutilizáveis que garantem consistência na validação de dados em toda a aplicação.

Princípios Arquiteturais
A estrutura segue o padrão de Feature Modules onde cada módulo é autocontido e encapsula toda a lógica de uma área de negócio. O diretório core/ fornece a infraestrutura necessária para todos os módulos funcionarem. O diretório shared/ contém apenas código verdadeiramente genérico e agnóstico a regras de negócio. Módulos não devem importar diretamente de outros módulos, devendo utilizar o core ou shared para comunicação. Esta arquitetura facilita a manutenção, testabilidade e escalabilidade do projeto.