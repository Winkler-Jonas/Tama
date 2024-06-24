<template>
  <section id="tama-app" class="full-height">
    <header class="tama-header">
      <app-tama-area v-if="$route.meta.tama" :tama-area-height="$route.meta.tama" />
    </header>
    <main>
      <router-view v-slot="{ Component }">
        <component :is="Component" :key="$route.fullPath"/>
      </router-view>
    </main>
    <footer>
      <tama-nav-bar v-if="$route.meta.nav"/>
    </footer>
  </section>

</template>

<script setup>
import TamaNavBar from "@/components/TamaNavBar.vue";
import {useAuthStore} from "@/stores/auth.js";
import AppTamaArea from "@/components/generic/AppTamaArea.vue";

const authStore = useAuthStore()
</script>

<style scoped>

#tama-app {
  display: grid;
  grid-template-rows: [header-start] min-content [header-end content-start] auto [content-end footer-start] min-content;
  grid-template-columns: 1fr;
  grid-template-areas: "header" "content" "footer";
}

header {
  grid-area: header;
  position: sticky;
  height: fit-content;
  top: 0;
  z-index: 2;
}

main {
  grid-row: 1 / 3;
  grid-column: 1 / -1;
  z-index: 1;
  height: 100%;
  overflow-x: hidden;
  overflow-y: visible;
}

footer {
  grid-area: footer;
  position: sticky;
  bottom: 0;
  z-index: 3;
}


.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter-from {
  transform: translateX(100%); /* Enter from the right */
}

.slide-leave-to {
  transform: translateX(-100%); /* Exit to the left */
}

.slide-enter-to, .slide-leave-from {
  transform: translateX(0);
}
</style>
