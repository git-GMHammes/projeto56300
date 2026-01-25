# README - Pasta Shared (Componentes Compartilhados)

## Índice

1. [Estrutura de Pastas](#estrutura-de-pastas)
2. [Fluxo de Uso](#fluxo-de-uso)
3. [Código Fonte Completo](#código-fonte-completo)

---

## Estrutura de Pastas

```
src/app/shared/
│
├── components/                           # Componentes reutilizáveis
│   ├── ui/                               # Componentes de interface básicos
│   │   ├── Button/                       # Botão customizado
│   │   │   ├── Button.tsx                # Componente de botão
│   │   │   ├── Button.styles.ts          # Estilos do botão
│   │   │   └── index.ts                  # Barrel export
│   │   │
│   │   ├── Input/                        # Input customizado
│   │   │   ├── Input.tsx                 # Componente de input
│   │   │   ├── Input.styles.ts           # Estilos do input
│   │   │   └── index.ts                  # Barrel export
│   │   │
│   │   ├── Loading/                      # Componente de loading
│   │   │   ├── Loading.tsx               # Componente de loading
│   │   │   ├── Loading.styles.ts         # Estilos do loading
│   │   │   └── index.ts                  # Barrel export
│   │   │
│   │   ├── Modal/                        # Modal customizado (placeholder)
│   │   │   ├── Modal.tsx                 # (vazio)
│   │   │   ├── Modal.styles.ts           # (vazio)
│   │   │   └── index.ts                  # (vazio)
│   │   │
│   │   └── index.ts                      # Barrel export de UI
│   │
│   ├── forms/                            # Componentes de formulário
│   │   ├── FormInput/                    # Input de formulário (placeholder)
│   │   │   ├── FormInput.tsx             # (vazio)
│   │   │   ├── FormInput.styles.ts       # (vazio)
│   │   │   └── index.ts                  # (vazio)
│   │   │
│   │   ├── FormError/                    # Mensagem de erro (placeholder)
│   │   │   ├── FormError.tsx             # (vazio)
│   │   │   ├── FormError.styles.ts       # (vazio)
│   │   │   └── index.ts                  # (vazio)
│   │   │
│   │   └── index.ts                      # Barrel export de forms
│   │
│   ├── layout/                           # Componentes de layout
│   │   ├── Container/                    # Container wrapper (placeholder)
│   │   │   ├── Container.tsx             # (vazio)
│   │   │   ├── Container.styles.ts       # (vazio)
│   │   │   └── index.ts                  # (vazio)
│   │   │
│   │   ├── Header/                       # Header customizado (placeholder)
│   │   │   ├── Header.tsx                # (vazio)
│   │   │   ├── Header.styles.ts          # (vazio)
│   │   │   └── index.ts                  # (vazio)
│   │   │
│   │   └── index.ts                      # Barrel export de layout
│   │
│   └── index.ts                          # Barrel export geral de componentes
│
├── hooks/                                # Custom hooks compartilhados
│   ├── useForm.ts                        # Hook para gerenciar formulários (vazio)
│   ├── useDebounce.ts                    # Hook de debounce (vazio)
│   ├── useKeyboard.ts                    # Hook para teclado (vazio)
│   └── index.ts                          # Barrel export
│
└── utils/                                # Utilitários compartilhados
    ├── validation/                       # Validações
    │   ├── schemas.ts                    # Schemas de validação (vazio)
    │   ├── rules.ts                      # Regras de validação (vazio)
    │   └── index.ts                      # Barrel export
    │
    ├── formatters/                       # Formatadores
    │   ├── date.ts                       # Formatadores de data (vazio)
    │   ├── currency.ts                   # Formatadores de moeda (vazio)
    │   └── index.ts                      # Barrel export
    │
    └── index.ts                          # Barrel export geral
```

---

## Fluxo de Uso

### 1. Componentes UI - Como Usar

#### Button (Botão Customizado)

```typescript
import { Button } from '@shared/components';

<Button title="Entrar" onPress={handleLogin} disabled={loading} />;
```

**Fluxo Interno:**

```
Component
  └─> <Button title="..." onPress={...} disabled={false} />
       └─> TouchableOpacity
            ├─> Aplica styles.button
            ├─> Se disabled=true, aplica styles.disabled
            └─> onPress() ao clicar
```

#### Input (Campo de Texto)

```typescript
import { Input } from '@shared/components';

<Input
  label="Email"
  placeholder="Digite seu email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>;
```

**Fluxo Interno:**

```
Component
  └─> <Input label="Email" value={...} error="..." />
       ├─> Renderiza <Text> com label (se fornecido)
       ├─> Renderiza <TextInput>
       │    ├─> Aplica styles.input
       │    └─> Se error existe, aplica styles.inputError (borda vermelha)
       └─> Renderiza <Text> com mensagem de erro (se error existe)
```

#### Loading (Indicador de Carregamento)

```typescript
import { Loading } from '@shared/components';

<Loading message="Carregando dados..." />;
```

**Fluxo Interno:**

```
Component
  └─> <Loading message="..." />
       ├─> Container centralizado
       ├─> ActivityIndicator (spinner nativo)
       └─> Mensagem de texto
```

### 2. Sistema de Importação (Barrel Exports)

```
Consumidor
  └─> import { Button, Input, Loading } from '@shared/components'
       └─> shared/components/index.ts
            └─> export * from './ui'
                 └─> shared/components/ui/index.ts
                      ├─> export { Button } from './Button'
                      ├─> export { Input } from './Input'
                      └─> export { Loading } from './Loading'
```

### 3. Integração com Core Styles

```
Button.styles.ts
  └─> import { colors, spacing } from '../../../../core/styles'
       ├─> colors.primary (#007AFF)
       ├─> colors.white (#FFFFFF)
       ├─> colors.gray (#8E8E93)
       └─> spacing.md (16)
```

### 4. Fluxo de Validação (Planejado)

```
Form Component
  └─> useForm() hook
       ├─> Gerencia valores dos campos
       ├─> Gerencia erros
       └─> validate() usando schemas/rules
            └─> Retorna objeto de erros
                 └─> Exibe em <FormError> ou <Input error={...} />
```

### 5. Fluxo de Formatação (Planejado)

```
Component
  └─> import { currency, date } from '@shared/utils'
       ├─> currency.format(1000) → "R$ 1.000,00"
       └─> date.format(new Date()) → "23/01/2026"
```

---

## Código Fonte Completo

### 📁 components/ui/Button/

#### `components/ui/Button/Button.tsx`

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

#### `components/ui/Button/Button.styles.ts`

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

#### `components/ui/Button/index.ts`

```typescript
export { Button } from './Button';
```

---

### 📁 components/ui/Input/

#### `components/ui/Input/Input.tsx`

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

#### `components/ui/Input/Input.styles.ts`

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

#### `components/ui/Input/index.ts`

```typescript
export { Input } from './Input';
```

---

### 📁 components/ui/Loading/

#### `components/ui/Loading/Loading.tsx`

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

#### `components/ui/Loading/Loading.styles.ts`

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

#### `components/ui/Loading/index.ts`

```typescript
export { Loading } from './Loading';
```

---

### 📁 components/ui/Modal/

#### `components/ui/Modal/Modal.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/ui/Modal/Modal.styles.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/ui/Modal/index.ts`

```typescript
// Arquivo vazio - 1 linha
```

---

### 📁 components/ui/

#### `components/ui/index.ts`

```typescript
export { Button } from './Button';
export { Input } from './Input';
export { Loading } from './Loading';
export { Modal } from './Modal';

export type { ButtonProps } from './Button/Button.types';
export type { InputProps } from './Input/Input.types';
export type { LoadingProps } from './Loading/Loading.types';
export type { ModalProps } from './Modal/Modal.types';
```

---

### 📁 components/forms/

#### `components/forms/FormInput/FormInput.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/FormInput/FormInput.styles.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/FormInput/index.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/FormError/FormError.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/FormError/FormError.styles.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/FormError/index.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/forms/index.ts`

```typescript
export { FormInput } from './FormInput';
export { FormError } from './FormError';

export type { FormInputProps } from './FormInput/FormInput.types';
export type { FormErrorProps } from './FormError/FormError.types';
```

---

### 📁 components/layout/

#### `components/layout/Container/Container.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/Container/Container.styles.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/Container/index.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/Header/Header.tsx`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/Header/Header.styles.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/Header/index.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `components/layout/index.ts`

```typescript
// export { Container } from './Container'; // TODO: Criar componente
// export { Header } from './Header'; // TODO: Criar componente

// export type { ContainerProps } from './Container/Container.types';
// export type { HeaderProps } from './Header/Header.types';
```

---

### 📁 components/

#### `components/index.ts`

```typescript
// Forms
export * from './forms';

// Layout
// export * from './layout';

// UI
export * from './ui';

// Direct exports for convenience (comentado até criar componentes)
// export { FormInput, FormError } from './forms';
// export { Container, Header } from './layout';
// export { Button, Input, Loading, Modal } from './ui';
```

---

### 📁 hooks/

#### `hooks/useForm.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `hooks/useDebounce.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `hooks/useKeyboard.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `hooks/index.ts`

```typescript
export { useDebounce } from './useDebounce';
export { useForm } from './useForm';
export { useKeyboard } from './useKeyboard';
```

---

### 📁 utils/validation/

#### `utils/validation/schemas.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/validation/rules.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/validation/index.ts`

```typescript
export { rules } from './rules';
export { schemas } from './schemas';
```

---

### 📁 utils/formatters/

#### `utils/formatters/date.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/formatters/currency.ts`

```typescript
// Arquivo vazio - 1 linha
```

#### `utils/formatters/index.ts`

```typescript
export { currency } from './currency';
export { date } from './date';
```

---

### 📁 utils/

#### `utils/index.ts`

```typescript
export * from './formatters';
export * from './validation';

// Direct exports for convenience
export { currency, date } from './formatters';
export { rules, schemas } from './validation';
```

---

## Arquivos Implementados vs Vazios

### ✅ Arquivos Implementados (12)

**UI Components (9 arquivos)**

- `components/ui/Button/Button.tsx` - Botão customizado funcional
- `components/ui/Button/Button.styles.ts` - Estilos do botão
- `components/ui/Button/index.ts` - Barrel export
- `components/ui/Input/Input.tsx` - Input com label e erro
- `components/ui/Input/Input.styles.ts` - Estilos do input
- `components/ui/Input/index.ts` - Barrel export
- `components/ui/Loading/Loading.tsx` - Loading com mensagem
- `components/ui/Loading/Loading.styles.ts` - Estilos do loading
- `components/ui/Loading/index.ts` - Barrel export

**Barrel Exports (3 arquivos)**

- `components/ui/index.ts` - Export de todos os UI
- `components/forms/index.ts` - Export de forms
- `components/layout/index.ts` - Export de layout (comentado)
- `components/index.ts` - Export geral de componentes
- `hooks/index.ts` - Export de hooks
- `utils/validation/index.ts` - Export de validação
- `utils/formatters/index.ts` - Export de formatters
- `utils/index.ts` - Export geral de utils

### ⚠️ Arquivos Vazios (24)

**Modal (3 arquivos)**

- `components/ui/Modal/Modal.tsx`
- `components/ui/Modal/Modal.styles.ts`
- `components/ui/Modal/index.ts`

**FormInput (3 arquivos)**

- `components/forms/FormInput/FormInput.tsx`
- `components/forms/FormInput/FormInput.styles.ts`
- `components/forms/FormInput/index.ts`

**FormError (3 arquivos)**

- `components/forms/FormError/FormError.tsx`
- `components/forms/FormError/FormError.styles.ts`
- `components/forms/FormError/index.ts`

**Container (3 arquivos)**

- `components/layout/Container/Container.tsx`
- `components/layout/Container/Container.styles.ts`
- `components/layout/Container/index.ts`

**Header (3 arquivos)**

- `components/layout/Header/Header.tsx`
- `components/layout/Header/Header.styles.ts`
- `components/layout/Header/index.ts`

**Hooks (3 arquivos)**

- `hooks/useForm.ts`
- `hooks/useDebounce.ts`
- `hooks/useKeyboard.ts`

**Validation (2 arquivos)**

- `utils/validation/schemas.ts`
- `utils/validation/rules.ts`

**Formatters (2 arquivos)**

- `utils/formatters/date.ts`
- `utils/formatters/currency.ts`

---

## Componentes Implementados - Detalhes

### ✅ Button

**Props:**

- `title: string` - Texto do botão
- `onPress: () => void` - Função ao clicar
- `disabled?: boolean` - Desabilitar botão

**Estilos:**

- Cor primária (#007AFF)
- Border radius: 8px
- Padding: 16px
- Cor cinza quando disabled

**Uso:**

```typescript
<Button title="Entrar" onPress={handleLogin} disabled={loading} />
```

### ✅ Input

**Props:**

- `label?: string` - Label acima do input
- `placeholder?: string` - Placeholder do campo
- `value: string` - Valor controlado
- `onChangeText: (text: string) => void` - Callback de mudança
- `secureTextEntry?: boolean` - Para senha
- `error?: string` - Mensagem de erro

**Estilos:**

- Borda normal: #C6C6C8
- Borda com erro: #FF3B30 (vermelho)
- Mensagem de erro em vermelho abaixo do campo

**Uso:**

```typescript
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

### ✅ Loading

**Props:**

- `message?: string` - Mensagem (padrão: "Carregando...")

**Estilos:**

- Centralizado na tela
- ActivityIndicator azul
- Mensagem abaixo do spinner

**Uso:**

```typescript
<Loading message="Carregando usuário..." />
```

---

## Componentes Pendentes (TODO)

### ⚠️ Modal

**Funcionalidades Planejadas:**

- Overlay semi-transparente
- Conteúdo centralizado
- Botões de ação
- Animação de abertura/fechamento
- Fechar ao tocar fora

### ⚠️ FormInput

**Funcionalidades Planejadas:**

- Input específico para formulários
- Integração com useForm
- Validação automática
- Máscaras de input (CPF, telefone, etc.)

### ⚠️ FormError

**Funcionalidades Planejadas:**

- Exibir erros de validação
- Lista de erros múltiplos
- Animação de entrada

### ⚠️ Container

**Funcionalidades Planejadas:**

- Wrapper padrão para telas
- Padding consistente
- Background padrão
- Safe area handling

### ⚠️ Header

**Funcionalidades Planejadas:**

- Header customizado
- Título centralizado
- Botão de voltar
- Ações à direita

---

## Hooks Pendentes (TODO)

### ⚠️ useForm

**Funcionalidades Planejadas:**

```typescript
const { values, errors, handleChange, handleSubmit } = useForm({
  initialValues: { email: '', password: '' },
  validationSchema: loginSchema,
  onSubmit: async values => {
    await login(values);
  },
});
```

### ⚠️ useDebounce

**Funcionalidades Planejadas:**

```typescript
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    searchAPI(debouncedSearch);
  }
}, [debouncedSearch]);
```

### ⚠️ useKeyboard

**Funcionalidades Planejadas:**

```typescript
const { keyboardHeight, isKeyboardVisible } = useKeyboard();

// Ajustar layout quando teclado aparece
```

---

## Utils Pendentes (TODO)

### ⚠️ Validation Rules

**Funcionalidades Planejadas:**

```typescript
import { rules } from '@shared/utils';

rules.email('teste@email.com'); // true/false
rules.cpf('123.456.789-00'); // true/false
rules.phone('(11) 98765-4321'); // true/false
rules.minLength('senha', 6); // true/false
```

### ⚠️ Validation Schemas

**Funcionalidades Planejadas:**

```typescript
import { schemas } from '@shared/utils';

const loginSchema = schemas.object({
  user: schemas.string().required('Usuário obrigatório'),
  password: schemas.string().min(6, 'Mínimo 6 caracteres'),
});

loginSchema.validate({ user: 'admin', password: '123' });
```

### ⚠️ Date Formatters

**Funcionalidades Planejadas:**

```typescript
import { date } from '@shared/utils';

date.format(new Date()); // "23/01/2026"
date.formatTime(new Date()); // "14:30"
date.formatDateTime(new Date()); // "23/01/2026 14:30"
date.fromNow(pastDate); // "há 2 horas"
date.isPast(date); // true/false
date.isFuture(date); // true/false
```

### ⚠️ Currency Formatters

**Funcionalidades Planejadas:**

```typescript
import { currency } from '@shared/utils';

currency.format(1000); // "R$ 1.000,00"
currency.formatCents(100000); // "R$ 1.000,00" (centavos para reais)
currency.parse('R$ 1.000,00'); // 1000
```

---

## Como Usar os Componentes

### Exemplo Completo - Tela de Login

```typescript
import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Input, Loading } from '@shared/components';

export const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    setLoading(true);
    // Lógica de login
    setLoading(false);
  };

  if (loading) {
    return <Loading message="Entrando..." />;
  }

  return (
    <View style={{ padding: 20 }}>
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />

      <Input
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />

      <Button title="Entrar" onPress={handleLogin} disabled={loading} />
    </View>
  );
};
```

### Exemplo - Usando com useForm (Quando Implementado)

```typescript
import { useForm } from '@shared/hooks';
import { Button, Input } from '@shared/components';
import { loginSchema } from '@shared/utils';

export const LoginForm = () => {
  const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async values => {
      await authApi.login(values);
    },
  });

  return (
    <>
      <Input
        label="Email"
        value={values.email}
        onChangeText={handleChange('email')}
        error={errors.email}
      />

      <Input
        label="Senha"
        value={values.password}
        onChangeText={handleChange('password')}
        secureTextEntry
        error={errors.password}
      />

      <Button title="Entrar" onPress={handleSubmit} disabled={isSubmitting} />
    </>
  );
};
```

---

## Integração com Core

Todos os componentes shared utilizam o sistema de estilos do `core`:

```typescript
import { colors, spacing } from '../../../../core/styles';

// Cores disponíveis:
colors.primary; // #007AFF (azul)
colors.secondary; // #5856D6 (roxo)
colors.success; // #34C759 (verde)
colors.danger; // #FF3B30 (vermelho)
colors.warning; // #FF9500 (laranja)
colors.white; // #FFFFFF
colors.black; // #000000
colors.gray; // #8E8E93
colors.text; // #1C1C1E
colors.border; // #C6C6C8

// Espaçamentos disponíveis:
spacing.xs; // 4
spacing.sm; // 8
spacing.md; // 16
spacing.lg; // 24
spacing.xl; // 32
spacing.xxl; // 40
```

---

## Próximos Passos

### Alta Prioridade

1. **Implementar Modal** - Componente essencial para dialogs e confirmações
2. **Implementar useForm** - Hook fundamental para gerenciar formulários
3. **Implementar Validações** - Rules e schemas para validação de dados

### Média Prioridade

4. **Implementar FormInput e FormError** - Melhorar UX de formulários
5. **Implementar Formatters** - date e currency para exibição de dados
6. **Implementar useDebounce** - Performance em buscas

### Baixa Prioridade

7. **Implementar Container e Header** - Componentes de layout
8. **Implementar useKeyboard** - Melhorar UX com teclado
9. **Adicionar mais variantes aos componentes** (Button variants: primary, secondary, outline, etc.)

---

**Documento gerado em:** 2026-01-23
**Versão da aplicação:** 1.0.0
**Pasta:** shared (Componentes Compartilhados)
**Status:** 3 componentes UI funcionais (Button, Input, Loading) - Restante pendente
