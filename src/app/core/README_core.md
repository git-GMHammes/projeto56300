# README - Estrutura Core do Projeto

## Índice

1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Fluxo da Aplicação](#fluxo-da-aplicação)
3. [Código Fonte Completo](#código-fonte-completo)

---

## Estrutura de Pastas

```
src/app/core/
│
├── api/                          # Camada de comunicação com API
│   ├── client.ts                 # Cliente HTTP (ApiClient)
│   ├── interceptors.ts           # Interceptors de request/response
│   └── types.ts                  # Tipagens da API (vazio no momento)
│
├── config/                       # Configurações globais
│   ├── constants.ts              # Constantes da aplicação (API_CONFIG, APP_CONFIG)
│   ├── env.ts                    # Variáveis de ambiente
│   └── index.ts                  # Barrel export
│
├── hooks/                        # Custom hooks React
│   ├── useApi.ts                 # Hook para chamadas de API (vazio)
│   ├── useAsyncStorage.ts        # Hook para AsyncStorage (vazio)
│   └── useNetworkState.ts        # Hook para estado de rede (vazio)
│
├── navigation/                   # Sistema de navegação
│   ├── AppNavigator.tsx          # Navegador raiz (Main/Auth)
│   ├── AuthNavigator.tsx         # Navegador de autenticação
│   ├── types.ts                  # Tipagens de navegação
│   └── linking.ts                # Deep linking configuration
│
├── providers/                    # Context Providers
│   ├── ApiProvider.tsx           # Provider de API (vazio)
│   ├── ThemeProvider.tsx         # Provider de tema (vazio)
│   └── index.tsx                 # Barrel export (vazio)
│
├── store/                        # Redux Store
│   ├── index.ts                  # Configuração do store
│   ├── rootReducer.ts            # Root reducer (vazio)
│   └── middleware.ts             # Middlewares (vazio)
│
├── styles/                       # Sistema de estilos
│   ├── colors.ts                 # Paleta de cores
│   ├── spacing.ts                # Espaçamentos
│   ├── typography.ts             # Tipografia
│   ├── theme.ts                  # Tema (vazio)
│   └── index.ts                  # Barrel export
│
├── types/                        # Tipagens globais
│   ├── api.ts                    # Tipos de API Response
│   ├── global.ts                 # Tipos globais (vazio)
│   └── navigation.ts             # Tipos de navegação (vazio)
│
└── utils/                        # Funções utilitárias
    ├── validation.ts             # Validações (vazio)
    ├── storage.ts                # Storage helpers (vazio)
    ├── formatters.ts             # Formatadores (vazio)
    └── helpers.ts                # Helpers gerais (vazio)
```

---

## Fluxo da Aplicação

### 1. Inicialização da Aplicação

```
App.tsx
  └─> AppNavigator (core/navigation)
       ├─> Main (MainNavigator - módulo main)
       └─> Auth (AuthNavigator - core/navigation)
            └─> LoginScreen
```

### 2. Fluxo de Navegação

**Root Navigator (AppNavigator)**

- Define a estrutura principal com duas stacks:
  - `Main`: Navegação principal do app (Home, Account, Settings, Notifications)
  - `Auth`: Navegação de autenticação (Login, Register, ForgotPassword)

**Auth Navigator (AuthNavigator)**

- Gerencia telas de autenticação
- Atualmente apenas LoginScreen está ativa

### 3. Fluxo de Comunicação com API

```
Component/Screen
  └─> apiClient.post() / apiClient.get()
       └─> requestInterceptor (adiciona token de autorização)
            └─> fetch (requisição HTTP)
                 └─> responseInterceptor (trata resposta)
                      ├─> Success: retorna ResponseData
                      └─> Error: errorInterceptor (trata erro)
```

**Interceptors:**

1. **requestInterceptor**: Adiciona token de autorização e logs de debug
2. **responseInterceptor**: Processa resposta, trata token expirado (401)
3. **errorInterceptor**: Trata erros de rede, timeout e erros genéricos

### 4. Fluxo de State Management (Redux)

```
store/index.ts
  └─> configureStore
       └─> reducer: { auth: authSliceReducer }
```

### 5. Sistema de Tipos

```
ResponseData (api/interceptors.ts)
  ├─> http_code: number
  ├─> status: 'success' | 'error'
  ├─> message: string
  └─> data: any

ApiResponse (types/api.ts)
  ├─> http_code: number
  ├─> status: 'success' | 'error'
  ├─> message: string
  ├─> api_data: { version, date_time }
  ├─> data: T (generic)
  └─> metadata: { url }
```

### 6. Deep Linking

```
prefixes: ['projeto56300://', 'https://projeto56300.com']
  └─> Rotas:
       ├─> projeto56300://login
       ├─> projeto56300://register
       ├─> projeto56300://forgot-password
       ├─> projeto56300://home
       ├─> projeto56300://account
       ├─> projeto56300://settings
       └─> projeto56300://notifications
```

---

## Código Fonte Completo

### 📁 api/

#### `api/client.ts`

```typescript
import { API_CONFIG } from '../config/constants';
import { ApiInterceptors, RequestConfig, ResponseData } from './interceptors';

class ApiClient {
  private baseURL = API_CONFIG.BASE_URL;
  private timeout = API_CONFIG.TIMEOUT;

  async post<T>(endpoint: string, data: any): Promise<ResponseData> {
    // ✅ Retorna ResponseData
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
      },
      body: data,
    };

    try {
      // Aplica interceptor de requisição
      const interceptedConfig = await ApiInterceptors.requestInterceptor(
        config,
      );

      // Faz a requisição
      const response = await Promise.race([
        fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
          body: JSON.stringify(interceptedConfig.body),
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout),
        ),
      ]);

      // Aplica interceptor de resposta
      const result = await ApiInterceptors.responseInterceptor(response);
      return result; // ✅ Retorna ResponseData diretamente
    } catch (error) {
      // Aplica interceptor de erro
      const errorResult = ApiInterceptors.errorInterceptor(error as Error);
      return errorResult; // ✅ Retorna ResponseData diretamente
    }
  }

  // Métodos GET, PUT, DELETE podem ser adicionados aqui seguindo o mesmo padrão
  async get(endpoint: string): Promise<ResponseData> {
    const config: RequestConfig = {
      url: `${this.baseURL}${endpoint}`,
      method: 'GET',
      headers: {
        ...API_CONFIG.HEADERS,
      },
    };

    try {
      const interceptedConfig = await ApiInterceptors.requestInterceptor(
        config,
      );

      const response = await Promise.race([
        fetch(interceptedConfig.url, {
          method: interceptedConfig.method,
          headers: interceptedConfig.headers,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), this.timeout),
        ),
      ]);

      return await ApiInterceptors.responseInterceptor(response);
    } catch (error) {
      return ApiInterceptors.errorInterceptor(error as Error);
    }
  }
}

export const apiClient = new ApiClient();
```

#### `api/interceptors.ts`

```typescript
import { tokenService } from '../../modules/authentication/services/tokenService';

// Interface para requisições HTTP
export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
}

// Interface para respostas HTTP
export interface ResponseData {
  http_code: number;
  status: 'success' | 'error';
  message: string;
  data: any;
}

export class ApiInterceptors {
  // Interceptor de REQUISIÇÃO - Adiciona token de autorização
  static async requestInterceptor(
    config: RequestConfig,
  ): Promise<RequestConfig> {
    try {
      const token = await tokenService.getToken();

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // Log da requisição em desenvolvimento
      if (__DEV__) {
        console.log('🚀 API Request:', {
          url: config.url,
          method: config.method,
          headers: config.headers,
          body: config.body,
        });
      }

      return config;
    } catch (error) {
      console.error('❌ Request Interceptor Error:', error);
      return config;
    }
  }

  // Interceptor de RESPOSTA - Trata respostas e erros
  static async responseInterceptor(response: Response): Promise<ResponseData> {
    try {
      const data = await response.json();

      // Log da resposta em desenvolvimento
      if (__DEV__) {
        console.log('📥 API Response:', {
          status: response.status,
          url: response.url,
          data,
        });
      }

      // Se token expirou (401), fazer logout automático
      if (response.status === 401) {
        console.warn('🔐 Token expirado, fazendo logout...');
        await tokenService.clearAll();
        // TODO: Redirecionar para tela de login
      }

      // Retorna dados no formato padronizado
      return {
        http_code: response.status,
        status: response.ok ? 'success' : 'error',
        message:
          data.message || (response.ok ? 'Sucesso' : 'Erro na requisição'),
        data: data.data || data,
      };
    } catch (error) {
      console.error('❌ Response Interceptor Error:', error);

      // Retorna erro padronizado
      return {
        http_code: 500,
        status: 'error',
        message: 'Erro ao processar resposta da API',
        data: null,
      };
    }
  }

  // Interceptor de ERRO - Trata erros de rede
  static errorInterceptor(error: Error): ResponseData {
    console.error('❌ API Error:', error);

    // Erro de rede/conexão
    if (error.message.includes('fetch') || error.message.includes('network')) {
      return {
        http_code: 0,
        status: 'error',
        message: 'Erro de conexão. Verifique sua internet.',
        data: null,
      };
    }

    // Erro de timeout
    if (error.message.includes('timeout')) {
      return {
        http_code: 408,
        status: 'error',
        message: 'Tempo limite excedido. Tente novamente.',
        data: null,
      };
    }

    // Erro genérico
    return {
      http_code: 500,
      status: 'error',
      message: 'Erro interno. Tente novamente.',
      data: null,
    };
  }
}
```

#### `api/types.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 config/

#### `config/constants.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://habilidade.com/codeigniter56300/src/public',
  ENDPOINTS: {
    LOGIN: '/api/v1/user-management/login',
  },
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

export const APP_CONFIG = {
  NAME: 'Projeto56300',
  VERSION: '1.0.0',
  ENVIRONMENT: 'development', // Valor fixo, sem process.env
} as const;
```

#### `config/env.ts`

```typescript
// Configurações de ambiente para React Native
// Como não temos process.env no RN, usamos configurações estáticas

export const ENV = {
  NODE_ENV: 'development', // ou 'production'
  API_URL: 'https://habilidade.com/codeigniter56300/src/public',
  APP_NAME: 'Projeto56300',
  VERSION: '1.0.0',
  DEBUG: true, // false em produção
  TIMEOUT: 10000,
} as const;
```

#### `config/index.ts`

```typescript
export { API_CONFIG, APP_CONFIG } from './constants';
export { ENV } from './env';
```

---

### 📁 navigation/

#### `navigation/AppNavigator.tsx`

```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainNavigator } from '../../modules/main';
import { AuthNavigator } from './AuthNavigator';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Main" component={MainNavigator} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
    </Stack.Navigator>
  );
};
```

#### `navigation/AuthNavigator.tsx`

```typescript
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../../modules/authentication/screens';
// import { LoginScreen, RegisterScreen, ForgotPasswordScreen } from '../../modules/authentication/screens';
import type { AuthStackParamList } from './types';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
};
```

#### `navigation/types.ts`

```typescript
import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Param List
export type MainTabParamList = {
  Home: undefined;
  Notifications: undefined;
  Settings: undefined;
  Account: undefined;
};

// Root Stack Param List
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// Helper types for navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
```

#### `navigation/linking.ts`

```typescript
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['projeto56300://', 'https://projeto56300.com'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Register: 'register',
          ForgotPassword: 'forgot-password',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Account: 'account',
          Settings: 'settings',
          Notifications: 'notifications',
        },
      },
    },
  },
};
```

---

### 📁 store/

#### `store/index.ts`

```typescript
import { configureStore } from '@reduxjs/toolkit';
import authSliceReducer from '../../modules/authentication/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### `store/rootReducer.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `store/middleware.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 types/

#### `types/api.ts`

```typescript
export interface ApiResponse<T = any> {
  http_code: number;
  status: 'success' | 'error';
  message: string;
  api_data: {
    version: string;
    date_time: string;
  };
  data: T;
  metadata: {
    url: {
      base_url: string;
      get_uri: string[];
    };
  };
}

export interface ValidationError {
  validation: Record<string, string>;
}
```

#### `types/global.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `types/navigation.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 styles/

#### `styles/colors.ts`

```typescript
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  danger: '#FF3B30',
  warning: '#FF9500',
  info: '#5AC8FA',
  light: '#F2F2F7',
  dark: '#1C1C1E',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#8E8E93',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  shadow: '#000000',
};
```

#### `styles/spacing.ts`

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};
```

#### `styles/typography.ts`

```typescript
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
  },
};
```

#### `styles/index.ts`

```typescript
export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
```

#### `styles/theme.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 hooks/

#### `hooks/useApi.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `hooks/useAsyncStorage.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `hooks/useNetworkState.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 providers/

#### `providers/ApiProvider.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `providers/ThemeProvider.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `providers/index.tsx`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 utils/

#### `utils/validation.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/storage.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/formatters.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/helpers.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

## Arquivos Implementados vs Vazios

### ✅ Arquivos Implementados (13)

- `api/client.ts` - Cliente HTTP com métodos POST e GET
- `api/interceptors.ts` - Sistema de interceptors (request, response, error)
- `config/constants.ts` - Configurações de API e App
- `config/env.ts` - Variáveis de ambiente
- `config/index.ts` - Barrel export de config
- `navigation/AppNavigator.tsx` - Navegador raiz
- `navigation/AuthNavigator.tsx` - Navegador de autenticação
- `navigation/types.ts` - Tipagens de navegação
- `navigation/linking.ts` - Deep linking
- `store/index.ts` - Redux store configurado
- `types/api.ts` - Tipos de API Response
- `styles/colors.ts` - Paleta de cores
- `styles/spacing.ts` - Sistema de espaçamento
- `styles/typography.ts` - Sistema de tipografia
- `styles/index.ts` - Barrel export de estilos

### ⚠️ Arquivos Vazios (15)

- `api/types.ts`
- `hooks/useApi.ts`
- `hooks/useAsyncStorage.ts`
- `hooks/useNetworkState.ts`
- `providers/ApiProvider.tsx`
- `providers/ThemeProvider.tsx`
- `providers/index.tsx`
- `store/rootReducer.ts`
- `store/middleware.ts`
- `types/global.ts`
- `types/navigation.ts`
- `utils/validation.ts`
- `utils/storage.ts`
- `utils/formatters.ts`
- `utils/helpers.ts`
- `styles/theme.ts`

---

## Próximos Passos Sugeridos

1. **Implementar Hooks Customizados**

   - `useApi`: Hook para facilitar chamadas de API
   - `useAsyncStorage`: Hook para gerenciar AsyncStorage
   - `useNetworkState`: Hook para monitorar conexão de rede

2. **Criar Providers**

   - `ApiProvider`: Context para estado global de API
   - `ThemeProvider`: Context para tema dark/light

3. **Implementar Utils**

   - `validation.ts`: Funções de validação (email, CPF, etc.)
   - `formatters.ts`: Formatadores (moeda, data, telefone, etc.)
   - `helpers.ts`: Funções auxiliares gerais
   - `storage.ts`: Wrapper para AsyncStorage

4. **Completar Store**
   - `rootReducer.ts`: Combinar reducers de todos os módulos
   - `middleware.ts`: Adicionar middlewares customizados (logger, etc.)

---

**Documento gerado em:** 2026-01-23
**Versão da aplicação:** 1.0.0
**Ambiente:** Development
