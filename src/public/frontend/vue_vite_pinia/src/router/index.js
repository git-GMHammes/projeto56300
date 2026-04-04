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
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, title: 'Login' },
  },
  {
    path: '/recuperar-senha',
    name: 'RecuperarSenha',
    component: () => import('@/views/RecuperarSenha.vue'),
    meta: { requiresAuth: false, title: 'Recuperar Senha' },
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: () => import('@/views/Cadastro.vue'),
    meta: { requiresAuth: false, title: 'Criar Conta' },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },
  {
    path: '/hub/:service',
    name: 'ServiceHub',
    component: () => import('@/views/ServiceHub.vue'),
    meta: { requiresAuth: true, title: 'Serviço' },
  },
  {
    // ── Módulo de Testes: Component Factory & Benchmark ──────────────────────
    // Isolado do guard de autenticação (requiresAuth: false).
    // Bootstrap 5 é injetado via CDN pelo layout e removido ao sair.
    path: '/modulo-teste',
    component: () => import('@/views/modulo-teste/ModuloTesteLayout.vue'),
    meta: { requiresAuth: false, title: 'Módulo Teste' },
    children: [
      {
        path: '',
        redirect: 'blank-canvas',
      },
      {
        path: 'blank-canvas',
        name: 'BlankCanvas',
        component: () => import('@/views/modulo-teste/BlankCanvas.vue'),
        meta: { requiresAuth: false, title: 'Blank Canvas' },
      },
      {
        // Placeholder — implementado na próxima iteração
        path: 'benchmarking-grid',
        name: 'BenchmarkingGrid',
        component: () => import('@/views/modulo-teste/BlankCanvas.vue'), // temporário
        meta: { requiresAuth: false, title: 'Benchmarking Grid' },
      },
      {
        // Placeholder — implementado na próxima iteração
        path: 'interatividade-js',
        name: 'InteratividadeJs',
        component: () => import('@/views/modulo-teste/BlankCanvas.vue'), // temporário
        meta: { requiresAuth: false, title: 'Interatividade JS' },
      },
    ],
  },
  {
    // Rota coringa — redireciona qualquer URL desconhecida para o dashboard
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
  if (['Login', 'Cadastro', 'RecuperarSenha'].includes(to.name) && authenticated) {
    return { name: 'Dashboard' }
  }
})

export default router
