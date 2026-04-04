import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

const SETTINGS_KEY = 'hub_settings'

/**
 * Store de configurações e preferências do usuário.
 * Persiste automaticamente no localStorage via watcher.
 */
export const useSettingsStore = defineStore('settings', () => {
  // ── Carrega estado salvo (ou usa defaults) ────────────────────────────────
  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}')
    } catch {
      return {}
    }
  })()

  // ── Estado ────────────────────────────────────────────────────────────────
  const theme        = ref(saved.theme        ?? 'light')
  const sidebarOpen  = ref(saved.sidebarOpen  ?? true)
  const language     = ref(saved.language     ?? 'pt-BR')
  const itemsPerPage = ref(saved.itemsPerPage  ?? 20)

  // ── Getters ───────────────────────────────────────────────────────────────
  const isDarkMode = computed(() => theme.value === 'dark')

  // ── Persistência automática ───────────────────────────────────────────────
  watch(
    () => ({
      theme:        theme.value,
      sidebarOpen:  sidebarOpen.value,
      language:     language.value,
      itemsPerPage: itemsPerPage.value,
    }),
    (val) => localStorage.setItem(SETTINGS_KEY, JSON.stringify(val)),
    { deep: true },
  )

  // ── Actions ───────────────────────────────────────────────────────────────

  /** Alterna entre modo claro e escuro e aplica a classe no <html> */
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    applyTheme()
  }

  /** Abre ou fecha o sidebar de navegação */
  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  /**
   * Aplica o tema salvo ao elemento <html>.
   * Deve ser chamado ao montar a aplicação (onMounted na view raiz).
   */
  function applyTheme() {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  return {
    // Estado
    theme, sidebarOpen, language, itemsPerPage,
    // Getters
    isDarkMode,
    // Ações
    toggleTheme, toggleSidebar, applyTheme,
  }
})
