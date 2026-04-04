<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BaseButton from '@/components/common/BaseButton.vue'

const router    = useRouter()
const authStore = useAuthStore()

const mail      = ref('')
const msg       = ref('')
const success   = ref(false)
const errorMsg  = ref('')

async function handleRecover() {
  errorMsg.value = ''
  msg.value      = ''

  const result = await authStore.recoverPassword(mail.value)

  if (result.success) {
    success.value = true
    msg.value     = result.message ?? 'Instruções enviadas para o e-mail informado.'
  } else {
    errorMsg.value = result.message ?? 'Não foi possível processar a solicitação.'
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center p-4
           bg-gradient-to-br from-primary-50 via-white to-blue-50
           dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
  >
    <div class="w-full max-w-md animate-fade-in">

      <!-- ── Logo ──────────────────────────────────────────────────────── -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl
                    bg-primary-600 dark:bg-primary-500 text-white text-3xl
                    shadow-lg shadow-primary-200 dark:shadow-primary-900/40 mb-4">
          🔑
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          Recuperar Senha
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Informe seu e-mail cadastrado e enviaremos instruções de recuperação.
        </p>
      </div>

      <!-- ── Card ──────────────────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                  border border-gray-100 dark:border-slate-700 p-8">

        <!-- Sucesso -->
        <div
          v-if="success"
          class="flex flex-col items-center gap-3 py-4 text-center"
        >
          <div class="text-4xl">✅</div>
          <p class="text-green-600 dark:text-green-400 font-medium">{{ msg }}</p>
          <BaseButton variant="outline" size="sm" @click="router.push('/login')">
            Voltar ao Login
          </BaseButton>
        </div>

        <!-- Formulário -->
        <form v-else class="space-y-5" @submit.prevent="handleRecover" novalidate>

          <!-- E-mail -->
          <div>
            <label
              for="mail"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              E-mail cadastrado
            </label>
            <input
              id="mail"
              v-model.trim="mail"
              type="email"
              autocomplete="email"
              required
              placeholder="seu@email.com"
              class="form-input"
            />
          </div>

          <!-- Mensagem de erro -->
          <transition name="fade">
            <div
              v-if="errorMsg"
              class="flex items-center gap-2.5 p-3 rounded-lg
                     bg-red-50 dark:bg-red-900/20
                     border border-red-200 dark:border-red-700
                     text-red-600 dark:text-red-400 text-sm"
            >
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732
                     4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{{ errorMsg }}</span>
            </div>
          </transition>

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="authStore.isLoading"
          >
            Enviar instruções
          </BaseButton>

          <div class="text-center text-sm">
            <router-link
              to="/login"
              class="text-primary-600 dark:text-primary-400 hover:underline"
            >
              ← Voltar ao Login
            </router-link>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
