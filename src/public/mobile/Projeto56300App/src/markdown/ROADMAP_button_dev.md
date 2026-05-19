# ROADMAP — Botão DEV (DebugPanel)

> Documento de referência para desenvolvimento e manutenção do botão DEV.
> Público-alvo: desenvolvedor júnior.

---

## O que é o botão DEV?

É um **botão flutuante âmbar (FAB)** que aparece no canto inferior direito da tela
**apenas quando `APP_ENV = 'development'`**. Ao tocar nele, abre um bottom sheet
com as variáveis de configuração globais do app (URL da API, versão, ambiente, etc.).

Serve exclusivamente para debug em desenvolvimento local. Em staging e produção
o componente retorna `null` — ou seja, não existe na tela e não ocupa nenhum recurso.

---

## Visão geral em diagrama

```
App.tsx
└── <ThemeProvider>
    └── <NavigationContainer>
    │   └── <RootNavigator />          ← telas do app
    └── <DebugPanel />                 ← botão DEV (fora do navigator)
```

O `DebugPanel` é renderizado **fora** do `RootNavigator`, direto no `App.tsx`.
Isso garante que o botão flutua sobre qualquer tela, sem precisar ser importado
em cada feature.

---

## Arquivos envolvidos

| Arquivo                                                                             | Papel                                   |
| ----------------------------------------------------------------------------------- | --------------------------------------- |
| [`src/app/App.tsx`](../app/App.tsx)                                                 | Monta o `<DebugPanel />` uma única vez  |
| [`src/shared/ui/components/DebugPanel.tsx`](../shared/ui/components/DebugPanel.tsx) | Toda a lógica e UI do botão + modal     |
| [`src/core/config/env.ts`](../core/config/env.ts)                                   | Define as constantes exibidas no painel |

---

## Como funciona — passo a passo

### 1. O gate de ambiente

```typescript
// DebugPanel.tsx — linha 34
if (APP_ENV !== 'development') return null;
```

Se `APP_ENV` for `'staging'` ou `'production'`, o componente retorna imediatamente.
Não renderiza botão, não renderiza modal, não consome memória.

### 2. O botão flutuante (FAB)

```typescript
<TouchableOpacity
  style={s.fab}
  onPress={() => setVisible(true)}
  activeOpacity={0.8}
>
  <Text style={s.fabText}>DEV</Text>
</TouchableOpacity>
```

- Posição fixa: `bottom: 90` (Android) / `100` (iOS), `right: 16`
- Cor de fundo: `#f59e0b` (âmbar Tailwind)
- `zIndex: 9999` para ficar acima de qualquer elemento da tela
- `elevation: 8` para a sombra no Android

### 3. O modal bottom sheet

```typescript
<Modal visible={visible} transparent animationType="slide" ...>
  <TouchableOpacity style={s.overlay} ... onPress={() => setVisible(false)} />
  <View style={s.sheet}>
    {/* header + lista de variáveis + rodapé */}
  </View>
</Modal>
```

- `animationType="slide"` → entra deslizando de baixo
- Toque no overlay escuro fecha o modal
- `maxHeight: '75%'` → ocupa no máximo 75% da tela
- `ScrollView` interno permite rolar se houver muitas variáveis

### 4. Lista de variáveis

```typescript
// DebugPanel.tsx — linhas 21-27
const CONFIG_VARS: { label: string; value: string | number }[] = [
  { label: 'APP_ENV', value: APP_ENV },
  { label: 'APP_VERSION', value: APP_VERSION },
  { label: 'API_BASE_URL', value: API_BASE_URL },
  { label: 'API_TIMEOUT_MS', value: API_TIMEOUT_MS },
  { label: 'APP_CONTRACT_CODE', value: APP_CONTRACT_CODE },
];
```

Cada item dessa array vira uma linha no painel. O valor é **selecionável** pelo
usuário (`selectable` prop no `Text`), facilitando copiar a URL da API.

---

## Como adicionar uma nova variável ao painel

**Passo 1** — Declare a constante em `src/core/config/env.ts`:

```typescript
// env.ts
export const MINHA_NOVA_VAR = 'valor_qualquer';
```

**Passo 2** — Importe em `DebugPanel.tsx` (linha 10-15):

```typescript
import {
  APP_ENV,
  APP_VERSION,
  API_BASE_URL,
  API_TIMEOUT_MS,
  APP_CONTRACT_CODE,
  MINHA_NOVA_VAR, // ← adicionar aqui
} from '../../../core/config/env';
```

**Passo 3** — Acrescente à array `CONFIG_VARS` (linha 21-27):

```typescript
const CONFIG_VARS = [
  { label: 'APP_ENV', value: APP_ENV },
  { label: 'APP_VERSION', value: APP_VERSION },
  { label: 'API_BASE_URL', value: API_BASE_URL },
  { label: 'API_TIMEOUT_MS', value: API_TIMEOUT_MS },
  { label: 'APP_CONTRACT_CODE', value: APP_CONTRACT_CODE },
  { label: 'MINHA_NOVA_VAR', value: MINHA_NOVA_VAR }, // ← adicionar aqui
];
```

Pronto. Salvar e o Metro hot-reload já exibe a nova linha.

---

## Como remover uma variável do painel

Basta apagar a linha correspondente de `CONFIG_VARS`. Não precisa mexer em mais
nada — o painel renderiza dinamicamente o que estiver no array.

---

## Como mudar o ambiente (development / staging / production)

Editar **apenas** a linha 13 do `src/core/config/env.ts`:

```typescript
// development → Podman local (http://10.0.2.2:56300)
export const APP_ENV: AppEnv = 'development';

// staging → servidor QA (https://habilidade.com/projeto56300/src/public)
export const APP_ENV: AppEnv = 'staging';

// production → servidor de produção (mesmo URL do staging)
export const APP_ENV: AppEnv = 'production';
```

A URL da API (`API_BASE_URL`) é calculada automaticamente com base no `APP_ENV`:

```typescript
export const API_BASE_URL: string =
  (APP_ENV as string) === 'production' || (APP_ENV as string) === 'staging'
    ? 'https://habilidade.com/projeto56300/src/public'
    : 'http://10.0.2.2:56300';
```

**Efeito colateral imediato:** mudar para `staging` ou `production` faz o botão DEV
desaparecer, pois o gate `if (APP_ENV !== 'development') return null` é acionado.

---

## Estilo visual — onde está cada coisa

| Elemento                   | Estilo            | Valor atual              |
| -------------------------- | ----------------- | ------------------------ |
| Cor do botão FAB           | `backgroundColor` | `#f59e0b` (âmbar)        |
| Cor do texto FAB           | `color`           | `#000` (preto)           |
| Posição vertical (Android) | `bottom`          | `90`                     |
| Posição vertical (iOS)     | `bottom`          | `100`                    |
| Posição horizontal         | `right`           | `16`                     |
| Borda esquerda das linhas  | `borderLeftColor` | `#f59e0b` (âmbar)        |
| Fundo do modal             | `backgroundColor` | `c.surface` (tema atual) |

Para mudar a cor do botão, alterar `backgroundColor` e `borderLeftColor` em `makeStyles`.
Todas as outras medidas (`borderRadius`, `spacing`, `fontSize`) vêm de
`src/shared/theme/bootstrap.ts` — nunca usar número avulso, usar os tokens do Bootstrap.

---

## Comportamento de tema

O `DebugPanel` usa `useTheme()` para adaptar as cores do modal ao tema ativo:

```typescript
const { theme } = useTheme();
const s = useMemo(() => makeStyles(theme.colors), [theme]);
```

Os temas disponíveis estão em `src/shared/theme/global/`:

- `themeLight.ts`, `themeDark.ts`, `themeGreen.ts`, `themePurple.ts`,
  `themeBlue.ts`, `themeRed.ts`

O botão FAB em si tem cor fixa (`#f59e0b`) independente do tema — é intencional
para que ele seja sempre visível e identificável como ferramenta de debug.

---

## Estado interno do componente

O componente tem apenas **um estado**:

```typescript
const [visible, setVisible] = useState(false);
```

| Valor            | Situação                                      |
| ---------------- | --------------------------------------------- |
| `false` (padrão) | Modal fechado, só o botão FAB aparece         |
| `true`           | Modal aberto, overlay + bottom sheet visíveis |

Não há estado assíncrono, chamada de API nem efeito colateral. É um componente
puramente visual e síncrono.

---

## Onde NÃO usar o DebugPanel

- **Dentro de features** — ele é um utilitário global; não importar em screens individuais
- **Em telas de produção** — o gate de ambiente já impede, mas não contornar o gate
- **Para exibir dados de usuário logado** — dados sensíveis (token, senha, CPF) jamais
  devem aparecer em qualquer painel de debug

---

## Roadmap — o que pode ser adicionado futuramente

As seções abaixo descrevem melhorias possíveis, em ordem de prioridade sugerida.
Nenhuma delas está implementada ainda.

---

### FASE 1 — Informações de sessão (alta utilidade)

**O que seria:** exibir, abaixo das config vars, os dados do usuário logado em memória.

**Por que:** durante testes, é comum esquecer com qual usuário está logado ou qual
`tenant_id` está ativo. Exibir isso elimina idas e vindas ao login.

**Como implementar:**

```typescript
// 1. Importar o hook/store de sessão
import { useAuthSession } from '../../../features/auth/presentation/ui/hooks/useAuthSession'

// 2. Dentro do DebugPanel, ler os dados
const { user } = useAuthSession()

// 3. Adicionar seção "Sessão Ativa" no ScrollView
<Text style={s.sectionTitle}>Sessão Ativa</Text>
{user ? (
  <>
    <DebugRow label="user_id"    value={user.id} />
    <DebugRow label="user_name"  value={user.name} />
    <DebugRow label="tenant_id"  value={user.tenant_id} />
    <DebugRow label="role"       value={user.role} />
  </>
) : (
  <Text style={s.noSession}>Nenhuma sessão ativa</Text>
)}
```

**Arquivo a editar:** `DebugPanel.tsx`

---

### FASE 2 — Ações rápidas de debug (alta utilidade)

**O que seria:** botões dentro do painel para ações comuns de desenvolvimento.

**Por que:** economiza tempo em tarefas repetitivas durante o desenvolvimento.

**Ações sugeridas:**

| Ação                | O que faz                                                             |
| ------------------- | --------------------------------------------------------------------- |
| **Limpar sessão**   | Chama `StorageService.clear()` e navega para Login                    |
| **Copiar API URL**  | Coloca `API_BASE_URL` na área de transferência via `Clipboard`        |
| **Forçar erro 401** | Dispara um request inválido para testar o fluxo de expiração de token |
| **Trocar tenant**   | Input de texto para sobrescrever `tenant_id` em memória               |

**Como implementar o botão "Copiar URL":**

```typescript
import { Clipboard } from 'react-native';

<TouchableOpacity
  onPress={() => Clipboard.setString(API_BASE_URL)}
  style={s.actionBtn}
>
  <Text style={s.actionBtnText}>Copiar URL da API</Text>
</TouchableOpacity>;
```

**Arquivo a editar:** `DebugPanel.tsx`

---

### FASE 3 — Log de requisições HTTP (média utilidade)

**O que seria:** lista das últimas N chamadas HTTP feitas pelo app (URL, status, tempo).

**Por que:** evita a necessidade de abrir o Metro para ver logs de rede.

**Pré-requisito:** criar um interceptor no cliente HTTP (Axios ou fetch) que armazene
os logs em um store global (Zustand, Context ou variável de módulo).

**Estrutura sugerida do log:**

```typescript
type HttpLog = {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number;
  durationMs: number;
  timestamp: string;
};
```

**Arquivo novo necessário:** `src/core/http/HttpLogger.ts`
**Arquivo a editar:** `DebugPanel.tsx` (nova aba ou seção)

---

### FASE 4 — Painel de navegação (baixa prioridade)

**O que seria:** exibir a rota atual e o histórico de navegação.

**Por que:** útil ao depurar deep links ou fluxos de navegação complexos.

**Como implementar:** ler `navigation.getState()` dentro do componente usando
`useNavigation()` (quando disponível no contexto do `NavigationContainer`).

**Observação:** o `DebugPanel` está fora do `RootNavigator` em `App.tsx`, então
precisaria ser movido para dentro do navigator ou usar uma ref global de navegação.

---

## Checklist para alterar o DebugPanel

Antes de qualquer modificação, verificar:

- [ ] A mudança só afeta o comportamento em `APP_ENV = 'development'`
- [ ] Nenhum dado sensível (token, senha, CPF) é exibido
- [ ] O botão FAB continua flutuando acima de todos os elementos (`zIndex: 9999`)
- [ ] Cores e espaçamentos usam tokens de `Bootstrap` (não números avulsos)
- [ ] O componente continua retornando `null` fora de `development`
- [ ] Hot-reload funciona sem reiniciar o Metro

---

## Referências rápidas

| O que preciso                         | Onde fica                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------- |
| Mudar/adicionar variável de ambiente  | [`src/core/config/env.ts`](../core/config/env.ts)                                   |
| Editar visual do botão ou modal       | [`src/shared/ui/components/DebugPanel.tsx`](../shared/ui/components/DebugPanel.tsx) |
| Onde o botão é montado no app         | [`src/app/App.tsx`](../app/App.tsx) — linha 14                                      |
| Tokens de estilo (cores, espaçamento) | [`src/shared/theme/bootstrap.ts`](../shared/theme/bootstrap.ts)                     |
| Tipos de cores do tema                | [`src/shared/theme/global/types.ts`](../shared/theme/global/types.ts)               |
| Como funciona o ThemeProvider         | [`src/app/providers/ThemeProvider.tsx`](../app/providers/ThemeProvider.tsx)         |
