# test-module — Laboratório de Combinações

Receitas validadas de **RowLayout** (row-factory) + **FieldInput** (form-fields).
Cada receita é um JSON completo, pronto para copiar e usar.

---

## Índice de receitas

| # | Arquivo / Seção | Layout | Destaques |
|---|----------------|--------|-----------|
| 1 | [README_FieldInput_JSON_4_4_4.md](README_FieldInput_JSON_4_4_4.md) | 4 / 4 / 4 | Row com fundo, colunas com cores individuais |
| 2 | [Receita 2](#receita-2--row-colorida-colunas-neutras-6--6) | 6 / 6 | Row colorida, colunas neutras |
| 3 | [Receita 3](#receita-3--colunas-coloridas-row-neutra-4--4--4) | 4 / 4 / 4 | Colunas coloridas, row neutra |
| 4 | [Receita 4](#receita-4--duas-linhas-8--4-e-3--3--3--3) | 8/4 + 3/3/3/3 | Dois layouts diferentes em sequência |
| 5 | [Receita 5](#receita-5--multi-breakpoint-responsivo) | sm/md/lg | Responsividade completa |
| 6 | [Receita 6](#receita-6--campos-com-acesso-controlado) | 4 / 4 / 4 | readonly, disabled, required combinados |
| 7 | [Receita 7](#receita-7--tipos-diferentes-de-input) | 3/3/3/3 | text, email, password, number |
| 8 | [Receita 8](#receita-8--datalist--sugestões) | 6 / 6 | Campo livre com sugestões via datalist |

---

## Props completas do FieldInput

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `id` | String | — | **Obrigatório.** Identificador do campo |
| `name` | String | — | **Obrigatório.** Nome do campo no form |
| `modelValue` | String | `''` | Valor vinculado (v-model interno) |
| `label` | String | `''` | Texto do `<label>` |
| `placeholder` | String | `''` | Texto de dica no input |
| `type` | String | `'text'` | `text` `email` `password` `number` `search` `tel` `url` `hidden` |
| `required` | Boolean | `false` | Campo obrigatório |
| `readonly` | Boolean | `false` | Somente leitura |
| `disabled` | Boolean | `false` | Desabilitado |
| `allowLetters` | Boolean | `true` | Permite letras |
| `allowNumbers` | Boolean | `true` | Permite números |
| `allowSpecial` | Boolean | `true` | Permite caracteres especiais |
| `options` | Array | `[]` | Lista de sugestões (datalist) |
| `validateOnMount` | Boolean | `false` | Valida ao renderizar, sem interação |
| `labelClass` | String | `'form-label fw-semibold'` | Classes do `<label>` |
| `inputClass` | String | `'form-control'` | Classes do `<input>` |
| `wrapperClass` | String | `'mb-3'` | Classes do wrapper do campo |

---

## Receita 2 — Row colorida, colunas neutras (6 / 6)

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-info-subtle border border-info rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 6,
        content: {
          component: FieldInput,
          props: {
            id: 'email', name: 'email', label: 'E-mail',
            type: 'email',
            modelValue: form.email,
            placeholder: 'nome@empresa.com',
            required: true,
          },
        },
      },
      {
        'col-md': 6,
        content: {
          component: FieldInput,
          props: {
            id: 'telefone', name: 'telefone', label: 'Telefone',
            type: 'tel',
            modelValue: form.telefone,
            placeholder: '(51) 99999-9999',
            allowLetters: false,
            allowSpecial: false,
          },
        },
      },
    ],
  },
]
```

---

## Receita 3 — Colunas coloridas, row neutra (4 / 4 / 4)

```js
const grid = [
  {
    line: '1',
    row_classes: 'row g-3 mb-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 4,
        class: 'bg-primary-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'nome', name: 'nome', label: 'Nome',
            modelValue: form.nome,
            placeholder: 'Apenas letras',
            required: true,
            allowNumbers: false,
            allowSpecial: false,
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-success-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'sobrenome', name: 'sobrenome', label: 'Sobrenome',
            modelValue: form.sobrenome,
            placeholder: 'Apenas letras',
            allowNumbers: false,
            allowSpecial: false,
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-warning-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'apelido', name: 'apelido', label: 'Apelido',
            modelValue: form.apelido,
            placeholder: 'Como prefere ser chamado',
            allowSpecial: false,
          },
        },
      },
    ],
  },
]
```

---

## Receita 4 — Duas linhas (8 / 4 e 3 / 3 / 3 / 3)

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-light border rounded p-3 mb-2',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 8,
        content: {
          component: FieldInput,
          props: {
            id: 'endereco', name: 'endereco', label: 'Endereço',
            modelValue: form.endereco,
            placeholder: 'Rua, número, complemento',
            required: true,
          },
        },
      },
      {
        'col-md': 4,
        content: {
          component: FieldInput,
          props: {
            id: 'cep', name: 'cep', label: 'CEP',
            modelValue: form.cep,
            placeholder: '00000-000',
            allowLetters: false,
            allowSpecial: false,
          },
        },
      },
    ],
  },
  {
    line: '2',
    wrapper_class: 'bg-light border rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'bairro', name: 'bairro', label: 'Bairro',
            modelValue: form.bairro,
            placeholder: 'Nome do bairro',
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'cidade', name: 'cidade', label: 'Cidade',
            modelValue: form.cidade,
            placeholder: 'Nome da cidade',
            options: ['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis'],
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'estado', name: 'estado', label: 'Estado',
            modelValue: form.estado,
            placeholder: 'UF',
            options: ['RS', 'SP', 'PR', 'SC', 'MG', 'RJ'],
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'pais', name: 'pais', label: 'País',
            modelValue: form.pais,
            placeholder: 'Brasil',
            readonly: true,
          },
        },
      },
    ],
  },
]
```

---

## Receita 5 — Multi-breakpoint responsivo

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-light border rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-sm': 12, 'col-md': 6, 'col-lg': 4,
        content: {
          component: FieldInput,
          props: {
            id: 'nome', name: 'nome', label: 'Nome',
            modelValue: form.nome,
            placeholder: 'Nome completo',
            required: true,
            allowNumbers: false,
            allowSpecial: false,
          },
        },
      },
      {
        'col-sm': 12, 'col-md': 6, 'col-lg': 4,
        content: {
          component: FieldInput,
          props: {
            id: 'email', name: 'email', label: 'E-mail',
            type: 'email',
            modelValue: form.email,
            placeholder: 'nome@empresa.com',
            required: true,
          },
        },
      },
      {
        'col-sm': 12, 'col-md': 12, 'col-lg': 4,
        content: {
          component: FieldInput,
          props: {
            id: 'site', name: 'site', label: 'Site',
            type: 'url',
            modelValue: form.site,
            placeholder: 'https://www.exemplo.com',
          },
        },
      },
    ],
  },
]
```

> Em tela pequena `sm`: cada campo ocupa 100%.
> Em tela média `md`: dois por linha (último ocupa 100%).
> Em tela grande `lg`: três por linha.

---

## Receita 6 — Campos com acesso controlado

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-secondary-subtle border rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 4,
        class: 'bg-light rounded p-2',
        content: {
          component: FieldInput,
          props: {
            id: 'codigo', name: 'codigo', label: 'Código (readonly)',
            modelValue: 'USR-00142',
            readonly: true,
            validateOnMount: false,
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-light rounded p-2',
        content: {
          component: FieldInput,
          props: {
            id: 'perfil', name: 'perfil', label: 'Perfil (disabled)',
            modelValue: 'Administrador',
            disabled: true,
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-light rounded p-2',
        content: {
          component: FieldInput,
          props: {
            id: 'senha', name: 'senha', label: 'Senha',
            type: 'password',
            modelValue: form.senha,
            placeholder: 'Mínimo 8 caracteres',
            required: true,
            validateOnMount: false,
          },
        },
      },
    ],
  },
]
```

---

## Receita 7 — Tipos diferentes de input (3 / 3 / 3 / 3)

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-warning-subtle border border-warning rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'busca', name: 'busca', label: 'Busca',
            type: 'search',
            modelValue: form.busca,
            placeholder: 'Digite para buscar...',
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'quantidade', name: 'quantidade', label: 'Quantidade',
            type: 'number',
            modelValue: form.quantidade,
            placeholder: '0',
            allowLetters: false,
            allowSpecial: false,
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'celular', name: 'celular', label: 'Celular',
            type: 'tel',
            modelValue: form.celular,
            placeholder: '(51) 99999-9999',
            allowLetters: false,
            allowSpecial: false,
          },
        },
      },
      {
        'col-md': 3,
        content: {
          component: FieldInput,
          props: {
            id: 'valor', name: 'valor', label: 'Valor (R$)',
            type: 'number',
            modelValue: form.valor,
            placeholder: '0,00',
            allowLetters: false,
            allowSpecial: false,
            required: true,
          },
        },
      },
    ],
  },
]
```

---

## Receita 8 — Datalist / sugestões (6 / 6)

```js
const grid = [
  {
    line: '1',
    wrapper_class: 'bg-success-subtle border border-success rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 6,
        content: {
          component: FieldInput,
          props: {
            id: 'cidade', name: 'cidade', label: 'Cidade',
            modelValue: form.cidade,
            placeholder: 'Digite ou escolha',
            options: ['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis', 'Belo Horizonte'],
          },
        },
      },
      {
        'col-md': 6,
        content: {
          component: FieldInput,
          props: {
            id: 'categoria', name: 'categoria', label: 'Categoria',
            modelValue: form.categoria,
            placeholder: 'Digite ou escolha',
            options: ['Eletrônicos', 'Vestuário', 'Alimentos', 'Serviços', 'Software'],
            required: true,
            validateOnMount: true,
          },
        },
      },
    ],
  },
]
```

---

## Template — sempre uma linha

Independente da receita, o template nunca muda:

```vue
<RowLayout :grid="grid" />
```

---

## Fábricas disponíveis no projeto

| Fábrica | Pasta | Componente |
|---------|-------|------------|
| Row Factory | `@/components/row-factory` | `RowLayout` |
| Form Fields | `@/components/form-fields` | `FieldInput` |
