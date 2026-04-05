<script setup>
import { reactive } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { FieldInput } from '@/components/form-fields'
import { RowLayout } from '@/components/row-factory'

const settingsStore = useSettingsStore()

const form = reactive({
  nome: '',
  codigo: '',
  cidade: '',
})

// ── Row Factory — Exemplo 1: estrutura 6 / 3 / 3 ────────────────────────────
const gridEx1 = [
  {
    line: '1',
    row_classes: 'row g-3 mb-3',
    total_cols: 12,
    columns: [
      { 'col-md': 6, content: { text: 'col-md-6', class: 'bg-primary-subtle border rounded p-3 text-center' } },
      { 'col-md': 3, content: { text: 'col-md-3', class: 'bg-success-subtle border rounded p-3 text-center' } },
      { 'col-md': 3, content: { text: 'col-md-3', class: 'bg-warning-subtle border rounded p-3 text-center' } },
    ],
  },
]

// ── Row Factory — Exemplo 2: estrutura 2 / 2 / 2 / 3 / 3 ────────────────────
const gridEx2 = [
  {
    line: '1',
    row_classes: 'row g-3 mb-3',
    total_cols: 12,
    columns: [
      { 'col-md': 2, content: { text: 'col-md-2', class: 'bg-info-subtle border rounded p-3 text-center' } },
      { 'col-md': 2, content: { text: 'col-md-2', class: 'bg-info-subtle border rounded p-3 text-center' } },
      { 'col-md': 2, content: { text: 'col-md-2', class: 'bg-info-subtle border rounded p-3 text-center' } },
      { 'col-md': 3, content: { text: 'col-md-3', class: 'bg-danger-subtle border rounded p-3 text-center' } },
      { 'col-md': 3, content: { text: 'col-md-3', class: 'bg-danger-subtle border rounded p-3 text-center' } },
    ],
  },
]

// ── Row Factory — Exemplo 3: componentes reais — FieldInput via JSON ─────────
const gridEx3 = [
  {
    line: '1',
    wrapper_class: 'bg-primary-subtle border border-primary rounded p-3 mb-3',
    row_classes: 'row g-3',
    total_cols: 12,
    columns: [
      {
        'col-md': 4,
        class: 'bg-danger-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'nome', name: 'nome', label: 'Nome', modelValue: form.nome,
            required: true, allowNumbers: false, allowSpecial: false,
            placeholder: 'Apenas letras'
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-success-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'codigo', name: 'codigo', label: 'Código', modelValue: form.codigo,
            allowLetters: false, allowSpecial: false,
            placeholder: 'Apenas dígitos'
          },
        },
      },
      {
        'col-md': 4,
        class: 'bg-warning-subtle border border-light rounded p-3',
        content: {
          component: FieldInput,
          props: {
            id: 'cidade', name: 'cidade', label: 'Cidade', modelValue: form.cidade,
            options: ['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis'],
            placeholder: 'Digite ou escolha'
          },
        },
      },
    ],
  },
]
</script>

<template>
  <div class="min-vh-100 d-flex flex-column">

    <AppNavbar @toggle-sidebar="settingsStore.toggleSidebar" />

    <div class="d-flex flex-fill pt-navbar">
      <AppSidebar />

      <main class="flex-fill min-w-0 p-4" :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''"
        style="transition: margin-left 0.3s ease;">

        <p class="fw-semibold mb-2">Exemplo 1 — estrutura 6 / 3 / 3</p>
        <RowLayout :grid="gridEx1" />

        <p class="fw-semibold mb-2">Exemplo 2 — estrutura 2 / 2 / 2 / 3 / 3</p>
        <RowLayout :grid="gridEx2" />

        <p class="fw-semibold mb-2">Exemplo 3 — FieldInput montado pelo JSON (4 / 4 / 4)</p>
        <RowLayout :grid="gridEx3" />

        <!-- Debug reativo -->
        <pre class="mt-4 bg-dark text-light rounded p-3"
          style="font-size: 0.75rem;">{{ JSON.stringify(form, null, 2) }}</pre>

      </main>
    </div>

    <AppFooter :class="settingsStore.sidebarOpen ? 'sidebar-push' : ''" style="transition: margin-left 0.3s ease;" />

  </div>
</template>
