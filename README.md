# Projeto 56300 - React Native

## 📱 Sobre o Projeto

Este é um projeto React Native desenvolvido para [descrever brevemente o objetivo do projeto]. O projeto está localizado em `C:\laragon\www\mobile\react\projeto56300` e utiliza as melhores práticas de desenvolvimento mobile.

## ⚠️ IMPORTANTE: Configuração do Git

### 🔄 Cenário 1: Adicionando React Native a um Repositório Git Existente

Se você já possui um repositório Git e quer adicionar um projeto React Native, **SEMPRE** execute a limpeza antes de fazer commit:

```powershell
# 1. Navegue para a pasta do projeto React Native
cd C:\laragon\www\mobile\react\projeto56300\src

# 2. OBRIGATÓRIO: Remova arquivos que conflitam com Git
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue

# 3. Volte para a raiz do projeto
cd ..

# 4. Configure .gitignore (se não existir)
# Veja seção "Configuração do .gitignore" abaixo

# 5. Agora pode fazer commit normalmente
git add .
git status
git commit -m "Adicionar projeto React Native"
git push origin main
```

### 🆕 Cenário 2: Criando um Novo Repositório Git

Se você ainda não tem um repositório Git configurado:

```powershell
# 1. Navegue para a pasta raiz do projeto
cd C:\laragon\www\mobile\react\projeto56300

# 2. Inicialize um novo repositório Git
git init

# 3. Configure .gitignore (veja seção abaixo)

# 4. Limpe os arquivos conflitantes da pasta src
cd src
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue
cd ..

# 5. Adicione origem remota (substitua pela URL do seu repositório)
git remote add origin https://github.com/seu-usuario/seu-repositorio.git

# 6. Faça o primeiro commit
git add .
git commit -m "Initial commit: Projeto React Native"

# 7. Envie para o repositório remoto
git branch -M main
git push -u origin main
```

### 📝 Configuração do .gitignore

**SEMPRE** configure um `.gitignore` na raiz do projeto antes de fazer qualquer commit:

```gitignore
# === REACT NATIVE ESPECÍFICO ===

# Dependências Node.js
node_modules/
*/node_modules/
src/node_modules/

# Lock files (podem ser incluídos ou não, dependendo da estratégia da equipe)
package-lock.json
yarn.lock
**/package-lock.json
**/yarn.lock

# Build e Cache
src/android/app/build/
src/ios/build/
src/.bundle/
**/.bundle/

# Metro bundler cache
.metro-health-check*

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Arquivos temporários
tmp/
temp/

# === ANDROID ===
src/android/.gradle/
src/android/local.properties
src/android/app/build/
src/android/gradle.properties
src/android/gradlew
src/android/gradlew.bat

# === iOS ===
src/ios/build/
src/ios/*.xcworkspace
src/ios/Pods/

# === DESENVOLVIMENTO ===
.vscode/
.idea/
*.swp
*.swo

# === SISTEMA OPERACIONAL ===
# Windows
Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/

# macOS
.DS_Store
.AppleDouble
.LSOverride

# Linux
*~
```

## 🔄 Por que essa Limpeza é Necessária?

### Problema: Repositórios Aninhados

Quando você executa `npx @react-native-community/cli init src`, o comando cria:

- **Um novo repositório Git** dentro de `src/` (pasta `.git`)
- Isso resulta em **repositório dentro de repositório**
- O Git principal não consegue gerenciar adequadamente essa estrutura

### Problema: Arquivos Gigantes

- **node_modules/**: Pasta com milhares de arquivos (50MB+)
- **package-lock.json**: Arquivo que pode causar conflitos
- Esses arquivos devem ser **regenerados** em cada ambiente, não versionados

### Solução: Estrutura Limpa

Após a limpeza, você terá:

```
projeto56300/
├── .gitignore           # Configurado corretamente
├── README.md           # Este arquivo
└── src/                # Projeto React Native limpo
    ├── App.tsx         # Código-fonte
    ├── package.json    # Dependências (este SIM é versionado)
    ├── android/        # Configurações nativas
    ├── ios/            # Configurações nativas
    └── ...             # Outros arquivos de código
```

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

### Sistema Operacional

- Windows 10/11
- Node.js (versão 16 ou superior)
- Git

### React Native CLI (OBRIGATÓRIO)

```powershell
# Instalar CLI do React Native globalmente
npm install -g @react-native-community/cli

# Verificar instalação
npx react-native --version
```

### Android Development Environment

#### 1. Android Studio

Instale o Android Studio com os seguintes componentes:

- Android SDK Build-Tools
- Android SDK Command-line Tools
- Android Emulator
- Android Emulator hypervisor driver
- Intel x86 Emulator Accelerator (HAXM installer)
- Android SDK Platform-Tools

#### 2. Java Development Kit (JDK)

- **JDK 17 LTS** (Eclipse Temurin)
- Download: https://adoptium.net/pt-BR/temurin/releases?version=17&os=any&arch=any

## 🛠️ Instalação e Configuração

### Passo 1: Configurar Variáveis de Ambiente

#### Configurar JAVA_HOME

1. Após instalar o JDK 17, configure a variável `JAVA_HOME`
2. Adicione `%JAVA_HOME%\bin` ao **PATH**
3. Verifique a instalação:

```bash
javac -version
```

#### Configurar Android SDK

1. Configure a variável `ANDROID_HOME` apontando para o SDK do Android
2. Adicione ao PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

### Passo 2: Resolver Problemas Comuns do Android SDK

Se houver falha na instalação do Android SDK Platform-Tools:

```bash
# Navegar para o diretório do SDK
cd C:\Users\[SEU_USUARIO]\AppData\Local\Android\Sdk

# Excluir a pasta Platform-Tools completamente
# Em seguida, reinstalar o pacote pelo Android Studio
```

### Passo 3: Instalar Dependências Obrigatórias

#### Instalar React Native CLI Globalmente (OBRIGATÓRIO)

```powershell
# Instalar CLI globalmente - SEM ISSO NADA FUNCIONA!
npm install -g @react-native-community/cli

# Verificar se foi instalado corretamente
npx react-native --version
```

### Passo 4: Clonar/Configurar o Repositório

#### Se o repositório JÁ EXISTE:

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]

# Navegar para o diretório do projeto
cd projeto56300/src

# Instalar dependências
npm install
```

#### Se é um NOVO repositório:

```bash
# Siga os comandos da seção "Cenário 2" acima
```

## 🚀 Executando o Projeto

### ⚠️ ANTES DE TUDO: Verificar Instalações

```powershell
# Verificar se tudo está instalado
node --version          # Deve mostrar v16+
npm --version           # Deve funcionar
npx react-native --version  # DEVE FUNCIONAR - se não, instale a CLI global
java -version           # Deve mostrar Java 17
adb devices            # Deve mostrar emulador conectado
```

### 🔧 Se `npx react-native --version` não funcionar:

```powershell
# Instalar CLI globalmente (OBRIGATÓRIO)
npm install -g @react-native-community/cli

# E também localmente no projeto
cd C:\laragon\www\mobile\react\projeto56300\src
npm install --save-dev @react-native-community/cli
```

### Para Novo Desenvolvimento

#### 1. Criar Novo Projeto (se necessário)

```bash
# Criar novo projeto React Native
npx @react-native-community/cli init src

# ⚠️ IMPORTANTE: Sempre execute a limpeza após criar o projeto
cd src
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue

# Instalar dependências
npm install
```

#### 2. Iniciar o Desenvolvimento

```bash
# 1. Abrir o Emulador Android no Android Studio

# 2. Verificar se o emulador está conectado
adb devices
# Saída esperada: emulator-5554   device

# 3. Iniciar o Metro Bundler (manter aberto)
npx react-native start

# 4. Em outro terminal, executar o app no emulador
npx react-native run-android
```

### Para Projeto Existente (Após Clonar)

```bash
# 1. Navegar para a pasta do projeto
cd C:\laragon\www\mobile\react\projeto56300\src

# 2. Instalar dependências (OBRIGATÓRIO após clonar)
npm install

# 3. Iniciar o Metro Bundler
npx react-native start

# 4. Em outro terminal, executar o app
npx react-native run-android

# 5. Verificar conexão do emulador
adb devices
```

## 📂 Estrutura do Projeto sem MÓDULOS/FEATURES ESPECÍFICOS

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
    │   └── README_API_Login.md ----------------- Documentação da API de login
    ├── ios/ [ignorado] ------------------------- Código nativo iOS
    ├── node_modules/ [ignorado] ---------------- Dependências do projeto
    ├── __tests__/ [ignorado] ------------------- Testes automatizados
    ├── app.json -------------------------------- Configuração do Expo/React Native
    ├── App.tsx --------------------------------- **COMPONENTE RAIZ DA APLICAÇÃO**
    ├── index.js -------------------------------- **PONTO DE ENTRADA DA APLICAÇÃO**
    ├── package.json ---------------------------- Dependências e scripts do projeto
    └── tsconfig.json --------------------------- Configuração do TypeScript
```

### Arquivos Principais

- **App.tsx**: Arquivo principal do aplicativo onde você deve modificar a interface e funcionalidades
- **index.js**: Ponto de entrada da aplicação
- **package.json**: Gerenciamento de dependências e scripts
- **app.json**: Configurações gerais do aplicativo

## 💻 Desenvolvimento

### Exemplo: Tela "Olá Mundo"

Edite o arquivo **App.tsx** com o seguinte código:

```tsx
import React from "react";
import { Text, View, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Olá Mundo!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});

export default App;
```

### Ferramentas de Desenvolvimento

Mantenha sempre abertas as seguintes ferramentas durante o desenvolvimento:

1. **Terminal do Metro Bundler** (`npx react-native start`)
2. **Terminal de Execução** (`npx react-native run-android`)
3. **React Native DevTools** (para monitoramento e debug)
4. **Emulador Android** (executando o app)

## 🔧 Workflow de Desenvolvimento com Git

### Fluxo Diário de Trabalho

```powershell
# 1. Atualizar código antes de começar
git pull origin main

# 2. Fazer suas alterações no código...

# 3. Antes de commit, verificar status
git status

# 4. Adicionar alterações
git add .

# 5. Fazer commit com mensagem descritiva
git commit -m "feat: adicionar tela de login"

# 6. Enviar alterações
git push origin main
```

### Comandos de Emergência (Se algo der errado)

```powershell
# Se precisa limpar tudo e começar novamente
cd src
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
npm install

# Se o Git está bagunçado (CUIDADO - perde alterações não salvas)
git reset --hard HEAD
git clean -fd
```

## 📦 Build e Distribuição

### Gerar APK para Release

```bash
# 1. Navegar para a pasta android
cd src/android

# 2. Executar o build de release
./gradlew assembleRelease

# 3. Localizar o APK gerado
# Caminho: src/android/app/build/outputs/apk/release/app-release.apk
```

### Instalação em Dispositivo Físico

1. Transfira o APK gerado para um dispositivo Android
2. Habilite a instalação de apps de fontes desconhecidas
3. Instale o APK

## 🛠️ Scripts Disponíveis

```json
{
  "scripts": {
    "start": "npx react-native start",
    "android": "npx react-native run-android",
    "ios": "npx react-native run-ios",
    "test": "jest",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx"
  }
}
```

## 🚨 Solução de Problemas

### Problemas com Git

#### 1. Erro "repositório aninhado"

```powershell
# Execute a limpeza obrigatória
cd src
Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue
cd ..
git add .
```

#### 2. Arquivos muito grandes para commit

```powershell
# Verifique se .gitignore está configurado corretamente
# Remova node_modules se necessário
Remove-Item src/node_modules -Recurse -Force -ErrorAction SilentlyContinue
```

### Problemas com CLI

#### 1. Erro "react-native depends on @react-native-community/cli"

```powershell
# Solução 1: Instalar CLI globalmente
npm install -g @react-native-community/cli

# Solução 2: Instalar CLI localmente no projeto
npm install --save-dev @react-native-community/cli

# Solução 3: Reinstalar tudo
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
npm install -g @react-native-community/cli
npm install
```

#### 2. CLI instalada mas comandos não funcionam

```powershell
# Limpar cache npm
npm cache clean --force

# Reinstalar CLI
npm uninstall -g @react-native-community/cli
npm install -g @react-native-community/cli

# Verificar instalação
npx react-native --version
```

### Problemas Comuns de Execução

#### 1. Emulador não conecta

```bash
# Verificar dispositivos conectados
adb devices

# Reiniciar ADB se necessário
adb kill-server
adb start-server
```

#### 2. Metro Bundler não inicia

```bash
# Limpar cache do Metro
npx react-native start --reset-cache
```

#### 3. Build Android falha

```bash
# Limpar build
cd android
./gradlew clean

# Reconstruir
cd ..
npx react-native run-android
```

#### 4. Problemas com dependências

```bash
# Limpar cache npm
npm start -- --reset-cache

# Reinstalar node_modules
Remove-Item node_modules -Recurse -Force
npm install
```

## 🔍 Comandos Úteis

```bash
# Verificar versão do React Native CLI
npx react-native --version

# Verificar informações do ambiente
npx react-native doctor

# Listar dispositivos conectados
adb devices

# Verificar logs do Android
adb logcat

# Instalar APK via ADB
adb install caminho/para/app.apk
```

## 🚀 Próximos Passos

- [ ] Configurar testes automatizados
- [ ] Implementar CI/CD
- [ ] Configurar Flipper para debugging
- [ ] Implementar navegação (React Navigation)
- [ ] Configurar gerenciamento de estado (Redux/Context)

## 📚 Recursos Úteis

- [Documentação Oficial React Native](https://reactnative.dev/)
- [Android Developer Guide](https://developer.android.com/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Community](https://github.com/react-native-community)

## 📄 Licença

[Especificar licença do projeto]

## 👥 Contribuição

### Para Contribuidores

Se você vai contribuir com este projeto:

1. **SEMPRE** execute a limpeza após criar/modificar projetos React Native
2. **NUNCA** faça commit de `node_modules/` ou `.git/` dentro de `src/`
3. Verifique se o `.gitignore` está atualizado
4. Execute `npm install` após clonar o projeto

### Regras de Commit

- Use mensagens descritivas: `feat:`, `fix:`, `docs:`, `refactor:`
- Teste antes de fazer push
- Mantenha o código limpo e documentado

---

**Desenvolvido por:** [Seu Nome/Equipe]  
**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026

---

## 🔥 RESUMO RÁPIDO - Cola do Desenvolvedor

### ✅ PRIMEIRA VEZ - Instalação Obrigatória:

```powershell
# ANTES DE TUDO - instalar CLI globalmente
npm install -g @react-native-community/cli

# Verificar se funcionou
npx react-native --version
```

### ✅ SEMPRE faça isso ao criar projeto React Native:

```powershell
# Após npx @react-native-community/cli init src
cd src
Remove-Item package-lock.json -Force -ErrorAction SilentlyContinue
Remove-Item node_modules -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue
npm install
npm install --save-dev @react-native-community/cli
cd ..
# Configure .gitignore
# Agora pode fazer git add . e commit
```

### ✅ SEMPRE faça isso ao clonar projeto existente:

```powershell
git clone [URL]
cd projeto/src
npm install
npm install --save-dev @react-native-community/cli  # Se der erro de CLI
npx react-native start
# Em outro terminal: npx react-native run-android
```
