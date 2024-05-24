import './assets/main.css'
import { setupI18n } from './i18n';
import { useLanguageStore } from './stores/langStore.js';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { registerSW } from "virtual:pwa-register"

async function init() {
  const app = createApp(App)

  // Create Pinia instance
  const pinia = createPinia()
  app.use(pinia)

  // Access the store after the Pinia instance is created
  const languageStore = useLanguageStore()
  const i18n = await setupI18n(languageStore.locale)
  app.use(i18n)

  app.use(router)

  app.mount('#app')

  // Register the service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerSW({ immediate: true })
    })
  }
}

init()
