<script setup>
import { watch } from 'vue'
import { useApiWidget }   from '@/composables/useApiWidget'
import BaseCard           from '@/components/common/BaseCard.vue'
import SkeletonLoader     from '@/components/common/SkeletonLoader.vue'

/**
 * Widget genérico de API.
 * Combina BaseCard + SkeletonLoader + useApiWidget num único bloco reutilizável.
 *
 * Para criar uma nova tela de serviço: duplicar este widget e passar
 * o fetchFn do Service correspondente. Nenhuma outra alteração necessária.
 *
 * @example
 * <ApiWidget
 *   title="Usuários"
 *   icon="👥"
 *   :fetch-fn="() => userService.getAll({ limit: 5 })"
 *   skeleton-type="table"
 * >
 *   <template #default="{ data, meta, refresh }">
 *     <!-- Seu conteúdo aqui -->
 *   </template>
 * </ApiWidget>
 */
const props = defineProps({
  /** Título exibido no header do card */
  title:         { type: String,   required: true },
  /** Emoji ou texto exibido ao lado do título */
  icon:          { type: String,   default: '' },
  /** Função de fetch do Service — ex: () => userService.getAll() */
  fetchFn:       { type: Function, required: true },
  /** Tipo de skeleton exibido durante o carregamento */
  skeletonType:  { type: String,   default: 'card' },
  /** Número de linhas do skeleton */
  skeletonLines: { type: Number,   default: 4 },
  /** Exibe botão de refresh manual no header */
  refreshable:   { type: Boolean,  default: true },
})

const emit = defineEmits([
  /** Emitido quando os dados chegam com sucesso */
  'data-loaded',
  /** Emitido quando ocorre um erro */
  'error',
])

const { data, isLoading, error, meta, refresh } = useApiWidget(props.fetchFn)

// Notifica o componente pai sobre eventos internos
watch(data,  (val) => { if (val)  emit('data-loaded', val) })
watch(error, (val) => { if (val)  emit('error', val) })
</script>

<template>
  <BaseCard>
    <!-- ── Header ──────────────────────────────────────────────────────── -->
    <template #header>
      <div class="d-flex align-items-center gap-2 min-w-0 flex-fill">
        <span v-if="icon" class="flex-shrink-0">{{ icon }}</span>
        <h3 class="small fw-semibold text-body mb-0 text-truncate">
          {{ title }}
        </h3>
        <!-- Contador de registros (vindo do meta da API) -->
        <span
          v-if="meta?.total != null"
          class="ms-auto flex-shrink-0 small text-muted font-monospace"
        >
          {{ meta.total }} reg.
        </span>
      </div>

      <!-- Botão de refresh manual -->
      <button
        v-if="refreshable"
        :disabled="isLoading"
        class="btn btn-link btn-sm p-1 text-muted ms-2 flex-shrink-0"
        title="Recarregar"
        @click="refresh"
      >
        <svg
          class="icon-sm"
          :class="{ 'spin': isLoading }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003
               8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </template>

    <!-- ── Corpo: carregando ────────────────────────────────────────────── -->
    <SkeletonLoader
      v-if="isLoading"
      :type="skeletonType"
      :lines="skeletonLines"
    />

    <!-- ── Corpo: erro ─────────────────────────────────────────────────── -->
    <div
      v-else-if="error"
      class="d-flex flex-column align-items-center py-5 gap-2 text-center"
    >
      <span class="fs-2">⚠️</span>
      <p class="small text-danger mb-0" style="max-width: 20rem;">{{ error }}</p>
      <button
        class="btn btn-link btn-sm p-0 mt-1"
        @click="refresh"
      >
        Tentar novamente
      </button>
    </div>

    <!-- ── Corpo: conteúdo via slot ────────────────────────────────────── -->
    <template v-else>
      <slot :data="data" :meta="meta" :refresh="refresh" />
    </template>
  </BaseCard>
</template>

<style scoped>
.icon-sm {
  width: 1rem;
  height: 1rem;
  display: block;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin {
  animation: spin 1s linear infinite;
}
</style>
