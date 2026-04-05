<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'

const router    = useRouter()
const authStore = useAuthStore()

const step        = ref(1)
const errorMsg    = ref('')
const showPass    = ref(false)
const showConfirm = ref(false)

// ── Etapa 1: user_management ───────────────────────────────────────────────
const step1 = reactive({
  user:             '',
  password:         '',
  password_confirm: '',
})

// ── Etapa 2: user_customer ─────────────────────────────────────────────────
const step2 = reactive({
  name:       '',
  cpf:        '',
  mail:       '',
  whatsapp:   '',
  phone:      '',
  date_birth: '',
  zip_code:   '',
  address:    '',
  profile:    '',
})

// validity oculto: hoje + 1 dia
function validityDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 19).replace('T', ' ')
}

const passwordOk = computed(() =>
  step1.password.length >= 6 &&
  step1.password === step1.password_confirm
)

async function handleStep1() {
  errorMsg.value = ''

  if (!step1.user.trim()) {
    errorMsg.value = 'Informe o nome de usuário.'
    return
  }
  if (!passwordOk.value) {
    errorMsg.value = 'As senhas não coincidem ou têm menos de 6 caracteres.'
    return
  }

  // Avança para etapa 2 (a conta só é criada ao concluir a etapa 2)
  step.value = 2
}

async function handleStep2() {
  errorMsg.value = ''

  if (!step2.name.trim() || !step2.mail.trim()) {
    errorMsg.value = 'Nome e e-mail são obrigatórios.'
    return
  }

  const payload = {
    // user_management
    user:     step1.user,
    password: step1.password,
    // user_customer
    ...step2,
    validity: validityDate(),
  }

  const result = await authStore.register(payload)

  if (result.success) {
    router.push('/login')
  } else {
    errorMsg.value = result.message ?? 'Erro ao criar conta.'
  }
}
</script>

<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3 auth-bg">
    <div class="auth-card-wrapper-lg animate-fade-in">

      <!-- ── Header ─────────────────────────────────────────────────────── -->
      <div class="text-center mb-4">
        <div class="icon-box-lg rounded-4 bg-primary text-white shadow
                    d-inline-flex align-items-center justify-content-center mb-3">
          👤
        </div>
        <h1 class="h4 fw-bolder text-body mb-1">Criar Conta</h1>
        <p class="text-muted small mb-0">Preencha os dados para criar seu acesso</p>
      </div>

      <!-- ── Indicador de etapas ─────────────────────────────────────────── -->
      <div class="d-flex align-items-center justify-content-center gap-2 mb-4">
        <div
          class="step-badge d-flex align-items-center justify-content-center rounded-circle fw-bold"
          :class="step >= 1 ? 'bg-primary text-white' : 'bg-body-secondary text-secondary'"
        >1</div>
        <hr class="step-line" />
        <div
          class="step-badge d-flex align-items-center justify-content-center rounded-circle fw-bold"
          :class="step >= 2 ? 'bg-primary text-white' : 'bg-body-secondary text-secondary'"
        >2</div>
      </div>

      <!-- ── Card ──────────────────────────────────────────────────────── -->
      <div class="card border-0 rounded-4 shadow-lg p-4">

        <!-- ─── ETAPA 1: Acesso ──────────────────────────────────────────── -->
        <form v-if="step === 1" class="vstack gap-4" @submit.prevent="handleStep1" novalidate>

          <h2 class="fs-6 fw-semibold text-body-secondary mb-0">Etapa 1 — Dados de Acesso</h2>

          <!-- Usuário -->
          <div>
            <label for="reg-user" class="form-label fw-medium">
              Usuário <span class="text-danger">*</span>
            </label>
            <input
              id="reg-user"
              v-model.trim="step1.user"
              type="text"
              autocomplete="username"
              required
              placeholder="seu.usuario"
              class="form-control"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="reg-pass" class="form-label fw-medium">
              Senha <span class="text-danger">*</span>
            </label>
            <div class="input-group">
              <input
                id="reg-pass"
                v-model="step1.password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="Mínimo 6 caracteres"
                class="form-control"
              />
              <button type="button" class="btn btn-outline-secondary" @click="showPass = !showPass">
                <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="showPass" stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label for="reg-confirm" class="form-label fw-medium">
              Confirmar Senha <span class="text-danger">*</span>
            </label>
            <div class="input-group">
              <input
                id="reg-confirm"
                v-model="step1.password_confirm"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="••••••••"
                class="form-control"
                :class="step1.password_confirm && !passwordOk ? 'is-invalid' : ''"
              />
              <button type="button" class="btn btn-outline-secondary" @click="showConfirm = !showConfirm">
                <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="showConfirm" stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <div v-if="step1.password_confirm && !passwordOk" class="invalid-feedback">
                As senhas não coincidem ou têm menos de 6 caracteres.
              </div>
            </div>
          </div>

          <!-- Erro -->
          <transition name="fade">
            <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-0">
              <svg class="icon-xs flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
                     4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMsg }}</span>
            </div>
          </transition>

          <BaseButton type="submit" variant="primary" size="lg" block>
            Próxima Etapa →
          </BaseButton>

        </form>

        <!-- ─── ETAPA 2: Dados pessoais ──────────────────────────────────── -->
        <form v-else class="vstack gap-3" @submit.prevent="handleStep2" novalidate>

          <h2 class="fs-6 fw-semibold text-body-secondary mb-0">Etapa 2 — Dados Pessoais</h2>

          <!-- Nome -->
          <div>
            <label for="reg-name" class="form-label fw-medium">
              Nome completo <span class="text-danger">*</span>
            </label>
            <input id="reg-name" v-model.trim="step2.name" type="text" required
              placeholder="João da Silva" class="form-control" />
          </div>

          <!-- E-mail -->
          <div>
            <label for="reg-mail" class="form-label fw-medium">
              E-mail <span class="text-danger">*</span>
            </label>
            <input id="reg-mail" v-model.trim="step2.mail" type="email" required
              placeholder="seu@email.com" class="form-control" />
          </div>

          <!-- CPF / WhatsApp em linha -->
          <div class="row g-3">
            <div class="col-6">
              <label for="reg-cpf" class="form-label fw-medium">CPF</label>
              <input id="reg-cpf" v-model.trim="step2.cpf" type="text"
                placeholder="000.000.000-00" class="form-control" />
            </div>
            <div class="col-6">
              <label for="reg-whatsapp" class="form-label fw-medium">WhatsApp</label>
              <input id="reg-whatsapp" v-model.trim="step2.whatsapp" type="text"
                placeholder="(00) 90000-0000" class="form-control" />
            </div>
          </div>

          <!-- Telefone / Data de nascimento -->
          <div class="row g-3">
            <div class="col-6">
              <label for="reg-phone" class="form-label fw-medium">Telefone</label>
              <input id="reg-phone" v-model.trim="step2.phone" type="text"
                placeholder="(00) 0000-0000" class="form-control" />
            </div>
            <div class="col-6">
              <label for="reg-birth" class="form-label fw-medium">Data de nascimento</label>
              <input id="reg-birth" v-model="step2.date_birth" type="date" class="form-control" />
            </div>
          </div>

          <!-- CEP / Endereço -->
          <div class="row g-3">
            <div class="col-6">
              <label for="reg-zip" class="form-label fw-medium">CEP</label>
              <input id="reg-zip" v-model.trim="step2.zip_code" type="text"
                placeholder="00000-000" class="form-control" />
            </div>
            <div class="col-6">
              <label for="reg-address" class="form-label fw-medium">Endereço</label>
              <input id="reg-address" v-model.trim="step2.address" type="text"
                placeholder="Rua, número" class="form-control" />
            </div>
          </div>

          <!-- Perfil (opcional) -->
          <div>
            <label for="reg-profile" class="form-label fw-medium">
              Perfil <span class="small text-muted">(opcional)</span>
            </label>
            <input id="reg-profile" v-model.trim="step2.profile" type="text"
              placeholder="Ex: Administrador, Operador..." class="form-control" />
          </div>

          <!-- Erro -->
          <transition name="fade">
            <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-0">
              <svg class="icon-xs flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
                     4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMsg }}</span>
            </div>
          </transition>

          <div class="d-flex gap-3">
            <BaseButton type="button" variant="outline" size="lg" @click="step = 1; errorMsg = ''">
              ← Voltar
            </BaseButton>
            <BaseButton type="submit" variant="primary" size="lg" block :loading="authStore.isLoading">
              Criar Conta
            </BaseButton>
          </div>

        </form>

        <!-- ── Link para login ───────────────────────────────────────────── -->
        <div class="mt-4 text-center small text-muted">
          Já tem uma conta?
          <router-link to="/login" class="ms-1 fw-medium text-primary text-decoration-none">
            Fazer Login
          </router-link>
        </div>
      </div>

      <p class="text-center small text-muted mt-4 mb-0">
        Plataforma HUB Multi-Serviços · {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>
