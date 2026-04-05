<script setup>
/**
 * FieldPhone — fábrica de campos de celular/telefone brasileiro.
 *
 * Adaptado de filed_celular_telefone.js para Vue 3 + Composition API.
 * Máscara dinâmica:
 *   10 dígitos → telefone fixo: (XX) XXXX-XXXX
 *   11 dígitos → celular:       (XX) XXXXX-XXXX
 *
 * Valida DDD contra a lista oficial ANATEL.
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  /** Valor vinculado via v-model */
  modelValue: { type: String, default: '' },

  // ── Visual ──────────────────────────────────────────────────────────────────
  label:        { type: String,  default: 'Celular / Telefone' },
  labelClass:   { type: String,  default: 'form-label fw-semibold' },
  wrapperClass: { type: String,  default: 'mb-3' },
  inputClass:   { type: String,  default: 'form-control' },
  placeholder:  { type: String,  default: '(XX) XXXXX-XXXX' },

  // ── HTML nativo ─────────────────────────────────────────────────────────────
  id:   { type: String, required: true },
  name: { type: String, required: true },

  // ── Controle de acesso ──────────────────────────────────────────────────────
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },

  // ── Comportamento de validação ───────────────────────────────────────────────
  /** Valida desde o primeiro render, sem precisar interagir */
  validateOnMount: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'validation'])

// ── DDDs válidos ANATEL ────────────────────────────────────────────────────────
const DDDS_VALIDOS = new Set([
  // Sudeste
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24,
  27, 28,
  31, 32, 33, 34, 35, 37, 38,
  // Sul
  41, 42, 43, 44, 45, 46,
  47, 48, 49,
  51, 53, 54, 55,
  // Centro-Oeste / DF / Norte especial
  61,
  62, 64,
  63,
  65, 66,
  67,
  68,
  69,
  // Nordeste
  71, 73, 74, 75, 77,
  79,
  81, 87,
  82,
  83,
  84,
  85, 88,
  86, 89,
  // Norte / Maranhão
  91, 93, 94,
  92, 97,
  95,
  96,
  98, 99,
])

// ── Estado interno ─────────────────────────────────────────────────────────────
const internalValue = ref(formatPhone(props.modelValue))
const touched       = ref(props.validateOnMount)

watch(() => props.modelValue, (val) => {
  internalValue.value = formatPhone(val)
})

// ── Máscara ────────────────────────────────────────────────────────────────────
function digits(value) {
  return value.replace(/\D/g, '')
}

function formatPhone(value) {
  const d = digits(value).slice(0, 11)
  const n = d.length

  if (n === 0)  return ''
  if (n <= 2)   return '(' + d
  if (n <= 6)   return '(' + d.slice(0, 2) + ') ' + d.slice(2)
  if (n <= 10)  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6)
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7)
}

// ── Computed ───────────────────────────────────────────────────────────────────
const fieldLabel = computed(() => props.label || props.name || props.id || 'Celular / Telefone')

const errors = computed(() => {
  const messages = []
  const raw  = internalValue.value ?? ''
  const nums = digits(raw)

  if (props.required && !raw.trim()) {
    messages.push(`Campo "${fieldLabel.value}" é obrigatório.`)
    return messages
  }

  if (!raw.trim()) return messages

  if (nums.length < 10) {
    messages.push('Número incompleto. Informe DDD + número (8 ou 9 dígitos).')
    return messages
  }

  const ddd = parseInt(nums.slice(0, 2), 10)
  if (!DDDS_VALIDOS.has(ddd)) {
    messages.push(`DDD "${nums.slice(0, 2)}" não é válido. Verifique o código de área.`)
  }

  return messages
})

const isInvalid = computed(() => touched.value && errors.value.length > 0)
const isValid   = computed(() => touched.value && errors.value.length === 0 && internalValue.value !== '')

// ── Handlers ───────────────────────────────────────────────────────────────────
function onInput(e) {
  const masked = formatPhone(e.target.value)
  e.target.value        = masked
  internalValue.value   = masked
  emit('update:modelValue', digits(masked))
  emit('validation', { id: props.id, valid: errors.value.length === 0, errors: errors.value })
}

function onBlur() {
  touched.value = true
}
</script>

<template>
  <div :class="wrapperClass">

    <!-- Label -->
    <label v-if="label" :for="id" :class="labelClass">
      {{ label }}
      <span v-if="required" class="text-danger ms-1" aria-hidden="true">*</span>
    </label>

    <!-- Input -->
    <input
      :id="id"
      :name="name"
      type="tel"
      :value="internalValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :required="required"
      maxlength="15"
      :class="[
        inputClass,
        isInvalid ? 'is-invalid' : '',
        isValid   ? 'is-valid'   : '',
      ]"
      @input="onInput"
      @blur="onBlur"
    />

    <!-- Feedback de validação -->
    <div
      v-if="isInvalid"
      class="invalid-feedback d-block"
      style="font-size: 0.72rem; font-style: italic;"
    >
      <span v-for="(msg, i) in errors" :key="i" class="d-block">{{ msg }}</span>
    </div>

  </div>
</template>
