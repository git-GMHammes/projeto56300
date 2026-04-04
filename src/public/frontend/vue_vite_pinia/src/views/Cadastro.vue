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
  <div
    class="min-h-screen flex items-center justify-center p-4
           bg-gradient-to-br from-primary-50 via-white to-blue-50
           dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
  >
    <div class="w-full max-w-lg animate-fade-in">

      <!-- ── Header ─────────────────────────────────────────────────────── -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl
                    bg-primary-600 dark:bg-primary-500 text-white text-3xl
                    shadow-lg shadow-primary-200 dark:shadow-primary-900/40 mb-4">
          👤
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Criar Conta
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Preencha os dados para criar seu acesso
        </p>
      </div>

      <!-- ── Indicador de etapa ─────────────────────────────────────────── -->
      <div class="flex items-center justify-center gap-3 mb-6">
        <div
          v-for="n in 2" :key="n"
          :class="[
            'flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold transition-colors',
            step >= n
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 dark:bg-slate-700 text-gray-500 dark:text-gray-400'
          ]"
        >{{ n }}</div>
        <div class="h-0.5 w-10 bg-gray-200 dark:bg-slate-700 rounded" style="margin: 0 -4px;" />
      </div>

      <!-- ── Card ──────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                  border border-gray-100 dark:border-slate-700 p-8">

        <!-- ─── ETAPA 1: Acesso ──────────────────────────────────────────── -->
        <form v-if="step === 1" class="space-y-5" @submit.prevent="handleStep1" novalidate>

          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300">
            Etapa 1 — Dados de Acesso
          </h2>

          <!-- Usuário -->
          <div>
            <label for="reg-user" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Usuário <span class="text-red-500">*</span>
            </label>
            <input
              id="reg-user"
              v-model.trim="step1.user"
              type="text"
              autocomplete="username"
              required
              placeholder="seu.usuario"
              class="form-input"
            />
          </div>

          <!-- Senha -->
          <div>
            <label for="reg-pass" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Senha <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="reg-pass"
                v-model="step1.password"
                :type="showPass ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="Mínimo 6 caracteres"
                class="form-input pr-10"
              />
              <button type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="showPass = !showPass">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
            <label for="reg-confirm" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Confirmar Senha <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="reg-confirm"
                v-model="step1.password_confirm"
                :type="showConfirm ? 'text' : 'password'"
                autocomplete="new-password"
                required
                placeholder="••••••••"
                class="form-input pr-10"
                :class="step1.password_confirm && !passwordOk
                  ? 'border-red-400 focus:ring-red-400'
                  : ''"
              />
              <button type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="showConfirm = !showConfirm">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="showConfirm" stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            <p v-if="step1.password_confirm && !passwordOk"
               class="mt-1 text-xs text-red-500">
              As senhas não coincidem ou têm menos de 6 caracteres.
            </p>
          </div>

          <!-- Erro -->
          <transition name="fade">
            <div v-if="errorMsg"
              class="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20
                     border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm"
            >
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
        <form v-else class="space-y-5" @submit.prevent="handleStep2" novalidate>

          <h2 class="text-base font-semibold text-gray-700 dark:text-gray-300">
            Etapa 2 — Dados Pessoais
          </h2>

          <!-- Nome -->
          <div>
            <label for="reg-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Nome completo <span class="text-red-500">*</span>
            </label>
            <input id="reg-name" v-model.trim="step2.name" type="text" required
              placeholder="João da Silva" class="form-input" />
          </div>

          <!-- E-mail -->
          <div>
            <label for="reg-mail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              E-mail <span class="text-red-500">*</span>
            </label>
            <input id="reg-mail" v-model.trim="step2.mail" type="email" required
              placeholder="seu@email.com" class="form-input" />
          </div>

          <!-- CPF / WhatsApp em linha -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="reg-cpf" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                CPF
              </label>
              <input id="reg-cpf" v-model.trim="step2.cpf" type="text"
                placeholder="000.000.000-00" class="form-input" />
            </div>
            <div>
              <label for="reg-whatsapp" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                WhatsApp
              </label>
              <input id="reg-whatsapp" v-model.trim="step2.whatsapp" type="text"
                placeholder="(00) 90000-0000" class="form-input" />
            </div>
          </div>

          <!-- Telefone / Data de nascimento -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="reg-phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Telefone
              </label>
              <input id="reg-phone" v-model.trim="step2.phone" type="text"
                placeholder="(00) 0000-0000" class="form-input" />
            </div>
            <div>
              <label for="reg-birth" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Data de nascimento
              </label>
              <input id="reg-birth" v-model="step2.date_birth" type="date" class="form-input" />
            </div>
          </div>

          <!-- CEP / Endereço -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="reg-zip" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                CEP
              </label>
              <input id="reg-zip" v-model.trim="step2.zip_code" type="text"
                placeholder="00000-000" class="form-input" />
            </div>
            <div>
              <label for="reg-address" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Endereço
              </label>
              <input id="reg-address" v-model.trim="step2.address" type="text"
                placeholder="Rua, número" class="form-input" />
            </div>
          </div>

          <!-- Perfil (opcional) -->
          <div>
            <label for="reg-profile" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Perfil <span class="text-xs text-gray-400">(opcional)</span>
            </label>
            <input id="reg-profile" v-model.trim="step2.profile" type="text"
              placeholder="Ex: Administrador, Operador..." class="form-input" />
          </div>

          <!-- Erro -->
          <transition name="fade">
            <div v-if="errorMsg"
              class="flex items-center gap-2.5 p-3 rounded-lg bg-red-50 dark:bg-red-900/20
                     border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 text-sm"
            >
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
                     4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMsg }}</span>
            </div>
          </transition>

          <div class="flex gap-3">
            <BaseButton type="button" variant="outline" size="lg" @click="step = 1; errorMsg = ''">
              ← Voltar
            </BaseButton>
            <BaseButton type="submit" variant="primary" size="lg" block :loading="authStore.isLoading">
              Criar Conta
            </BaseButton>
          </div>

        </form>

        <!-- ── Link para login ───────────────────────────────────────────── -->
        <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Já tem uma conta?
          <router-link to="/login"
            class="ml-1 font-medium text-primary-600 dark:text-primary-400 hover:underline">
            Fazer Login
          </router-link>
        </div>
      </div>

      <p class="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
        Plataforma HUB Multi-Serviços · {{ new Date().getFullYear() }}
      </p>
    </div>
  </div>
</template>
