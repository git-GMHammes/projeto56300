import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.scss'
import 'bootstrap'

/**
 * Bootstrap da aplicação Vue 3.
 * Ordem de inicialização: Pinia → Router → Mount.
 * O Pinia DEVE ser registrado antes de qualquer Store ser usada.
 */
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
