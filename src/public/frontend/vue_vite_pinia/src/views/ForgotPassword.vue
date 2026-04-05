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
  <div class="min-vh-100 d-flex align-items-center justify-content-center p-3 auth-bg">
    <div class="auth-card-wrapper animate-fade-in">

      <!-- ── Logo ──────────────────────────────────────────────────────── -->
      <div class="text-center mb-4">
        <div class="icon-box-lg rounded-4 bg-primary text-white shadow
                    d-inline-flex align-items-center justify-content-center mb-3">
          🔑
        </div>
        <h1 class="h4 fw-bolder text-body mb-1">Recuperar Senha</h1>
        <p class="text-muted small mb-0">
          Informe seu e-mail cadastrado e enviaremos instruções de recuperação.
        </p>
      </div>

      <!-- ── Card ──────────────────────────────────────────────────────── -->
      <div class="card border-0 rounded-4 shadow-lg p-4">

        <!-- Sucesso -->
        <div v-if="success" class="d-flex flex-column align-items-center gap-3 py-4 text-center">
          <div class="fs-1">✅</div>
          <p class="text-success fw-medium mb-0">{{ msg }}</p>
          <BaseButton variant="outline" size="sm" @click="router.push('/login')">
            Voltar ao Login
          </BaseButton>
        </div>

        <!-- Formulário -->
        <form v-else class="vstack gap-4" @submit.prevent="handleRecover" novalidate>

          <!-- E-mail -->
          <div>
            <label for="mail" class="form-label fw-medium">E-mail cadastrado</label>
            <input
              id="mail"
              v-model.trim="mail"
              type="email"
              autocomplete="email"
              required
              placeholder="seu@email.com"
              class="form-control"
            />
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

          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="authStore.isLoading"
          >
            Enviar instruções
          </BaseButton>

          <div class="text-center small">
            <router-link to="/login" class="text-primary text-decoration-none">
              ← Voltar ao Login
            </router-link>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>
