<script setup>
/**
 * BlankCanvas — demonstração das fábricas de campos form-fields.
 * Cada seção exercita um comportamento diferente do FieldInput.
 */
import { ref, reactive } from 'vue'
import { FieldInput } from '@/components/form-fields'

// ── Valores vinculados ─────────────────────────────────────────────────────────
const form = reactive({
  nomeCompleto:    '',
  nomeSemNumeros:  '',
  codigoNumerico:  '',
  username:        '',
  iniciais:        '',
  destaque:        '',
  systemId:        'SYS-00472',
  tokenHidden:     'abc123xyz',
  cidade:          '',
  email:           '',
})

// ── Estado de validação global (emit de cada campo) ────────────────────────────
const fieldStatus = reactive({})

function onValidation({ id, valid, errors }) {
  fieldStatus[id] = { valid, errors }
}

const allValid = Object.values(fieldStatus).every(f => f.valid)

// ── Cidades para datalist ──────────────────────────────────────────────────────
const cidades = ['Porto Alegre', 'São Paulo', 'Curitiba', 'Florianópolis', 'Blumenau', 'Caxias do Sul']
</script>

<template>
  <div class="container-fluid py-4 px-4">

    <!-- ── Cabeçalho ──────────────────────────────────────────────────────────── -->
    <div class="mb-4">
      <h4 class="mb-1 fw-bold">Fábricas de Campos — <code>form-fields</code></h4>
      <p class="text-muted mb-0" style="font-size: 0.85rem;">
        Demonstração de todos os comportamentos do componente <strong>FieldInput</strong>.
        Substitui o <code>filed_input.js</code> com Vue 3 + Bootstrap 5.
      </p>
    </div>

    <form novalidate @submit.prevent>

      <!-- ── 1. Campos Básicos ───────────────────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-primary text-white fw-semibold" style="font-size: 0.85rem;">
          1 — Campos básicos
        </div>
        <div class="card-body">
          <div class="row g-3">

            <div class="col-md-6">
              <FieldInput
                v-model="form.nomeCompleto"
                id="nome_completo"
                name="nome_completo"
                label="Nome Completo"
                placeholder="Digite seu nome completo"
                :required="true"
                @validation="onValidation"
              />
            </div>

            <div class="col-md-6">
              <FieldInput
                v-model="form.email"
                id="email"
                name="email"
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                :required="true"
                @validation="onValidation"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- ── 2. Validação de Caracteres ─────────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-warning text-dark fw-semibold" style="font-size: 0.85rem;">
          2 — Validação de caracteres
        </div>
        <div class="card-body">
          <div class="row g-3">

            <!-- Sem números -->
            <div class="col-md-4">
              <FieldInput
                v-model="form.nomeSemNumeros"
                id="nome_sem_numeros"
                name="nome_sem_numeros"
                label="Nome (sem números)"
                placeholder="Apenas letras e especiais"
                :allow-numbers="false"
                @validation="onValidation"
              />
            </div>

            <!-- Só números -->
            <div class="col-md-4">
              <FieldInput
                v-model="form.codigoNumerico"
                id="codigo_numerico"
                name="codigo_numerico"
                label="Código Numérico"
                placeholder="Apenas dígitos"
                :allow-letters="false"
                :allow-special="false"
                @validation="onValidation"
              />
            </div>

            <!-- Só letras (sem números e sem especiais) -->
            <div class="col-md-4">
              <FieldInput
                v-model="form.iniciais"
                id="iniciais"
                name="iniciais"
                label="Iniciais (somente letras)"
                placeholder="Ex: JMCS"
                :allow-numbers="false"
                :allow-special="false"
                @validation="onValidation"
              />
            </div>

            <!-- Sem especiais -->
            <div class="col-md-6">
              <FieldInput
                v-model="form.username"
                id="username"
                name="username"
                label="Username (sem caracteres especiais)"
                placeholder="Ex: joao_silva"
                :allow-special="false"
                @validation="onValidation"
              />
            </div>

            <!-- Classe customizada -->
            <div class="col-md-6">
              <FieldInput
                v-model="form.destaque"
                id="campo_destaque"
                name="campo_destaque"
                label="Campo com classe customizada"
                placeholder="Borda azul Bootstrap"
                input-class="form-control form-control-lg border-primary"
                @validation="onValidation"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- ── 3. Controle de Acesso ───────────────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-secondary text-white fw-semibold" style="font-size: 0.85rem;">
          3 — Controle de acesso (readonly / disabled)
        </div>
        <div class="card-body">
          <div class="row g-3">

            <!-- ReadOnly -->
            <div class="col-md-6">
              <FieldInput
                v-model="form.systemId"
                id="system_id"
                name="system_id"
                label="ID do Sistema (somente leitura)"
                :readonly="true"
              />
            </div>

            <!-- Disabled -->
            <div class="col-md-6">
              <FieldInput
                v-model="form.systemId"
                id="campo_bloqueado"
                name="campo_bloqueado"
                label="Campo Bloqueado (disabled)"
                :disabled="true"
              />
            </div>

          </div>
        </div>
      </div>

      <!-- ── 4. Datalist ─────────────────────────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-info text-white fw-semibold" style="font-size: 0.85rem;">
          4 — Sugestões via datalist
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <FieldInput
                v-model="form.cidade"
                id="cidade"
                name="cidade"
                label="Cidade"
                placeholder="Digite ou escolha uma cidade"
                :options="cidades"
                :required="true"
                @validation="onValidation"
              />
              <div class="form-text">Sugestões: {{ cidades.join(', ') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ── 5. Campo Hidden ─────────────────────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-dark text-white fw-semibold" style="font-size: 0.85rem;">
          5 — Campo hidden
        </div>
        <div class="card-body">
          <FieldInput
            v-model="form.tokenHidden"
            id="token"
            name="token"
            type="hidden"
          />
          <p class="text-muted mb-0" style="font-size: 0.82rem;">
            Campo <code>type="hidden"</code> não renderiza estrutura visual.
            Valor atual no reativo: <strong>{{ form.tokenHidden }}</strong>
          </p>
        </div>
      </div>

      <!-- ── 6. Estado reativo do formulário ───────────────────────────────────── -->
      <div class="card mb-4 border-0 shadow-sm">
        <div class="card-header bg-light fw-semibold" style="font-size: 0.85rem;">
          6 — Valores reativos (v-model)
        </div>
        <div class="card-body">
          <pre class="bg-dark text-light rounded p-3 mb-0" style="font-size: 0.75rem; white-space: pre-wrap;">{{ JSON.stringify(form, null, 2) }}</pre>
        </div>
      </div>

      <!-- ── Botão de submit ─────────────────────────────────────────────────── -->
      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary px-5">
          Enviar Formulário
        </button>
      </div>

    </form>
  </div>
</template>
