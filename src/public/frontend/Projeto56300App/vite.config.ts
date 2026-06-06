import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
    hmr: {
      host: 'localhost',
      clientPort: 56303,
    },
    watch: {
      usePolling: true,
    },
  },
})