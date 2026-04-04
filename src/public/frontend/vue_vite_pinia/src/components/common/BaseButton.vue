<script setup>
/**
 * Botão reutilizável com suporte a variantes, tamanhos, ícones e loading.
 * 100% baseado em props — nenhuma lógica de negócio interna.
 */
defineProps({
  /** Variante visual do botão */
  variant: {
    type: String,
    default: 'primary',
    validator: (v) =>
      ['primary', 'secondary', 'success', 'danger', 'warning', 'ghost', 'outline'].includes(v),
  },
  /** Tamanho do botão */
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['xs', 'sm', 'md', 'lg'].includes(v),
  },
  /** Exibe spinner de carregamento no lugar do conteúdo */
  loading:  { type: Boolean, default: false },
  /** Desabilita o botão */
  disabled: { type: Boolean, default: false },
  /** Ocupa 100% da largura do container */
  block:    { type: Boolean, default: false },
  /** Tipo HTML nativo */
  type:     { type: String, default: 'button' },
})

const variantClasses = {
  primary:   'bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white border-transparent',
  secondary: 'bg-slate-600  hover:bg-slate-700  active:bg-slate-800  text-white border-transparent',
  success:   'bg-green-600  hover:bg-green-700  active:bg-green-800  text-white border-transparent',
  danger:    'bg-red-600    hover:bg-red-700    active:bg-red-800    text-white border-transparent',
  warning:   'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white border-transparent',
  ghost:     'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 border-transparent',
  outline:   'bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-primary-500',
}

const sizeClasses = {
  xs: 'px-2.5 py-1    text-xs  gap-1',
  sm: 'px-3   py-1.5  text-sm  gap-1.5',
  md: 'px-4   py-2    text-sm  gap-2',
  lg: 'px-6   py-2.5  text-base gap-2',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center font-medium rounded-lg border
           transition-all duration-150 focus:outline-none focus:ring-2
           focus:ring-primary-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed select-none"
    :class="[
      variantClasses[variant],
      sizeClasses[size],
      block ? 'w-full' : '',
    ]"
  >
    <!-- Spinner de carregamento -->
    <svg
      v-if="loading"
      class="animate-spin shrink-0"
      :class="size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>

    <slot />
  </button>
</template>
