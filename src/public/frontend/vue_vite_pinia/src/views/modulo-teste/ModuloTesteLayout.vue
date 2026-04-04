<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// ─── Injeção dinâmica do Bootstrap 5 via CDN ──────────────────────────────────
// Carregado apenas enquanto o módulo de teste estiver ativo.
// Removido ao sair para não afetar o restante do app (Tailwind).

const BOOTSTRAP_CSS_ID = 'bootstrap-cdn-css'
const BOOTSTRAP_JS_ID  = 'bootstrap-cdn-js'

function injectBootstrap() {
  // CSS
  if (!document.getElementById(BOOTSTRAP_CSS_ID)) {
    const link  = document.createElement('link')
    link.id     = BOOTSTRAP_CSS_ID
    link.rel    = 'stylesheet'
    link.href   = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }

  // JS Bundle (inclui Popper)
  if (!document.getElementById(BOOTSTRAP_JS_ID)) {
    const script   = document.createElement('script')
    script.id      = BOOTSTRAP_JS_ID
    script.src     = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js'
    script.crossOrigin = 'anonymous'
    script.defer   = true
    document.head.appendChild(script)
  }
}

function removeBootstrap() {
  document.getElementById(BOOTSTRAP_CSS_ID)?.remove()
  document.getElementById(BOOTSTRAP_JS_ID)?.remove()
}

onMounted(injectBootstrap)
onUnmounted(removeBootstrap)

// ─── Estado da sidebar ────────────────────────────────────────────────────────
const sidebarAberta = ref(true)
const route         = useRoute()

// Fábricas de componentes disponíveis no módulo
const fabricas = [
  {
    slug:    'blank-canvas',
    label:   'Blank Canvas',
    icon:    '🖼️',
    status:  'ativo',
    descricao: 'Estrutura mínima e testes de carga',
  },
  {
    slug:    'benchmarking-grid',
    label:   'Grid Benchmark',
    icon:    '📐',
    status:  'em breve',
    descricao: 'Bootstrap Grid vs CSS Grid/Flexbox',
  },
  {
    slug:    'interatividade-js',
    label:   'Interatividade JS',
    icon:    '⚡',
    status:  'em breve',
    descricao: 'Modais, Tooltips, Offcanvas, Dropdowns',
  },
]
</script>

<template>
  <!-- Container raiz: sem estilos Tailwind para não conflitar com Bootstrap -->
  <div id="modulo-teste-root" style="display: flex; min-height: 100vh; font-family: system-ui, sans-serif;">

    <!-- ── Sidebar ──────────────────────────────────────────────────────────── -->
    <aside
      :style="{
        width: sidebarAberta ? '260px' : '60px',
        transition: 'width 0.25s ease',
        background: '#1e1e2e',
        color: '#cdd6f4',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '2px 0 8px rgba(0,0,0,0.4)',
        zIndex: 100,
      }"
    >
      <!-- Cabeçalho da sidebar -->
      <div style="padding: 1rem; border-bottom: 1px solid #313244; display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
        <span v-if="sidebarAberta" style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #89b4fa; white-space: nowrap;">
          Component Factory
        </span>
        <!-- Botão toggle -->
        <button
          @click="sidebarAberta = !sidebarAberta"
          style="background: #313244; border: none; color: #cdd6f4; border-radius: 6px; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1rem;"
          :title="sidebarAberta ? 'Recolher sidebar' : 'Expandir sidebar'"
        >
          {{ sidebarAberta ? '◀' : '▶' }}
        </button>
      </div>

      <!-- Rótulo seção -->
      <div v-if="sidebarAberta" style="padding: 0.75rem 1rem 0.25rem; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6c7086;">
        Fábricas
      </div>

      <!-- Lista de fábricas -->
      <nav style="padding: 0.5rem; flex: 1;">
        <router-link
          v-for="fabrica in fabricas"
          :key="fabrica.slug"
          :to="fabrica.status === 'ativo' ? `/modulo-teste/${fabrica.slug}` : ''"
          custom
          v-slot="{ navigate, isActive }"
        >
          <div
            @click="fabrica.status === 'ativo' && navigate()"
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: sidebarAberta ? '0.6rem 0.75rem' : '0.6rem',
              borderRadius: '8px',
              marginBottom: '4px',
              cursor: fabrica.status === 'ativo' ? 'pointer' : 'not-allowed',
              background: isActive ? '#313244' : 'transparent',
              borderLeft: isActive ? '3px solid #89b4fa' : '3px solid transparent',
              transition: 'background 0.15s',
              textDecoration: 'none',
              color: fabrica.status === 'ativo' ? '#cdd6f4' : '#585b70',
              justifyContent: sidebarAberta ? 'flex-start' : 'center',
            }"
            :title="!sidebarAberta ? fabrica.label : ''"
          >
            <!-- Ícone -->
            <span style="font-size: 1.1rem; flex-shrink: 0;">{{ fabrica.icon }}</span>

            <!-- Label + badge (visível só quando aberta) -->
            <template v-if="sidebarAberta">
              <div style="flex: 1; min-width: 0;">
                <div style="font-size: 0.85rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ fabrica.label }}
                </div>
                <div style="font-size: 0.65rem; color: #6c7086; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  {{ fabrica.descricao }}
                </div>
              </div>
              <!-- Badge de status -->
              <span
                v-if="fabrica.status !== 'ativo'"
                style="font-size: 0.55rem; padding: 2px 6px; border-radius: 20px; background: #313244; color: #6c7086; white-space: nowrap; flex-shrink: 0;"
              >
                em breve
              </span>
            </template>
          </div>
        </router-link>
      </nav>

      <!-- Rodapé da sidebar -->
      <div v-if="sidebarAberta" style="padding: 0.75rem 1rem; border-top: 1px solid #313244; font-size: 0.65rem; color: #45475a; line-height: 1.5;">
        Bootstrap <strong style="color: #89b4fa;">5.3.x</strong> via CDN<br>
        Vue 3 + Vite + Pinia
      </div>
    </aside>

    <!-- ── Conteúdo principal ──────────────────────────────────────────────── -->
    <main style="flex: 1; min-width: 0; background: #f8f9fa; overflow-y: auto;">
      <!-- Barra de topo do módulo -->
      <div style="background: #fff; border-bottom: 1px solid #dee2e6; padding: 0.6rem 1.25rem; display: flex; align-items: center; gap: 0.75rem; position: sticky; top: 0; z-index: 50;">
        <span style="font-size: 0.7rem; color: #6c757d; font-family: monospace;">
          📍 {{ route.path }}
        </span>
        <span style="font-size: 0.7rem; background: #e7f3ff; color: #0d6efd; padding: 2px 8px; border-radius: 20px; font-weight: 600;">
          Módulo Teste
        </span>
        <!-- Link de volta ao app -->
        <router-link
          to="/dashboard"
          style="margin-left: auto; font-size: 0.7rem; color: #6c757d; text-decoration: none;"
        >
          ← Voltar ao App
        </router-link>
      </div>

      <!-- Router-view filho -->
      <router-view />
    </main>
  </div>
</template>
