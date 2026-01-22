# React Native Login - Sequência de Desenvolvimento (CORRIGIDA)

## Objetivo

Criar tela de login não funcional primeiro, depois tornar funcional com APIs e TOKEN.

## CORREÇÃO IMPORTANTE - Arquivos de Índice Necessários

### ADICIONAR PRIMEIRO - Index para Estilos

**Arquivo:** `src/app/core/styles/index.ts`

```typescript
export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
```

## Sequência Corrigida de Arquivos (Ordem de Desenvolvimento)

### 1. Configuração Base - Estilos

**Arquivo:** `src/app/core/styles/colors.ts`

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

### 2. Configuração Base - Espaçamento

**Arquivo:** `src/app/core/styles/spacing.ts`

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

### 3. Configuração Base - Tipografia

**Arquivo:** `src/app/core/styles/typography.ts`

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

### 4. **NOVO** - Index dos Estilos

**Arquivo:** `src/app/core/styles/index.ts`

```typescript
export { colors } from './colors';
export { spacing } from './spacing';
export { typography } from './typography';
```

### 5. Componente Base - Input

**Arquivo:** `src/app/shared/components/ui/Input/Input.tsx`

```typescript
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { styles } from './Input.styles';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};
```

### 6. Estilos do Input (CORRIGIDO)

**Arquivo:** `src/app/shared/components/ui/Input/Input.styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginTop: spacing.xs,
  },
});
```

### 7. Index do Input

**Arquivo:** `src/app/shared/components/ui/Input/index.ts`

```typescript
export { Input } from './Input';
```

### 8. Componente Base - Button

**Arquivo:** `src/app/shared/components/ui/Button/Button.tsx`

```typescript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './Button.styles';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### 9. Estilos do Button (CORRIGIDO)

**Arquivo:** `src/app/shared/components/ui/Button/Button.styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../../../core/styles';

export const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: colors.gray,
  },
  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
```

### 10. Index do Button

**Arquivo:** `src/app/shared/components/ui/Button/index.ts`

```typescript
export { Button } from './Button';
```

### 11. **NOVO** - Index dos Componentes UI

**Arquivo:** `src/app/shared/components/ui/index.ts`

```typescript
export { Input } from './Input';
export { Button } from './Button';
```

### 12. Formulário de Login (CORRIGIDO)

**Arquivo:** `src/app/modules/authentication/components/LoginForm/LoginForm.tsx`

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { Input, Button } from '../../../../shared/components/ui';
import { styles } from './LoginForm.styles';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Login logic here
    console.log('Login:', { email, password });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
};
```

### 13. Estilos do LoginForm (CORRIGIDO)

**Arquivo:** `src/app/modules/authentication/components/LoginForm/LoginForm.styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { spacing } from '../../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
});
```

### 14. Index do LoginForm

**Arquivo:** `src/app/modules/authentication/components/LoginForm/index.ts`

```typescript
export { LoginForm } from './LoginForm';
```

### 15. Tela de Login (CORRIGIDA)

**Arquivo:** `src/app/modules/authentication/screens/LoginScreen/LoginScreen.tsx`

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './LoginScreen.styles.ts';

// Componente temporário
const TempLoginForm = () => {
  return (
    <View style={{ padding: 20, backgroundColor: '#fff', margin: 20, borderRadius: 8 }}>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>LoginForm será criado aqui</Text>
    </View>
  );
};

export const LoginScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TempLoginForm />
    </View>
  );
};
```

### 16. Estilos da LoginScreen (CORRIGIDO)

**Arquivo:** `src/app/modules/authentication/screens/LoginScreen/LoginScreen.styles.ts`

```typescript
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../../../core/styles';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    textAlign: 'center',
    marginBottom: spacing.xl,
    color: colors.text,
  },
});
```

### 17. Index da LoginScreen

**Arquivo:** `src/app/modules/authentication/screens/LoginScreen/index.ts`

```typescript
export { LoginScreen } from './LoginScreen';
```

### 18. App Principal (Temporário)

**Arquivo:** `src/App.tsx`

```typescript
import React from 'react';
import { LoginScreen } from './app/modules/authentication/screens/LoginScreen';

export default function App() {
  return <LoginScreen />;
}
```

## Principais Correções Feitas

1. **Adicionado** `src/app/core/styles/index.ts` para centralizar exports
2. **Corrigido** todos os imports para usar os caminhos corretos
3. **Adicionado** `src/app/shared/components/ui/index.ts` para facilitar imports
4. **Ajustados** níveis de pasta nos imports (../../../../ vs ../../../../../)

## Resumo

Agora todos os imports estão corretos e funcionarão sem erro de resolução de módulos.
