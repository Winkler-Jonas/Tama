import './assets/main.css'
import 'remixicon/fonts/remixicon.css'
import { setupI18n } from './i18n'
import { useLanguageStore } from './stores/langStore.js'
import {ClickOutside} from "@/directives/ClickOutsideDirective.js"
import delayDirective from "@/directives/v-delay.js"
import vTextAnimation from '@/directives/vTextAnimation';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { registerSW } from "virtual:pwa-register"

function setVhProperty() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVhProperty();

window.addEventListener('resize', setVhProperty);

async function init() {
  const app = createApp(App)

  // Create Pinia instance
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  app.use(pinia)

  // Access the store after the Pinia instance is created
  const languageStore = useLanguageStore()
  const i18n = await setupI18n(languageStore.locale)
  app.use(i18n)

  app.use(router)

  app.directive('click-outside', ClickOutside);
  app.directive('text-animation', vTextAnimation);
  app.directive('delay', delayDirective)
  app.mount('#app')

  // Register the service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerSW({ immediate: true })
    })
  }
}

init()
