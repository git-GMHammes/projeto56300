import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

/**
 * Configuração central do Vite.
 *
 * base automático por modo:
 *   npm run dev   → mode = 'development' → base = '/'
 *   npm run build → mode = 'production'  → base = '/frontend/vue_vite_pinia/dist/'
 *
 * .env.development é usado apenas em DEV (nunca sobe para o servidor).
 * Em produção, não há dependência de variáveis de ambiente.
 */
export default defineConfig(({ mode }) => {
  // Carrega .env.development em dev, .env.production em build (se existir)
  const env = loadEnv(mode, process.cwd(), '')

  const isDev = mode === 'development'

  return {
    plugins: [vue()],

    // ─── Caminho base automático ──────────────────────────────────────────────
    // DEV  → '/'                              → http://localhost:3000/
    // PROD → '/frontend/vue_vite_pinia/dist/' → http://servidor/frontend/vue_vite_pinia/dist/
    base: isDev ? '/' : '/frontend/vue_vite_pinia/dist/',

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },

    // ─── Build de Produção ────────────────────────────────────────────────────
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue':   ['vue', 'vue-router', 'pinia'],
            'vendor-axios': ['axios'],
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },

    // ─── Servidor de Desenvolvimento ─────────────────────────────────────────
    // Usado SOMENTE pelo npm run dev — não afeta o build de produção.
    server: {
      port: 3000,
      proxy: {
        // Proxy /api → backend CodeIgniter 4 (endereço lido do .env.development)
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:56300',
          changeOrigin: true,
          secure: false,
        },
      },
    },

    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'axios'],
    },
  }
})
