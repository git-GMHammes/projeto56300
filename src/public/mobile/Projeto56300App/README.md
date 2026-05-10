# Projeto56300App — Mobile React Native

Aplicativo mobile do sistema **Projeto56300** — plataforma SaaS multi-tenant desenvolvida com React Native.

---

## Stack de Tecnologias

| Tecnologia           | Versão                    |
| -------------------- | ------------------------- |
| React Native         | 0.85.2                    |
| React                | 19.2.3                    |
| TypeScript           | 5.8.3                     |
| Node.js (mínimo)     | >= 22.11.0                |
| Plataforma principal | Android (x86_64 emulador) |

---

## Pré-requisitos de Ambiente

- **Android Studio** com SDK Platform `API 35` (Android 15) instalado
- **Emulador AVD** configurado como `Pixel_8` (arquitetura `x86_64`)
- **Node.js >= 22.11.0**
- **JDK 17+**
- **React Native CLI** (`@react-native-community/cli`)
- Android SDK no PATH (`platform-tools`, `emulator`)

> **Windows:** O Android SDK geralmente não está no PATH por padrão.
> Adicionar manualmente ao PATH:
>
> ```
> %LOCALAPPDATA%\Android\Sdk\platform-tools
> %LOCALAPPDATA%\Android\Sdk\emulator
> ```

---

## Estrutura de Diretórios

```
Projeto56300App/
├── android/                         # Configuração nativa Android
│   └── gradle.properties            # ⚠️ reactNativeArchitectures=x86_64 (nunca alterar)
├── ios/                             # Configuração nativa iOS
├── scripts/
│   ├── patch-modules.js             # Patch Metro FallbackWatcher (pós-install)
│   └── clean-build.js               # Limpa build Android antes do Metro iniciar
├── src/
│   ├── app/                         # Raiz da aplicação
│   │   ├── App.tsx                  # Componente raiz
│   │   ├── navigation/
│   │   │   ├── RootNavigator.tsx    # Decide auth vs app
│   │   │   ├── AppNavigator.tsx     # Navegação autenticada
│   │   │   ├── AuthNavigator.tsx    # Fluxo de autenticação
│   │   │   ├── featureRoutes.ts     # Re-exports dos navegadores de features
│   │   │   ├── linking.ts           # Deep linking
│   │   │   └── types.ts             # Tipos de navegação
│   │   └── providers/
│   │       └── ThemeProvider.tsx    # Contexto global de tema
│   │
│   ├── core/                        # Infraestrutura reutilizável
│   │   ├── config/
│   │   │   └── env.ts               # Variáveis de ambiente (API_BASE_URL, etc.)
│   │   ├── constants/
│   │   │   ├── systems.ts           # IDs e labels dos sistemas
│   │   │   └── theme.ts             # Constantes de tema
│   │   ├── contracts/               # Definições de interfaces/contratos
│   │   ├── hooks/                   # Custom hooks não vinculados a feature
│   │   ├── infra/
│   │   │   ├── http/                # Interceptors HTTP
│   │   │   ├── logging/             # Serviços de log
│   │   │   ├── storage/             # Abstrações de armazenamento
│   │   │   └── telemetry/           # Hooks de analytics
│   │   ├── navigation/
│   │   │   └── index.tsx            # ⚠️ Navegador customizado pure-JS (sem C++)
│   │   ├── services/
│   │   │   ├── HttpClient.ts        # Wrapper fetch com Bearer auth
│   │   │   ├── StorageService.ts    # Sessão em memória (sem persistência)
│   │   │   └── index.ts
│   │   ├── store/                   # Gerenciamento de estado
│   │   ├── types/                   # Tipos globais
│   │   └── utils/                   # Utilitários
│   │
│   ├── data/                        # JSONs estáticos globais
│   │   ├── ods/
│   │   │   ├── menu_ods.json        # 20 itens de navegação ODS
│   │   │   ├── menu_user.json       # Menu contextual do usuário
│   │   │   └── description.json     # Descrições dos 18 ODS
│   │   └── message/
│   │       └── footer_message.json  # Abas da tela de mensagens
│   │
│   ├── features/                    # Módulos de feature (Clean Architecture)
│   │   ├── auth/
│   │   ├── estoque/
│   │   ├── gestaoDocumental/
│   │   ├── home/
│   │   ├── mecanica/
│   │   ├── messaging/
│   │   ├── ods/
│   │   ├── tarefas/
│   │   ├── usuario/
│   │   └── veterinaria/
│   │
│   └── shared/                      # UI e utilitários compartilhados
│       ├── assets/                  # Imagens e fontes
│       ├── theme/
│       │   ├── bootstrap.ts         # Tokens de design (espaçamento, fontes)
│       │   └── global/              # Definições dos 6 temas
│       └── ui/
│           ├── components/          # 9 componentes UI compartilhados
│           └── forms/               # Sistema de formulários dinâmicos
│
├── index.js                         # Entry point (AppRegistry)
├── App.tsx                          # Re-export do src/app/App
├── app.json                         # Configuração do app
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
└── CLAUDE.md                        # Regras e restrições críticas do ambiente
```

---

## Arquitetura — Clean Architecture por Feature

Cada feature segue a mesma separação em 3 camadas:

```
src/features/{modulo}/
├── data/
│   ├── datasources/        # Chamadas de API / fontes externas
│   ├── repositories/       # Implementação dos repositórios
│   ├── mappers/            # DTO ↔ Entidade
│   └── dto/                # Data Transfer Objects
├── domain/
│   ├── entities/           # Entidades de negócio
│   ├── repositories/       # Interfaces dos repositórios
│   ├── usecases/           # Regras de negócio
│   └── errors/             # Erros de domínio
└── presentation/
    ├── screens/            # Telas React Native
    ├── hooks/              # ViewModels (lógica de UI)
    ├── components/         # Componentes locais da feature
    └── routes/             # Navegador + paths + types
```

O módulo `estoque` é a referência mais completa — usar como modelo ao criar novas features.

---

## Módulos de Feature

| Feature            | Status       | Telas                                   | Observação                            |
| ------------------ | ------------ | --------------------------------------- | ------------------------------------- |
| `auth`             | **Completo** | Login, Register, ForgotPassword         | Full Clean Architecture com UseCases  |
| `estoque`          | **Completo** | ProdutoList, ProdutoDetail, ProdutoForm | CRUD completo com repository pattern  |
| `home`             | **Básico**   | HomeScreen                              | Dashboard simples                     |
| `messaging`        | **Parcial**  | MessageFileScreen, GroupMessageScreen   | Dois tipos de mensagem implementados  |
| `ods`              | **UI**       | OdsMenuDrawer (componente)              | Menu drawer com 20 itens ODS          |
| `gestaoDocumental` | **Stub**     | —                                       | Rotas configuradas, conteúdo pendente |
| `mecanica`         | **Stub**     | —                                       | Rotas configuradas, conteúdo pendente |
| `tarefas`          | **Stub**     | —                                       | Rotas configuradas, conteúdo pendente |
| `usuario`          | **Stub**     | —                                       | Rotas configuradas, conteúdo pendente |
| `veterinaria`      | **Stub**     | —                                       | Rotas configuradas, conteúdo pendente |

---

## Componentes UI Compartilhados

Localizados em `src/shared/ui/components/`:

| Componente                | Descrição                                             |
| ------------------------- | ----------------------------------------------------- |
| `BackButton.tsx`          | Pressable com hitSlop 16dp — ver regras de uso abaixo |
| `TopBar.tsx`              | Barra de topo da tela                                 |
| `HamburgerMenuButton.tsx` | Botão que abre o drawer ODS                           |
| `BottomTabBar.tsx`        | Barra de navegação inferior                           |
| `UserMenuButton.tsx`      | Botão de perfil do usuário                            |
| `UserMenuDrawer.tsx`      | Drawer com ações do usuário                           |
| `MessageDrawer.tsx`       | Painel de mensagens                                   |
| `MessageFooterBar.tsx`    | Abas do rodapé de mensagens                           |
| `DebugPanel.tsx`          | Overlay de desenvolvimento                            |

---

## Sistema de Formulários

Localizado em `src/shared/ui/forms/` — formulários dinâmicos tipados.

### Tipos de campos disponíveis

| Campo           | Arquivo                 |
| --------------- | ----------------------- |
| Texto genérico  | `InputField.tsx`        |
| Senha           | `PasswordField.tsx`     |
| E-mail          | `EmailField.tsx`        |
| CPF             | `CpfField.tsx`          |
| Telefone        | `PhoneField.tsx`        |
| Data            | `DateField.tsx`         |
| CNPJ            | `CnpjField.tsx`         |
| CEP             | `CepField.tsx`          |
| Textarea        | `TextareaField.tsx`     |
| Select          | `SelectField.tsx`       |
| Checkbox        | `CheckboxField.tsx`     |
| Radio           | `RadioField.tsx`        |
| Avatar / Imagem | `AvatarPickerField.tsx` |

Os campos CPF, CNPJ, CEP e Telefone possuem validadores e formatadores para o padrão brasileiro em `forms/utils/`.

---

## Sistema de Temas

6 temas configuráveis em tempo de execução via `ThemeProvider`:

| Tema           | Arquivo          |
| -------------- | ---------------- |
| Light (padrão) | `themeLight.ts`  |
| Dark           | `themeDark.ts`   |
| Green          | `themeGreen.ts`  |
| Purple         | `themePurple.ts` |
| Blue           | `themeBlue.ts`   |
| Red            | `themeRed.ts`    |

Tokens de design (espaçamento, tipografia, cores) centralizados em `src/shared/theme/bootstrap.ts`.

Hook de acesso: `useTheme()` (via `ThemeProvider`).

---

## Camada HTTP e API

### HttpClient (`src/core/services/HttpClient.ts`)

- Wrapper sobre `fetch` com injeção automática do header `Authorization: Bearer {token}`
- Timeout de 30 segundos (`API_TIMEOUT_MS` via env)
- Classe `HttpError` com `statusCode`
- Funções:
  - `httpClient<T>(path, options)` — retorna dados tipados
  - `httpClientRaw<T>(path, options)` — retorna `ApiEnvelope` completo
  - `setTokenReader(reader)` — injeta a função leitora do token

### StorageService (`src/core/services/StorageService.ts`)

Armazenamento de sessão **em memória** (volátil — sem persistência entre reinicializações):

```typescript
saveSession(token, tokenType, expiresIn, user)
getToken()           → Promise<string | null>
getUser<T>()         → Promise<T | null>
isAuthenticated()    → Promise<boolean>
clearSession()       → Promise<void>
```

> O AsyncStorage foi removido permanentemente por causar OOM na compilação C++ — ver seção de pacotes removidos.

---

## Variáveis de Ambiente

Definidas em `src/core/config/env.ts`:

| Variável            | Descrição                               |
| ------------------- | --------------------------------------- |
| `API_BASE_URL`      | URL base da API REST backend            |
| `API_TIMEOUT_MS`    | Timeout das requisições (padrão: 30000) |
| `APP_ENV`           | Ambiente (`development`, `production`)  |
| `APP_CONTRACT_CODE` | Código do contrato SaaS                 |
| `APP_SYSTEM_ID`     | ID do sistema                           |

---

## Fluxo de Autenticação

```
App inicializa
└── RootNavigator.tsx
    ├── isAuthenticated() == false → AuthNavigator
    │   ├── LoginScreen      → LoginUseCase → saveSession() → setTokenReader()
    │   ├── RegisterScreen
    │   └── ForgotPasswordScreen
    └── isAuthenticated() == true  → AppNavigator
        └── (telas autenticadas)
```

---

## Navegação Customizada

> **Não usar `react-navigation`** — foi removido permanentemente (ver pacotes removidos).

A navegação é implementada em `src/core/navigation/index.tsx` — stack navigator **pure JavaScript**, sem dependências nativas C++.

### API disponível

```typescript
import { createNativeStackNavigator } from '../../../../core/navigation';
import type { NativeStackScreenProps } from '../../../../core/navigation';
```

> Caminho a partir de `src/features/*/presentation/routes/`: **4 níveis acima** (`../../../../`).
> 5 níveis (`../../../../../`) é errado — sai do diretório `src/`.

---

## Pacotes Nativos Removidos

Os pacotes abaixo foram **removidos permanentemente** por causarem LLVM OOM durante compilação NDK (`clang++ 0x5AF — arquivo de paginação muito pequeno`):

| Pacote removido                             | Substituído por                       |
| ------------------------------------------- | ------------------------------------- |
| `react-native-screens`                      | `src/core/navigation/index.tsx`       |
| `react-native-safe-area-context`            | `SafeAreaView` do `react-native`      |
| `@react-navigation/native`                  | `src/core/navigation/index.tsx`       |
| `@react-navigation/native-stack`            | `src/core/navigation/index.tsx`       |
| `@react-native-async-storage/async-storage` | `src/core/services/StorageService.ts` |

**Nunca reinstalar esses pacotes** sem antes resolver o limite de RAM/page file da máquina.

---

## Dados Estáticos — Regra Absoluta

Nenhum dado estático deve ser declarado dentro de componentes, telas ou hooks.

### Dois níveis de JSONs

| Nível           | Localização                               | Quando usar                            |
| --------------- | ----------------------------------------- | -------------------------------------- |
| **Global**      | `src/data/{dominio}/arquivo.json`         | Dados compartilhados entre 2+ features |
| **Por feature** | `src/features/{modulo}/data/arquivo.json` | Dados exclusivos de um único módulo    |

### Inventário dos JSONs globais existentes

| Arquivo                                | Conteúdo                                          |
| -------------------------------------- | ------------------------------------------------- |
| `src/data/ods/menu_ods.json`           | 20 itens de navegação ODS                         |
| `src/data/ods/menu_user.json`          | Menu contextual: Login, Perfil, Home, Logout      |
| `src/data/ods/description.json`        | 18 ODS com `key`, `title`, `description`, `image` |
| `src/data/message/footer_message.json` | 3 abas: Mural, Mensagens Diretas, Grupos          |

### Padrão correto

```typescript
// ✅ CORRETO — dado isolado em JSON e importado
import categorias from '../../data/categorias.json';

// ❌ ERRADO — dado embutido no componente
const categorias = [{ label: 'Eletrônicos', value: 'eletronicos' }];
```

---

## Sequência de Execução — 3 Terminais

### Terminal 1 — Iniciar Emulador

```powershell
& "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_8
```

Aguardar a tela inicial do Android aparecer.

### Terminal 2 — Iniciar Metro

```powershell
cd C:\laragon\www\php\habilidade\projeto56300\src\public\mobile\Projeto56300App
npm run start -- --reset-cache
```

Aguardar a mensagem `Dev server ready`.

> **Nunca usar `npx react-native start` diretamente** — usar sempre `npm run start`.
> O script inclui `--max-workers 1` e executa `clean-build.js` antes de iniciar.

### Terminal 3 — Compilar e Instalar o APK

```powershell
adb reverse tcp:8081 tcp:8081
cd C:\laragon\www\php\habilidade\projeto56300\src\public\mobile\Projeto56300App
$env:CMAKE_BUILD_PARALLEL_LEVEL = "1"
npm run android
```

> Após o primeiro `npm run android` instalar o APK, no dia a dia basta:
> Terminal 1 + Terminal 2 + pressionar **R** no emulador para recarregar.

---

## Restrições Críticas de Ambiente

### 1. ABI do Emulador — OBRIGATÓRIO `x86_64`

```
# android/gradle.properties
reactNativeArchitectures=x86_64
```

Nunca alterar para `arm64-v8a` enquanto usar emulador x86_64.
Crash ao usar ABI errado: `SoLoaderDSONotFoundError: couldn't find DSO to load: libreactnative.so`

Para device físico ARM64: trocar para `arm64-v8a`.

---

### 2. Patch Metro FallbackWatcher (Windows)

O Gradle cria junctions com prefixo `\\?\` dentro de `android/app/build/intermediates/incremental/`. O `FallbackWatcher` do Metro trava ao tentar `lstat` nessas junctions (errno -4094, code UNKNOWN).

- **`scripts/patch-modules.js`** — roda via `postinstall`, adiciona `error.code === "UNKNOWN"` como erro ignorável no Metro
- **`scripts/clean-build.js`** — roda via `npm run start`, deleta `android/app/build` e `android/build` antes de iniciar

---

### 3. Android 15 (API 35) — Edge-to-Edge

No Android 15 com edge-to-edge ativo, o sistema intercepta toques nos primeiros ~40-50dp do topo para abrir a gaveta de notificações. `StatusBar.currentHeight` reporta um valor menor que essa zona real.

**Sintoma:** botões no topo da tela não disparam `onPress` — sem erro, sem log.

**Correção** em `src/core/navigation/index.tsx`:

```typescript
const ANDROID_TOP_INSET =
  Platform.OS === 'android'
    ? Math.max((StatusBar.currentHeight ?? 24) + 16, 56)
    : 0;
```

---

### 4. Padrão do BackButton

Sempre usar `src/shared/ui/components/BackButton.tsx`:

- `Pressable` (não `TouchableOpacity`) com `hitSlop` de 16dp em todos os lados
- `minHeight: 48` e `paddingVertical: 12`
- Posicionado **fora** do `ScrollView` (diretamente dentro do `SafeAreaView`)

```tsx
// ✅ Estrutura correta para telas com botão Voltar
<SafeAreaView style={styles.safe}>
  <BackButton onPress={() => navigation.navigate(PATHS.TELA_ANTERIOR)} />
  <KeyboardAvoidingView>
    <ScrollView>...</ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

---

### 5. RAM — Metro com `--max-workers 1`

Com emulador + Metro + Gradle simultâneos a máquina pode travar. O `npm run start` já inclui `--max-workers 1` permanentemente. O bundle fica mais lento (~3-4 min) mas não congela o sistema.

---

## Convenções de Código

- **Nomenclatura em inglês** para código (variáveis, funções, arquivos, tipos)
- **Comentários e documentação** podem ser em português
- **Sem dados estáticos** inline em componentes — sempre extrair para JSON
- **Sem `react-navigation`** — usar apenas `src/core/navigation`
- **Sem `AsyncStorage`** — usar apenas `StorageService`
- **`Pressable`** em vez de `TouchableOpacity` para botões interativos críticos
- **`hitSlop`** mínimo de 16dp em todos os lados para elementos tocáveis pequenos
- Novas features seguem **exatamente** a estrutura `data/domain/presentation`

---

## Scripts Disponíveis

```bash
npm run start       # Inicia Metro (limpa build + --max-workers 1)
npm run android     # Compila e instala no emulador/device Android
npm run ios         # Compila para iOS
npm run lint        # ESLint
npm test            # Jest
```

---

## Referências Internas

| Recurso                         | Localização                                            |
| ------------------------------- | ------------------------------------------------------ |
| Regras críticas de ambiente     | `CLAUDE.md`                                            |
| Regras globais do projeto       | `C:\laragon\www\php\habilidade\projeto56300\CLAUDE.md` |
| Comandos de execução detalhados | `docs/txt/react_native/cmd.txt`                        |
| Modelos de feature (referência) | `src/features/estoque/`                                |

---

---

# React Native — Documentação Original

This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide before proceeding.

## Step 1: Start Metro

First, you will need to run **Metro**, the JavaScript build tool for React Native.

To start the Metro dev server, run the following command from the root of your React Native project:

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
