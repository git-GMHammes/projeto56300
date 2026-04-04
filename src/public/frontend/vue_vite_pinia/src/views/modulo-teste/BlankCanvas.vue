<script setup>
import { onMounted, ref } from 'vue'

// ─── Métricas de carregamento ─────────────────────────────────────────────────
// Performance.now() marca o tempo desde a origem do documento (navigation start).
// Útil para medir quanto tempo levou até o componente estar montado e funcional.

const t0 = performance.now()  // Capturado na criação do componente (setup)

const metricas = ref({
  setupTime:    null, // Tempo até o script setup executar (ms)
  mountedTime:  null, // Tempo até onMounted disparar (ms)
  delta:        null, // Diferença entre setup e mounted
  timestamp:    null, // Horário legível
  bootstrapCss: false,
  bootstrapJs:  false,
})

onMounted(() => {
  const tMounted = performance.now()

  // Verifica se o Bootstrap foi carregado pelo layout pai
  metricas.value.bootstrapCss = !!document.getElementById('bootstrap-cdn-css')
  metricas.value.bootstrapJs  = !!document.getElementById('bootstrap-cdn-js')

  metricas.value.setupTime   = t0.toFixed(2)
  metricas.value.mountedTime = tMounted.toFixed(2)
  metricas.value.delta       = (tMounted - t0).toFixed(2)
  metricas.value.timestamp   = new Date().toLocaleTimeString('pt-BR', { hour12: false })

  // Log no console para inspeção no DevTools
  console.group('%c[BlankCanvas] Métricas de Carregamento', 'color: #89b4fa; font-weight: bold;')
  console.log('%cScript setup iniciou em:', 'color: #a6e3a1;', `${metricas.value.setupTime} ms`)
  console.log('%conMounted disparou em:  ', 'color: #a6e3a1;', `${metricas.value.mountedTime} ms`)
  console.log('%cDelta (setup → mounted):', 'color: #f9e2af;', `${metricas.value.delta} ms`)
  console.log('%cBootstrap CSS injetado: ', 'color: #cba6f7;', metricas.value.bootstrapCss)
  console.log('%cBootstrap JS  injetado: ', 'color: #cba6f7;', metricas.value.bootstrapJs)
  console.log('%cTimestamp:              ', 'color: #89dceb;', metricas.value.timestamp)
  console.groupEnd()
})
</script>

<template>
  <div class="container-fluid py-4 px-4">

    <!-- ── Cabeçalho da página ────────────────────────────────────────────── -->
    <div class="row mb-4">
      <div class="col">
        <div class="d-flex align-items-center gap-3 mb-1">
          <span class="fs-2">🖼️</span>
          <div>
            <h1 class="h4 mb-0 fw-bold text-dark">Blank Canvas</h1>
            <p class="text-muted small mb-0">
              Página de estrutura mínima — base para testes de carga e benchmark inicial.
            </p>
          </div>
        </div>
        <!-- Breadcrumb Bootstrap nativo -->
        <nav aria-label="breadcrumb" class="mt-2">
          <ol class="breadcrumb small">
            <li class="breadcrumb-item"><a href="#" class="text-decoration-none">Módulo Teste</a></li>
            <li class="breadcrumb-item active" aria-current="page">Blank Canvas</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- ── Cards de métricas ─────────────────────────────────────────────── -->
    <div class="row g-3 mb-4">

      <!-- Setup time -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">⏱ Setup iniciou em</p>
            <p class="h5 fw-bold text-primary mb-0 font-monospace">
              {{ metricas.setupTime ?? '…' }} ms
            </p>
            <p class="text-muted" style="font-size: 0.65rem;">desde navigation start</p>
          </div>
        </div>
      </div>

      <!-- Mounted time -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">🏁 onMounted em</p>
            <p class="h5 fw-bold text-success mb-0 font-monospace">
              {{ metricas.mountedTime ?? '…' }} ms
            </p>
            <p class="text-muted" style="font-size: 0.65rem;">desde navigation start</p>
          </div>
        </div>
      </div>

      <!-- Delta -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">🔀 Delta</p>
            <p class="h5 fw-bold text-warning mb-0 font-monospace">
              {{ metricas.delta ?? '…' }} ms
            </p>
            <p class="text-muted" style="font-size: 0.65rem;">setup → mounted</p>
          </div>
        </div>
      </div>

      <!-- Timestamp -->
      <div class="col-6 col-md-3">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-body">
            <p class="text-muted small mb-1">🕐 Timestamp</p>
            <p class="h5 fw-bold text-info mb-0 font-monospace">
              {{ metricas.timestamp ?? '…' }}
            </p>
            <p class="text-muted" style="font-size: 0.65rem;">horário local (pt-BR)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Status do Bootstrap ────────────────────────────────────────────── -->
    <div class="row g-3 mb-4">
      <div class="col">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-dark text-light py-2 small fw-semibold">
            🔧 Status Bootstrap CDN
          </div>
          <div class="card-body d-flex gap-3 flex-wrap">
            <span :class="metricas.bootstrapCss ? 'badge bg-success' : 'badge bg-danger'">
              {{ metricas.bootstrapCss ? '✓' : '✗' }} CSS (bootstrap.min.css)
            </span>
            <span :class="metricas.bootstrapJs ? 'badge bg-success' : 'badge bg-danger'">
              {{ metricas.bootstrapJs ? '✓' : '✗' }} JS Bundle (bootstrap.bundle.min.js)
            </span>
            <span class="badge bg-secondary">Bootstrap 5.3.x via CDN</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Área de canvas livre ───────────────────────────────────────────── -->
    <div class="row">
      <div class="col">
        <div class="card border-dashed border-2 border-secondary shadow-none">
          <div class="card-body text-center py-5">
            <p class="display-6 mb-2">🎨</p>
            <h5 class="text-muted">Área de Canvas Livre</h5>
            <p class="text-muted small mb-3">
              Insira componentes Bootstrap ou Custom aqui para testes pontuais.<br>
              Esta área não tem estilos aplicados além do Bootstrap base.
            </p>
            <!-- Exemplo: Alert Bootstrap nativo -->
            <div class="alert alert-info d-inline-flex align-items-center gap-2 text-start" role="alert">
              <span>ℹ️</span>
              <div>
                Este <strong>alert</strong> é 100% Bootstrap nativo — sem nenhuma classe customizada.
                Confirma que o CDN foi carregado corretamente.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Instruções console ─────────────────────────────────────────────── -->
    <div class="row mt-4">
      <div class="col">
        <div class="card border-0 bg-dark text-light shadow-sm">
          <div class="card-header py-2 small fw-semibold" style="background: #1e1e2e; border-bottom: 1px solid #313244;">
            💻 Console Log — abra o DevTools (F12) para ver as métricas completas
          </div>
          <div class="card-body font-monospace small" style="background: #1e1e2e; border-radius: 0 0 0.375rem 0.375rem;">
            <div class="text-info">[BlankCanvas] Métricas de Carregamento</div>
            <div class="text-success">Script setup iniciou em: <span class="text-white">{{ metricas.setupTime }} ms</span></div>
            <div class="text-success">onMounted disparou em:   <span class="text-white">{{ metricas.mountedTime }} ms</span></div>
            <div class="text-warning">Delta (setup → mounted): <span class="text-white">{{ metricas.delta }} ms</span></div>
            <div class="text-info">Bootstrap CSS injetado:  <span :class="metricas.bootstrapCss ? 'text-success' : 'text-danger'">{{ metricas.bootstrapCss }}</span></div>
            <div class="text-info">Bootstrap JS  injetado:  <span :class="metricas.bootstrapJs ? 'text-success' : 'text-danger'">{{ metricas.bootstrapJs }}</span></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
