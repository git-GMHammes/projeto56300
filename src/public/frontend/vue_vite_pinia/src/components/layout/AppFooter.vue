<script setup>
const year    = new Date().getFullYear()
const appName = import.meta.env.VITE_APP_NAME ?? 'HUB de Serviços'
</script>

<template>
  <footer class="py-3 px-4 border-top">
    <p class="small text-center text-muted mb-0">
      © {{ year }} {{ appName }} — Todos os direitos reservados.
    </p>
  </footer>
</template>
