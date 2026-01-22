# React Native Login - API Integration

## Objetivo

Integrar a tela de login com API real para autenticação e gerenciamento de TOKEN.

## API Endpoint

```
POST https://www/codeigniter56300/src/public/api/v1/user-management/login
```

## Arquivos para Atualização/Criação (Ordem de Implementação)

### 1. Tipos da API - Response Types

**Arquivo:** `src/app/core/types/api.ts`

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

### 2. Tipos de Autenticação

**Arquivo:** `src/app/modules/authentication/types/auth.ts`

```typescript
export interface LoginRequest {
  user: string;
  password: string;
}

export interface User {
  id: string;
  user: string;
  last_login: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
```

### 3. Constants - API URL

**Arquivo:** `src/app/core/config/constants.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://www/codeigniter56300/src/public/api/v1',
  ENDPOINTS: {
    LOGIN: '/user-management/login',
  },
  TIMEOUT: 10000,
};
```

### 4. API Client Base

**Arquivo:** `src/app/core/api/client.ts`

```typescript
import { API_CONFIG } from '../config/constants';

class ApiClient {
  private baseURL = API_CONFIG.BASE_URL;

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error(`Erro de conexão ${error}`);
    }
  }
}

export const apiClient = new ApiClient();
```

### 5. Auth API Service

**Arquivo:** `src/app/modules/authentication/services/authApi.ts`

```typescript
import { API_CONFIG } from '../../../core/config/constants';

export const authApi = {
  async login(user: string, password: string) {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, password }),
      },
    );

    return await response.json();
  },
};
```

### 6. Token Storage Service

**Arquivo:** `src/app/modules/authentication/services/tokenService.ts`

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER_KEY = '@auth_user';

export const tokenService = {
  async saveToken(token: string): Promise<void> {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(TOKEN_KEY);
  },

  async saveUser(user: any): Promise<void> {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  async getUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  async clearAuth(): Promise<void> {
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  },
};
```

### 7. Auth Slice (Redux)

**Arquivo:** `src/app/modules/authentication/store/authSlice.ts`

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types/auth';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: state => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
```

### 8. useAuth Hook

**Arquivo:** `src/app/modules/authentication/hooks/useAuth.ts`

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authApi } from '../services/authApi';
import { tokenService } from '../services/tokenService';
import { LoginRequest } from '../types/auth';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading, error } = useSelector(
    (state: any) => state.auth,
  );

  const login = async (credentials: LoginRequest) => {
    try {
      dispatch(loginStart());

      const response = await authApi.login(
        credentials.user,
        credentials.password,
      );

      if (response.status === 'success') {
        // Salva token e usuário
        await tokenService.saveToken(response.data.token);
        await tokenService.saveUser(response.data.user);

        dispatch(
          loginSuccess({
            user: response.data.user,
            token: response.data.token,
          }),
        );

        return { success: true };
      } else {
        // Trata erros da API
        const errorMessage = response.data?.validation
          ? (Object.values(response.data.validation)[0] as string)
          : response.message;

        dispatch(loginFailure(errorMessage));
        return { success: false, error: errorMessage };
      }
      // eslint-disable-next-line no-catch-shadow, @typescript-eslint/no-shadow
    } catch (error) {
      const errorMessage = `Erro de conexão: ${error}. Tente novamente.`;
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  return {
    login,
    isAuthenticated,
    user,
    loading,
    error,
  };
};
```

### 9. Loading Component

**Arquivo:** `src/app/shared/components/ui/Loading/Loading.tsx`

```typescript
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from './Loading.styles';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Carregando...',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};
```

### 10. Loading Styles

**Arquivo:** `src/app/shared/components/ui/Loading/Loading.styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
});
```

### 11. LoginForm ATUALIZADO (Com API)

**Arquivo:** `src/app/modules/authentication/components/LoginForm/LoginForm.tsx`

```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { authApi } from '../../services/authApi';
import { styles } from './LoginForm.styles';

export const LoginForm: React.FC = () => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!user.trim()) {
      Alert.alert('Erro', 'Digite o usuário');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Erro', 'Digite a senha');
      return;
    }

    setLoading(true);

    try {
      const data = await authApi.login(user, password);

      if (data.status === 'success') {
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        console.log('Token:', data.data.token);
      } else {
        const errorMsg = data.data?.validation
          ? Object.values(data.data.validation)[0]
          : data.message;
        Alert.alert('Erro', errorMsg);
      }
    } catch (error) {
      Alert.alert('Erro', `Falha na conexão ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu usuário"
        value={user}
        onChangeText={setUser}
        editable={!loading}
      />

      <Text style={styles.label}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 12. Atualizar Exports dos Componentes UI

**Arquivo:** `src/app/shared/components/ui/index.ts`

```typescript
export { Input } from './Input';
export { Button } from './Button';
export { Loading } from './Loading';
```

### 13. Atualizar Loading Index

**Arquivo:** `src/app/shared/components/ui/Loading/index.ts`

```typescript
// Arquivo: src\app\README.md
```

## Funcionalidades Implementadas

### ✅ Validação de Campos

- Verifica se usuário e senha estão preenchidos
- Exibe erros específicos do servidor

### ✅ Estados da API

- **Loading**: Mostra indicador durante requisição
- **Success**: Salva token e dados do usuário
- **Error**: Mostra mensagem de erro específica

### ✅ Gerenciamento de Token

- Salva token no AsyncStorage
- Salva dados do usuário
- Gerencia estado global (Redux)

### ✅ Tratamento de Erros

- **422**: Campos obrigatórios
- **404**: Credenciais inválidas
- **Network**: Erro de conexão

### ✅ UX/UI

- Loading indicator durante requisição
- Botão desabilitado durante loading
- Alertas para feedback do usuário

## Dependências Necessárias

```bash
npm install @react-native-async-storage/async-storage
npm install @reduxjs/toolkit react-redux
```

## Próximos Passos

Após implementar estes arquivos, o login estará totalmente funcional com:

- Autenticação real via API
- Token salvo em memória
- Estados gerenciados pelo Redux
- Tratamento completo de erros
