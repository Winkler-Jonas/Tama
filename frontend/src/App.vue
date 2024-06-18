<template>
  <section id="tama-app" class="full-height">
    <header class="tama-header">

    </header>
    <main>
      <router-view v-slot="{ Component }">

          <component :is="Component" :key="$route.fullPath"/>

      </router-view>
    </main>
    <footer>
      <tama-nav-bar v-if="authStore.user"/>
    </footer>
  </section>

</template>

<script setup>
import TamaNavBar from "@/components/TamaNavBar.vue";
import {useAuthStore} from "@/stores/auth.js";

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
  z-index: 2;
}

main {
  grid-area: content;
  z-index: 1;
  overflow-y: hidden;
  position: relative;
}

footer {
  grid-area: footer;
  z-index: 1;
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
