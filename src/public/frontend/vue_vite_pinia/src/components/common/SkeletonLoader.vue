<script setup>
/**
 * Skeleton Loader animado para estados de carregamento.
 * Substitui spinners globais por placeholders granulares por widget.
 */
defineProps({
  /**
   * Variante de skeleton:
   * - line:   linhas de texto genéricas
   * - stat:   número grande + label (KPI cards)
   * - avatar: círculo + linhas (listas de usuário)
   * - card:   título + parágrafos
   * - table:  header + linhas de tabela
   */
  type:  { type: String, default: 'line',
    validator: (v) => ['line', 'stat', 'avatar', 'card', 'table'].includes(v) },
  /** Número de linhas (para tipos 'line' e 'table') */
  lines: { type: Number, default: 4 },
})
</script>

<template>
  <!-- KPI / Stat -->
  <div v-if="type === 'stat'" class="vstack gap-2">
    <div class="sk rounded" style="height: 2rem; width: 7rem;" />
    <div class="sk rounded" style="height: 0.875rem; width: 9rem;" />
  </div>

  <!-- Avatar + linhas de texto -->
  <div v-else-if="type === 'avatar'" class="vstack gap-3">
    <div v-for="i in lines" :key="i" class="d-flex align-items-center gap-3">
      <div class="sk rounded-circle flex-shrink-0" style="height: 2.25rem; width: 2.25rem;" />
      <div class="flex-fill d-flex flex-column gap-1">
        <div class="sk rounded" :style="{ height: '0.875rem', width: i % 2 === 0 ? '55%' : '75%' }" />
        <div class="sk rounded" style="height: 0.75rem; width: 40%;" />
      </div>
    </div>
  </div>

  <!-- Card genérico -->
  <div v-else-if="type === 'card'" class="vstack gap-3">
    <div class="sk rounded" style="height: 1.25rem; width: 33%;" />
    <div class="sk w-100 rounded" style="height: 0.875rem;" />
    <div class="sk rounded" style="height: 0.875rem; width: 83%;" />
    <div class="sk rounded" style="height: 0.875rem; width: 66%;" />
  </div>

  <!-- Tabela -->
  <div v-else-if="type === 'table'" class="vstack gap-2">
    <div class="sk w-100 rounded" style="height: 2.5rem;" />
    <div v-for="i in lines" :key="i" class="sk w-100 rounded" style="height: 3rem;" />
  </div>

  <!-- Linhas de texto (default) -->
  <div v-else class="vstack gap-2">
    <div
      v-for="i in lines"
      :key="i"
      class="sk rounded"
      :style="{ height: '1rem', width: i === lines && lines > 1 ? '68%' : '100%' }"
    />
  </div>
</template>

<style scoped>
/* Animação shimmer customizada — mantida do projeto original */
.sk {
  background: linear-gradient(90deg, #e2e8f0 25%, #f8fafc 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

[data-bs-theme='dark'] .sk {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
</style>
