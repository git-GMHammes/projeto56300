<script setup>
// Componente raiz — apenas monta o router-view com transição suave entre páginas.
// Toda a lógica de layout está nas Views (Login, Dashboard, ServiceHub).
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>
