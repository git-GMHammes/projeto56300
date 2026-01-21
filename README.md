# Projeto 56300 - React Native

## 📱 Sobre o Projeto

Este é um projeto React Native desenvolvido para [descrever brevemente o objetivo do projeto]. O projeto está localizado em `C:\laragon\www\mobile\react\projeto56300` e utiliza as melhores práticas de desenvolvimento mobile.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter os seguintes requisitos instalados:

### Sistema Operacional

- Windows 10/11
- Node.js (versão 16 ou superior)
- Git

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

### Passo 3: Clonar o Repositório

```bash
# Clonar o repositório
git clone [URL_DO_REPOSITORIO]

# Navegar para o diretório do projeto
cd projeto56300/src
```

### Passo 4: Instalar Dependências

```bash
# Instalar dependências do Node.js
npm install

# Ou usando Yarn
yarn install
```

## 🚀 Executando o Projeto

### Para Novo Desenvolvimento

#### 1. Criar Novo Projeto (se necessário)

```bash
# Criar novo projeto React Native
npx @react-native-community/cli init src

# Entrar na pasta do projeto
cd src
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

### Para Projeto Existente

```bash
# 1. Navegar para a pasta do projeto
cd C:\laragon\www\mobile\react\projeto56300\src

# 2. Iniciar o Metro Bundler
npx react-native start

# 3. Em outro terminal, executar o app
npx react-native run-android

# 4. Verificar conexão do emulador
adb devices
```

## 📂 Estrutura do Projeto

```
projeto56300/
├── Doc/ [documentação - ignorado no build]
└── src/
    ├── .bundle/ [cache - ignorado]
    ├── .git/ [versionamento - ignorado]
    ├── android/ [código nativo Android - ignorado]
    ├── ios/ [código nativo iOS - ignorado]
    ├── node_modules/ [dependências - ignorado]
    ├── __tests__/ [testes - ignorado]
    ├── app.json (configurações do app)
    ├── App.tsx (componente principal)
    ├── index.js (ponto de entrada)
    ├── package.json (dependências e scripts)
    └── tsconfig.json (configurações TypeScript)
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

## 🐛 Solução de Problemas

### Problemas Comuns

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
rm -rf node_modules
npm install
```

## 📝 Comandos Úteis

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

[Instruções para contribuição se aplicável]

---

**Desenvolvido por:** [Seu Nome/Equipe]  
**Versão:** 1.0.0  
**Última atualização:** Janeiro 2026
