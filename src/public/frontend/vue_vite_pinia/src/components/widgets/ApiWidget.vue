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
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <span v-if="icon" class="text-lg leading-none shrink-0">{{ icon }}</span>
        <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
          {{ title }}
        </h3>
        <!-- Contador de registros (vindo do meta da API) -->
        <span
          v-if="meta?.total != null"
          class="ml-auto shrink-0 text-xs text-gray-400 dark:text-gray-500 tabular-nums"
        >
          {{ meta.total }} reg.
        </span>
      </div>

      <!-- Botão de refresh manual -->
      <button
        v-if="refreshable"
        :disabled="isLoading"
        class="ml-3 p-1 rounded text-gray-400 hover:text-primary-500 dark:hover:text-primary-400
               transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        title="Recarregar"
        @click="refresh"
      >
        <svg
          class="h-4 w-4"
          :class="{ 'animate-spin': isLoading }"
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
      class="flex flex-col items-center py-8 gap-2 text-center"
    >
      <span class="text-3xl">⚠️</span>
      <p class="text-sm text-red-500 dark:text-red-400 max-w-xs">{{ error }}</p>
      <button
        class="mt-1 text-xs text-primary-500 hover:text-primary-700 hover:underline transition-colors"
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
