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
  <div v-if="type === 'stat'" class="space-y-2">
    <div class="sk h-8 w-28 rounded-md" />
    <div class="sk h-3.5 w-36 rounded" />
  </div>

  <!-- Avatar + linhas de texto -->
  <div v-else-if="type === 'avatar'" class="space-y-3">
    <div v-for="i in lines" :key="i" class="flex items-center gap-3">
      <div class="sk h-9 w-9 rounded-full flex-shrink-0" />
      <div class="flex-1 space-y-1.5">
        <div class="sk h-3.5 rounded" :style="{ width: i % 2 === 0 ? '55%' : '75%' }" />
        <div class="sk h-3 rounded w-2/5" />
      </div>
    </div>
  </div>

  <!-- Card genérico -->
  <div v-else-if="type === 'card'" class="space-y-3">
    <div class="sk h-5 w-1/3 rounded-md" />
    <div class="sk h-3.5 w-full rounded" />
    <div class="sk h-3.5 w-5/6 rounded" />
    <div class="sk h-3.5 w-4/6 rounded" />
  </div>

  <!-- Tabela -->
  <div v-else-if="type === 'table'" class="space-y-2">
    <div class="sk h-10 w-full rounded-md" />
    <div v-for="i in lines" :key="i" class="sk w-full rounded" style="height: 3rem" />
  </div>

  <!-- Linhas de texto (default) -->
  <div v-else class="space-y-2">
    <div
      v-for="i in lines"
      :key="i"
      class="sk h-4 rounded"
      :style="{ width: i === lines && lines > 1 ? '68%' : '100%' }"
    />
  </div>
</template>

<style scoped>
/* Classe utilitária do skeleton com animação shimmer */
.sk {
  background: linear-gradient(90deg, #e2e8f0 25%, #f8fafc 50%, #e2e8f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

:global(.dark) .sk {
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: shimmer 1.6s linear infinite;
}

@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
</style>
