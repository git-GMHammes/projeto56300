import { createRouter, createWebHashHistory } from 'vue-router'
import { tokenService } from '@/services/tokenService'

/**
 * Roteamento do HUB.
 *
 * Modo: Hash History (createWebHashHistory)
 * → URLs no formato /#/dashboard, /#/login, etc.
 * → Funciona em Apache Shared Hosting SEM configuração adicional de servidor.
 * → O fragmento # nunca chega ao servidor, eliminando o problema de 404.
 *
 * Lazy loading em todas as views → reduz o bundle inicial.
 */
const routes = [
  // localhost:3000/#/
  {
    path: '/',
    redirect: '/dashboard',
  },

  // localhost:3000/#/login
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, title: 'Login' },
  },

  // localhost:3000/#/forgot-password
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/ForgotPassword.vue'),
    meta: { requiresAuth: false, title: 'Recuperar Senha' },
  },

  // localhost:3000/#/register
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresAuth: false, title: 'Criar Conta' },
  },

  // localhost:3000/#/dashboard
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },

  // localhost:3000/#/hub/:service
  {
    path: '/hub/:service',
    name: 'ServiceHub',
    component: () => import('@/views/ServiceHub.vue'),
    meta: { requiresAuth: true, title: 'Serviço' },
  },

  // localhost:3000/#/test-module/blank-canvas
  {
    path: '/test-module/blank-canvas',
    name: 'BlankCanvas',
    component: () => import('@/views/test-module/BlankCanvas.vue'),
    meta: { requiresAuth: false, title: 'Blank Canvas' },
  },

  // localhost:3000/#/free
  {
    path: '/free',
    name: 'Free',
    component: () => import('@/views/Free.vue'),
    meta: { requiresAuth: false, title: 'Livre' },
  },

  // localhost:3000/#/:pathMatch — coringa, redireciona qualquer URL desconhecida para o dashboard
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),
})

// ─── Navigation Guard Global ──────────────────────────────────────────────────
router.beforeEach((to) => {
  // Atualiza o título da aba do navegador
  const appName = import.meta.env.VITE_APP_NAME ?? 'HUB de Serviços'
  document.title = to.meta.title ? `${to.meta.title} — ${appName}` : appName

  const authenticated = tokenService.isAuthenticated()

  // Rota protegida sem autenticação → vai para login
  if (to.meta.requiresAuth && !authenticated) {
    return { name: 'Login' }
  }

  // Já autenticado tentando acessar login, cadastro ou recuperar senha → vai para dashboard
  if (['Login', 'Register', 'ForgotPassword'].includes(to.name) && authenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
