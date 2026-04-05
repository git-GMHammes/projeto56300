<script setup>
/**
 * RowLayout — Row Factory para Bootstrap 5.
 *
 * Recebe um array `grid` e monta automaticamente os <div class="row">
 * e <div class="col-md-*">. O conteúdo de cada coluna é declarado
 * diretamente no JSON, sem nenhum bloco <template> no view pai.
 *
 * Cada coluna aceita um campo opcional `content`:
 *   content.component  → componente Vue (usa <component :is>)
 *   content.props      → props passadas ao componente
 *   content.text       → texto simples (útil para demos e placeholders)
 *   content.class      → classes aplicadas ao wrapper do conteúdo
 *
 * Uso mínimo no view:
 *   <RowLayout :grid="meuGrid" />
 *
 * JSON de exemplo:
 * [
 *   {
 *     line: '1',
 *     row_classes: 'row g-3 mb-3',
 *     total_cols: 12,
 *     columns: [
 *       { 'col-md': 6, content: { text: 'col-md-6' } },
 *       { 'col-md': 3, content: { component: FieldInput, props: { id: 'nome', name: 'nome' } } },
 *       { 'col-md': 3 },
 *     ],
 *   },
 * ]
 */

const props = defineProps({
  grid: {
    type: Array,
    required: true,
  },
})

/**
 * Extrai somente as chaves de breakpoint Bootstrap e monta a classe.
 * Ignora chaves reservadas: content, total_cols.
 * Ex: { 'col-md': 6, 'col-lg': 4, content: {...} } → "col-md-6 col-lg-4"
 */
const RESERVED = new Set(['content', 'class'])

function colClass(col) {
  const breakpoints = Object.entries(col)
    .filter(([key]) => !RESERVED.has(key))
    .map(([breakpoint, size]) => `${breakpoint}-${size}`)
    .join(' ')

  return col.class ? `${breakpoints} ${col.class}` : breakpoints
}
</script>

<template>
  <!--- Rows -->
  <template v-for="row in grid" :key="row.line">

    <!-- Wrapper opcional: recebe cor de fundo, borda e padding da row -->
    <div :class="row.wrapper_class || 'mb-3'">
      <div :class="row.row_classes">
        <div
          v-for="(col, colIndex) in row.columns"
          :key="colIndex"
          :class="colClass(col)"
        >
          <!-- Componente Vue declarado no JSON -->
          <component
            v-if="col.content?.component"
            :is="col.content.component"
            v-bind="col.content.props || {}"
          />

          <!-- Texto / placeholder declarado no JSON -->
          <div
            v-else-if="col.content?.text"
            :class="col.content.class"
          >
            {{ col.content.text }}
          </div>

          <!-- Coluna vazia: slot nomeado como fallback -->
          <slot v-else :name="`l${row.line}-c${colIndex + 1}`" />
        </div>
      </div>
    </div>

  </template>
</template>
