<script setup>
/**
 * FieldInput — fábrica de campos <input> reativa.
 *
 * Substitui filed_input.js com props Vue em vez de data-* attributes.
 * Suporta: validação em tempo real (letras / números / especiais),
 * controle de acesso (readonly / disabled / required) e datalist.
 */
import { ref, computed, watch } from 'vue'

const props = defineProps({
  /** Valor vinculado via v-model */
  modelValue: { type: String, default: '' },

  // ── Visual ──────────────────────────────────────────────────────────────────
  label:        { type: String,  default: '' },
  labelClass:   { type: String,  default: 'form-label fw-semibold' },
  wrapperClass: { type: String,  default: 'mb-3' },
  inputClass:   { type: String,  default: 'form-control' },
  placeholder:  { type: String,  default: '' },

  // ── HTML nativo ─────────────────────────────────────────────────────────────
  type: {
    type: String,
    default: 'text',
    validator: (v) => ['text', 'hidden', 'email', 'password', 'number', 'search', 'tel', 'url'].includes(v),
  },
  id:   { type: String, required: true },
  name: { type: String, required: true },

  // ── Regras de validação de caracteres ───────────────────────────────────────
  /** Permite caracteres especiais (ex: @, #, !) */
  allowSpecial:  { type: Boolean, default: true },
  /** Permite dígitos numéricos */
  allowNumbers:  { type: Boolean, default: true },
  /** Permite letras */
  allowLetters:  { type: Boolean, default: true },

  // ── Controle de acesso ──────────────────────────────────────────────────────
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },

  // ── Datalist (sugestões) ────────────────────────────────────────────────────
  /** Array de strings para gerar <datalist> */
  options: { type: Array, default: () => [] },

  // ── Comportamento de validação ───────────────────────────────────────────────
  /** Valida desde o primeiro render, sem precisar interagir */
  validateOnMount: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'validation'])

// ── Estado interno ─────────────────────────────────────────────────────────────
const internalValue = ref(props.modelValue)
const touched       = ref(props.validateOnMount)

// Sincroniza quando o pai altera modelValue externamente
watch(() => props.modelValue, (val) => {
  internalValue.value = val
})

// ── Computed ───────────────────────────────────────────────────────────────────
const datalistId = computed(() =>
  props.options.length > 0 ? `${props.id}_datalist` : null
)

const fieldLabel = computed(() =>
  props.label || props.name || props.id || 'Campo'
)

const errors = computed(() => {
  const messages = []
  const val = internalValue.value ?? ''

  if (props.required && !val.trim()) {
    messages.push(`Campo "${fieldLabel.value}" é obrigatório.`)
    return messages   // campo vazio + required: não executa as demais regras
  }

  if (val) {
    if (!props.allowSpecial && /[^\p{L}\p{N}\s]/u.test(val)) {
      messages.push(`Campo "${fieldLabel.value}" não aceita caracteres especiais.`)
    }
    if (!props.allowNumbers && /\d/.test(val)) {
      messages.push(`Campo "${fieldLabel.value}" não aceita números.`)
    }
    if (!props.allowLetters && /\p{L}/u.test(val)) {
      messages.push(`Campo "${fieldLabel.value}" não aceita letras.`)
    }
  }

  return messages
})

const isInvalid = computed(() => touched.value && errors.value.length > 0)
const isValid   = computed(() => touched.value && errors.value.length === 0 && internalValue.value !== '')

// ── Handlers ───────────────────────────────────────────────────────────────────
function onInput(e) {
  internalValue.value = e.target.value
  emit('update:modelValue', e.target.value)
  emit('validation', { id: props.id, valid: errors.value.length === 0, errors: errors.value })
}

function onBlur() {
  touched.value = true
}
</script>

<template>
  <!-- Campo hidden: renderiza apenas o input sem estrutura visual -->
  <input
    v-if="type === 'hidden'"
    :id="id"
    :name="name"
    type="hidden"
    :value="internalValue"
    @input="onInput"
  />

  <!-- Campo visível: wrapper + label + input + feedback -->
  <div v-else :class="wrapperClass">

    <!-- Label -->
    <label
      v-if="label"
      :for="id"
      :class="labelClass"
    >
      {{ label }}
      <span v-if="required" class="text-danger ms-1" aria-hidden="true">*</span>
    </label>

    <!-- Input -->
    <input
      :id="id"
      :name="name"
      :type="type"
      :value="internalValue"
      :placeholder="placeholder"
      :readonly="readonly"
      :disabled="disabled"
      :required="required"
      :list="datalistId ?? undefined"
      :class="[
        inputClass,
        isInvalid ? 'is-invalid' : '',
        isValid   ? 'is-valid'   : '',
      ]"
      @input="onInput"
      @blur="onBlur"
    />

    <!-- Datalist de sugestões -->
    <datalist v-if="datalistId" :id="datalistId">
      <option v-for="opt in options" :key="opt" :value="opt" />
    </datalist>

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
