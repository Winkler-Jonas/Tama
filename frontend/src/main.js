import './assets/main.css'
import '@/assets/layout.css'
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
import Vue3TouchEvents from "vue3-touch-events";
import {useAuthStore} from "@/stores/auth.js";
import { emitter } from '@/eventEmitter.js'
import iconsSvg from '@/assets/icons/icons.svg'


function setVhProperty() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function addIcons() {
  fetch('/icons/icons.svg')
      .then(response => response.text())
      .then(data => {
        const div = document.createElement('div');
        div.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden;';
        div.innerHTML = data;
        document.body.insertBefore(div, document.body.childNodes[0]);
      });
}

setVhProperty();
window.addEventListener('resize', setVhProperty);

emitter.on('auth:expired', () => {
    router.push('/login');
});

async function init() {
  const app = createApp(App)


  // Create Pinia instance
  const pinia = createPinia()
  pinia.use(piniaPersistedstate)
  app.use(pinia)
  const authStore = useAuthStore();
  authStore.initAuth();

  // Access the store after the Pinia instance is created
  const languageStore = useLanguageStore()
  const i18n = await setupI18n(languageStore.locale)
  app.use(i18n)
  app.use(Vue3TouchEvents)
  app.use(router)

  app.directive('click-outside', ClickOutside);
  app.directive('text-animation', vTextAnimation);
  app.directive('delay', delayDirective);
  app.mount('#app')

  // Add Icons
  addIcons();

  // Register the service worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      registerSW({ immediate: true })
    })
  }
}

init()
