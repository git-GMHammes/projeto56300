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
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3 auth-bg">
    <div class="auth-card-wrapper animate-fade-in">

      <!-- ── Logo ──────────────────────────────────────────────────────── -->
      <div class="text-center mb-4">
        <div class="icon-box-lg rounded-4 bg-primary text-white shadow
                    d-inline-flex align-items-center justify-content-center mb-3">
          🔌
        </div>
        <h1 class="h4 fw-bolder text-body mb-1">HUB de Serviços</h1>
        <p class="text-muted small mb-0">Painel Multi-tenant · Faça login para continuar</p>
      </div>

      <!-- ── Card do formulário ─────────────────────────────────────────── -->
      <div class="card border-0 rounded-4 shadow-lg p-4">

        <form class="vstack gap-4" @submit.prevent="handleLogin" novalidate>

          <!-- Usuário -->
          <div>
            <label for="user" class="form-label fw-medium">Usuário</label>
            <input
              id="user"
              v-model.trim="form.user"
              type="text"
              autocomplete="username"
              required
              placeholder="seu.usuario"
              class="form-control"
            />
          </div>

          <!-- Senha -->
          <div>
            <div class="d-flex align-items-center justify-content-between mb-2">
              <label for="password" class="form-label fw-medium mb-0">Senha</label>
              <router-link to="/recuperar-senha" class="small text-primary text-decoration-none">
                Esqueceu a senha?
              </router-link>
            </div>
            <div class="input-group">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                placeholder="••••••••"
                class="form-control"
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="showPassword = !showPassword"
              >
                <svg class="icon-xs" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
            <div v-if="errorMsg" class="alert alert-danger d-flex align-items-center gap-2 py-2 small mb-0">
              <svg class="icon-xs flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
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
        <div class="mt-4 text-center small text-muted">
          Não tem uma conta?
          <router-link to="/cadastro" class="ms-1 fw-medium text-primary text-decoration-none">
            Criar conta
          </router-link>
        </div>
      </div>

      <p class="text-center small text-muted mt-4 mb-0">
        Plataforma HUB Multi-Serviços · {{ new Date().getFullYear() }}
      </p>

    </div>
  </div>
</template>
