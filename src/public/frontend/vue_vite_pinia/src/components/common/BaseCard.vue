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
    class="rounded-xl bg-white dark:bg-slate-800 transition-shadow duration-200 overflow-hidden"
    :class="[
      !flat     ? 'shadow-sm hover:shadow-md' : '',
      bordered  ? 'border border-gray-200 dark:border-slate-700' : '',
    ]"
  >
    <!-- Slot: cabeçalho (opcional) -->
    <div
      v-if="$slots.header"
      class="flex items-center justify-between px-5 py-3.5
             border-b border-gray-100 dark:border-slate-700"
    >
      <slot name="header" />
    </div>

    <!-- Slot: conteúdo principal -->
    <div :class="!noPadding ? 'px-5 py-4' : ''">
      <slot />
    </div>

    <!-- Slot: rodapé (opcional) -->
    <div
      v-if="$slots.footer"
      class="px-5 py-3 border-t border-gray-100 dark:border-slate-700
             bg-gray-50 dark:bg-slate-700/40"
    >
      <slot name="footer" />
    </div>
  </div>
</template>
