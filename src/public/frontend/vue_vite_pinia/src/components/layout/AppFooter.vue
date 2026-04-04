<script setup>
const year    = new Date().getFullYear()
const appName = import.meta.env.VITE_APP_NAME ?? 'HUB de Serviços'
</script>

<template>
  <footer class="py-4 px-6 border-t border-gray-100 dark:border-slate-800">
    <p class="text-xs text-center text-gray-400 dark:text-gray-600">
      © {{ year }} {{ appName }} — Todos os direitos reservados.
    </p>
  </footer>
</template>
