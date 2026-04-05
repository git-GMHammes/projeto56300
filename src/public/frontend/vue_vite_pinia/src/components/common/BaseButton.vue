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

const variantClass = {
  primary:   'btn-primary',
  secondary: 'btn-secondary',
  success:   'btn-success',
  danger:    'btn-danger',
  warning:   'btn-warning text-white',
  ghost:     'btn-light',
  outline:   'btn-outline-primary',
}

const sizeClass = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="btn"
    :class="[
      variantClass[variant],
      sizeClass[size],
      block ? 'd-block w-100' : '',
    ]"
  >
    <span
      v-if="loading"
      class="spinner-border spinner-border-sm me-1"
      role="status"
      aria-hidden="true"
    />
    <slot />
  </button>
</template>

<style scoped>
/* Tamanho extra-pequeno — Bootstrap não tem btn-xs nativo */
.btn-xs {
  padding: 0.125rem 0.625rem;
  font-size: 0.75rem;
  border-radius: 0.375rem;
}
</style>
