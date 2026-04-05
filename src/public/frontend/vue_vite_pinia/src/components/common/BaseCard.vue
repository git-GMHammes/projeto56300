<script setup>
/**
 * Componente genérico de Card.
 * Totalmente baseado em slots para máximo reaproveitamento.
 * Não possui lógica de negócio — apenas estrutura e estilo.
 */
defineProps({
  /** Remove o padding interno do body */
  noPadding: { type: Boolean, default: false },
  /** Remove a sombra */
  flat:      { type: Boolean, default: false },
  /** Adiciona borda ao redor do card */
  bordered:  { type: Boolean, default: false },
})
</script>

<template>
  <div
    class="card overflow-hidden"
    :class="[
      !flat    ? 'shadow-sm hover-shadow' : '',
      bordered ? 'border' : 'border-0',
    ]"
  >
    <!-- Slot: cabeçalho (opcional) -->
    <div
      v-if="$slots.header"
      class="card-header d-flex align-items-center justify-content-between"
    >
      <slot name="header" />
    </div>

    <!-- Slot: conteúdo principal -->
    <div :class="!noPadding ? 'card-body' : 'p-0'">
      <slot />
    </div>

    <!-- Slot: rodapé (opcional) -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.hover-shadow {
  transition: box-shadow 0.2s ease;
}
.hover-shadow:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1) !important;
}
</style>
