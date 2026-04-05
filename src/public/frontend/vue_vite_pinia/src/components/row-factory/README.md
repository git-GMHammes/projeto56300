# row-factory — Fábrica de Linhas Bootstrap

Componente Vue 3 + Bootstrap 5 para montagem declarativa de layouts em grade.
Define o grid via **JSON** e injeta conteúdo em cada coluna via **slots nomeados**.

---

## Estrutura da pasta

```
src/components/row-factory/
├── README.md        ← este índice
├── index.js         ← barrel export (importação centralizada)
└── RowLayout.vue    ← fábrica de rows e colunas Bootstrap
```

---

## Como importar

```js
// Importação nomeada via barrel (recomendado)
import { RowLayout } from "@/components/row-factory";

// Importação direta (melhor tree-shaking em bundles grandes)
import RowLayout from "@/components/row-factory/RowLayout.vue";
```

---

## JSON do grid

```json
{
  "grid": [
    {
      "line": "1",
      "row_classes": "row g-3 mb-3",
      "total_cols": 12,
      "columns": [{ "col-md": 6 }, { "col-md": 3 }, { "col-md": 3 }]
    },
    {
      "line": "2",
      "row_classes": "row g-3 mb-3",
      "total_cols": 12,
      "columns": [
        { "col-md": 2 },
        { "col-md": 2 },
        { "col-md": 2 },
        { "col-md": 3 },
        { "col-md": 3 }
      ]
    }
  ]
}
```

| Campo         | Tipo   | Descrição                                        |
| ------------- | ------ | ------------------------------------------------ |
| `line`        | String | Identificador da linha (usado no nome dos slots) |
| `row_classes` | String | Classes Bootstrap do `<div class="row ...">`     |
| `total_cols`  | Number | Referência — deve sempre somar 12                |
| `columns`     | Array  | Objetos com breakpoint Bootstrap → tamanho       |

---

## Slots

O nome do slot segue o padrão: **`l{line}-c{colIndex}`**

| Slot     | Linha | Coluna |
| -------- | ----- | ------ |
| `#l1-c1` | 1     | 1      |
| `#l1-c2` | 1     | 2      |
| `#l2-c1` | 2     | 1      |
| `#l2-c3` | 2     | 3      |

---

## Exemplo de uso

```vue
<script setup>
import { RowLayout } from "@/components/row-factory";

const grid = [
  {
    line: "1",
    row_classes: "row g-3 mb-3",
    total_cols: 12,
    columns: [{ "col-md": 6 }, { "col-md": 3 }, { "col-md": 3 }],
  },
  {
    line: "2",
    row_classes: "row g-3 mb-3",
    total_cols: 12,
    columns: [
      { "col-md": 2 },
      { "col-md": 2 },
      { "col-md": 2 },
      { "col-md": 3 },
      { "col-md": 3 },
    ],
  },
];
</script>

<template>
  <RowLayout :grid="grid">
    <!-- Linha 1 -->
    <template #l1-c1> Coluna larga </template>
    <template #l1-c2> Coluna média </template>
    <template #l1-c3> Coluna média </template>

    <!-- Linha 2 -->
    <template #l2-c1> Col 2 </template>
    <template #l2-c2> Col 2 </template>
    <template #l2-c3> Col 2 </template>
    <template #l2-c4> Col 3 </template>
    <template #l2-c5> Col 3 </template>
  </RowLayout>
</template>
```

---

## Multi-breakpoint

Cada coluna suporta múltiplos breakpoints Bootstrap:

```json
{ "col-sm": 12, "col-md": 6, "col-lg": 4 }
```

Isso gera: `class="col-sm-12 col-md-6 col-lg-4"`

---

## Dependências

- **Vue 3** (Composition API / `<script setup>`)
- **Bootstrap 5.3+** (classes CSS — deve estar disponível globalmente)
- **Vite** com alias `@` apontando para `src/`
