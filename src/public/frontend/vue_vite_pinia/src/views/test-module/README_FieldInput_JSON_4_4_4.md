# RowLayout + FieldInput — Receita 4 / 4 / 4

Exemplo validado em `Free.vue` com **Row Factory + form-fields**.
Três colunas iguais, cada uma com cor própria, dentro de uma row com fundo e borda.

---

## JSON completo

```js
import { FieldInput } from '@/components/form-fields'
import { RowLayout }  from '@/components/row-factory'

const form = reactive({ nome: '', codigo: '', cidade: '' })

const grid = [
  {
    line: '1',
    wrapper_class: 'bg-primary-subtle border border-primary rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 4,
        class: 'bg-danger-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'nome', name: 'nome', label: 'Nome',
            modelValue: form.nome,
            required: true, allowNumbers: false, allowSpecial: false,
            placeholder: 'Apenas letras',
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-success-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'codigo', name: 'codigo', label: 'Código',
            modelValue: form.codigo,
            allowLetters: false, allowSpecial: false,
            placeholder: 'Apenas dígitos',
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-warning-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'cidade', name: 'cidade', label: 'Cidade',
            modelValue: form.cidade,
            options: ['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis'],
            placeholder: 'Digite ou escolha',
          },
        },
      },
    ],
  },
]
```

---

## Template — uma única linha

```vue
<RowLayout :grid="grid" />
```

---

## Anatomia das camadas de cor

```
┌─────────────────────────────────────────────────────┐  ← wrapper_class
│  bg-primary-subtle · border-primary · rounded · p-3 │
│                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │  ← col class
│  │ bg-danger-   │ │ bg-success-  │ │ bg-warning-  │ │
│  │ subtle       │ │ subtle       │ │ subtle       │ │
│  │              │ │              │ │              │ │
│  │ [FieldInput] │ │ [FieldInput] │ │ [FieldInput] │ │  ← component (sem cor)
│  └──────────────┘ └──────────────┘ └──────────────┘ │
└─────────────────────────────────────────────────────┘
```

---

## Regras desta receita

| Campo JSON       | Nível    | O que faz                                     |
|------------------|----------|-----------------------------------------------|
| `wrapper_class`  | Row      | Fundo + borda da linha inteira                |
| `row_classes`    | Row      | Classes Bootstrap do `<div class="row">`      |
| `class` (coluna) | Coluna   | Fundo + borda individual por coluna           |
| `content.class`  | Conteúdo | Estilo dentro da coluna (não usado aqui)      |
| `content.component` | Conteúdo | Componente Vue instanciado pela fábrica   |
| `content.props`  | Conteúdo | Props passadas ao componente                  |

> **Importante:** o `FieldInput` não recebe nenhuma classe de cor — o estilo fica
> sempre na camada da coluna, mantendo o visual padrão do Bootstrap nos campos.
