<script setup>
import { reactive, ref } from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '@/stores/auth'
import BaseButton        from '@/components/common/BaseButton.vue'

const router    = useRouter()
const authStore = useAuthStore()

const form = reactive({ user: '', password: '' })

const errorMsg     = ref('')
const showPassword = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  const result = await authStore.login(form)
  if (result.success) {
    router.push('/dashboard')
  } else {
    errorMsg.value = result.message
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
          🔌
        </div>
        <h1 class="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
          HUB de Serviços
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Painel Multi-tenant · Faça login para continuar
        </p>
      </div>

      <!-- ── Card do formulário ─────────────────────────────────────────── -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                  border border-gray-100 dark:border-slate-700 p-8">

        <form class="space-y-5" @submit.prevent="handleLogin" novalidate>

          <!-- Usuário -->
          <div>
            <label
              for="user"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
            >
              Usuário
            </label>
            <input
              id="user"
              v-model.trim="form.user"
              type="text"
              autocomplete="username"
              required
              placeholder="seu.usuario"
              class="form-input"
            />
          </div>

          <!-- Senha -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label
                for="password"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Senha
              </label>
              <router-link
                to="/recuperar-senha"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              >
                Esqueceu a senha?
              </router-link>
            </div>
            <div class="relative">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="form-input pr-10"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-0 flex items-center px-3
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                @click="showPassword = !showPassword"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path v-if="showPassword" stroke-linecap="round" stroke-linejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97
                       0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88
                       9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0
                       0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478
                       0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
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

          <!-- Submit -->
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="authStore.isLoading"
          >
            Entrar no Sistema
          </BaseButton>

        </form>

        <!-- ── Links auxiliares ──────────────────────────────────────────── -->
        <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Não tem uma conta?
          <router-link
            to="/cadastro"
            class="ml-1 font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            Criar conta
          </router-link>
        </div>
      </div>

      <p class="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">
        Plataforma HUB Multi-Serviços · {{ new Date().getFullYear() }}
      </p>

    </div>
  </div>
</template>
