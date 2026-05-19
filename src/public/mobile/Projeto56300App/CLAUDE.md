# CLAUDE.md — Mobile React Native

---

> ## ⚠️ FLUXO DE PLANEJAMENTO OBRIGATÓRIO
>
> Este arquivo é complementar ao **CLAUDE.md raiz** do projeto.
> O fluxo de planejamento e os modelos de JSON são definidos lá e devem ser
> seguidos **à risca** em qualquer tarefa que envolva criar, editar ou excluir arquivos.
>
> **Regras completas:**
> `C:\laragon\www\php\habilidade\projeto56300\CLAUDE.md`
> → Seção: *"Fluxo de Trabalho Obrigatório — Planejamento e Registro"*
>
> **Modelo do plano principal** (`_plano.json` — com estimativa APF/IFPUG):
> `src/writable/claude/AAAAMMDDHHMMSS_nome_plano.json`
>
> **Modelo do registro pós-execução** (`_no_plano.json` — ações não planejadas):
> `src/writable/claude/AAAAMMDDHHMMSS_nome_no_plano.json`
>
> **Sequência obrigatória:**
> 1. Criar `_plano.json` com estimativa em Pontos de Função
> 2. Apresentar o plano e aguardar aprovação explícita
> 3. Executar somente o que foi aprovado
> 4. Se surgir algo não previsto → criar `_no_plano.json`

---

Lições críticas aprendidas após ~24h de depuração.
React Native 0.85 + Windows + Emulador x86_64.
**Ignorar qualquer item abaixo vai causar horas de luta desnecessária.**

---

## 1. ABI do Emulador — OBRIGATÓRIO `x86_64`

O emulador Pixel_8 (e qualquer AVD x86_64) **não roda APK compilado para `arm64-v8a`**.
Crash: `SoLoaderDSONotFoundError: couldn't find DSO to load: libreactnative.so`

**Arquivo:** `android/gradle.properties`
```
reactNativeArchitectures=x86_64
```
Nunca mudar para `arm64-v8a` enquanto usar emulador x86_64.
Para device físico ARM64, trocar para `arm64-v8a`.

---

## 2. Metro FallbackWatcher — Patch Obrigatório no Windows

O Gradle cria junctions com prefixo `\\?\` (extended-length paths) dentro de
`android/app/build/intermediates/incremental/`. O `FallbackWatcher` do Metro
trava ao tentar `lstat` nessas junctions (errno -4094, code UNKNOWN), impedindo
qualquer bundle de iniciar.

**Correção permanente em** `scripts/patch-modules.js` (roda via `postinstall`):
- Adiciona `error.code === "UNKNOWN"` como erro ignorável em
  `node_modules/metro-file-map/src/watchers/FallbackWatcher.js`

**Correção complementar em** `scripts/clean-build.js` (roda via `npm run start`):
- Deleta `android/app/build` e `android/build` antes de iniciar o Metro

**Nunca usar** `npx react-native start` diretamente — usar sempre `npm run start`.

---

## 3. Imports do `core/navigation` — Contar Níveis Corretamente

A biblioteca de navegação customizada (pure-JS, sem C++) está em:
`src/core/navigation/index.tsx`

Imports corretos a partir de `src/features/*/presentation/routes/`:
```typescript
// 4 níveis acima chega em src/
import { createNativeStackNavigator } from '../../../../core/navigation'
import type { NativeStackScreenProps } from '../../../../core/navigation'
```
**5 níveis (`../../../../../`) é ERRADO** — aponta para fora do `src/`.

---

## 4. RAM — Metro com `--max-workers 1`

Com emulador + Metro + Gradle simultâneos, a máquina trava (RAM insuficiente).
O script `npm run start` já inclui `--max-workers 1` permanentemente.
Bundle fica mais lento (~3-4 min) mas não congela o sistema.

---

## 5. Pacotes Nativos Removidos (compilação C++ — OOM)

Os pacotes abaixo foram **removidos permanentemente** por causarem LLVM OOM
durante NDK compilation (`clang++ 0x5AF — arquivo de paginação muito pequeno`):

| Pacote removido                             | Substituído por                        |
| ------------------------------------------- | -------------------------------------- |
| `react-native-screens`                      | `src/core/navigation/index.tsx`        |
| `react-native-safe-area-context`            | `SafeAreaView` do `react-native`       |
| `@react-navigation/native`                  | `src/core/navigation/index.tsx`        |
| `@react-navigation/native-stack`            | `src/core/navigation/index.tsx`        |
| `@react-native-async-storage/async-storage` | `src/core/services/StorageService.ts`  |

**Nunca reinstalar esses pacotes** sem antes resolver o limite de RAM/page file.

---

## 6. Sequência de Execução — 3 Terminais

```
TERMINAL 1  & "$env:LOCALAPPDATA\Android\Sdk\emulator\emulator.exe" -avd Pixel_8
            (aguarda tela inicial do Android)

TERMINAL 2  cd ...\Projeto56300App
            npm run start -- --reset-cache
            (aguarda "Dev server ready")

TERMINAL 3  adb reverse tcp:8081 tcp:8081
            cd ...\Projeto56300App
            $env:CMAKE_BUILD_PARALLEL_LEVEL = "1"
            npm run android
```

Após o primeiro `npm run android` instalar o APK, no dia a dia só precisar de
Terminal 1 + Terminal 2 + pressionar **R** no emulador.

Referência completa: `docs/txt/react_native/cmd.txt`

---

## 7. Android API 35 — Zona de Interceptação da Barra de Status

No Android 15 (API 35) com **edge-to-edge** ativo, o sistema intercepta toques
nos primeiros ~40-50dp do topo da tela para abrir a gaveta de notificações.
`StatusBar.currentHeight` reporta um valor **menor** que essa zona real.

**Sintoma:** botões tocáveis no topo da tela não disparam `onPress` — sem erro,
sem log, sem feedback visual. Botões mais abaixo funcionam normalmente.

**Correção permanente** em `src/core/navigation/index.tsx` — `SafeAreaView` customizado:
```typescript
const ANDROID_TOP_INSET =
  Platform.OS === 'android'
    ? Math.max((StatusBar.currentHeight ?? 24) + 16, 56)
    : 0
```
Mínimo de **56dp** garante que qualquer elemento interativo fique abaixo da zona
de interceptação, independente da densidade de tela ou versão do Android.

**Padrão de botão de voltar** — usar sempre `src/shared/ui/components/BackButton.tsx`:
- Componente `Pressable` (não `TouchableOpacity`) com `hitSlop` de 16dp em todos os lados
- `minHeight: 48` e `paddingVertical: 12`
- Posicionado **fora** do `ScrollView` (diretamente dentro do `SafeAreaView`)
- **Nunca colocar `BackButton` dentro de `ScrollView`** — o scroll pode interceptar o toque antes do botão

**Regra para novas telas com botão Voltar:**
```tsx
<SafeAreaView style={styles.safe}>
  <BackButton onPress={() => navigation.navigate(PATHS.TELA_ANTERIOR)} />
  {/* restante do conteúdo */}
  <KeyboardAvoidingView>
    <ScrollView>...</ScrollView>
  </KeyboardAvoidingView>
</SafeAreaView>
```

---

## 8. Dados Estáticos — Isolamento Obrigatório em JSON

**Regra absoluta:** nenhum dado estático deve ser declarado dentro de um componente, tela ou hook.
Arrays fixos, listas de opções, labels de menu, textos descritivos, configurações de UI — tudo vai em arquivo `.json` separado.

---

### Dois níveis de JSONs

| Nível | Localização | Quando usar |
|---|---|---|
| **Global** | `src/data/{dominio}/arquivo.json` | Dados compartilhados entre duas ou mais features |
| **Por feature** | `src/features/{modulo}/data/arquivo.json` | Dados exclusivos de um único módulo |

---

### Estrutura de diretórios

```
src/
├── data/                          ← JSONs globais
│   ├── navigation/
│   │   └── menu_user.json         ← menu contextual do usuário (global)
│   ├── ods/
│   │   ├── menu_ods.json          ← menu de navegação ODS
│   │   └── description.json       ← descrições longas dos ODS
│   └── message/
│       └── footer_message.json    ← abas da tela de mensagens
│
└── features/
    └── {modulo}/
        └── data/                  ← JSONs exclusivos do módulo
            └── form_fields.json   ← campos de formulário, opções de select, etc.
```

---

### Padrão errado vs. correto

**ERRADO — dado embutido no componente:**
```typescript
// src/features/estoque/presentation/screens/ProdutoForm.tsx
const categorias = [
  { label: 'Eletrônicos', value: 'eletronicos' },
  { label: 'Alimentos', value: 'alimentos' },
  { label: 'Vestuário', value: 'vestuario' },
]
```

**CORRETO — dado isolado em JSON e importado:**
```typescript
// src/features/estoque/data/categorias.json
[
  { "label": "Eletrônicos", "value": "eletronicos" },
  { "label": "Alimentos", "value": "alimentos" },
  { "label": "Vestuário", "value": "vestuario" }
]

// src/features/estoque/presentation/screens/ProdutoForm.tsx
import categorias from '../../data/categorias.json'
```

---

### Inventário dos JSONs existentes

| Arquivo | Nível | Conteúdo |
|---|---|---|
| `src/data/ods/menu_ods.json` | Global | 20 itens de navegação ODS (Home, ODS 1–18, Login, Messaging) |
| `src/data/navigation/menu_user.json` | Global | Menu contextual: Login, Perfil, Home, Logout com `showWhen` |
| `src/data/ods/description.json` | Global | 18 ODS com `key`, `title`, `description` e `image` |
| `src/data/messaging/footer_message.json` | Global | 3 abas de mensagens: Mural, Mensagens Diretas, Grupos |

---

### Regra de normalização

Ao trabalhar em qualquer arquivo que contenha dados estáticos embutidos:
1. Extrair os dados para o JSON correspondente (global ou por feature) **antes** de qualquer nova implementação
2. Substituir a declaração inline pelo import do JSON
3. Nunca criar novas telas, formulários ou componentes com dados estáticos inline
