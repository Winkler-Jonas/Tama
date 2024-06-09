<template>
  <section id="tama-app" class="full-height">
    <header class="tama-header">

    </header>
    <main>
      <router-view v-slot="{ Component }">
        <transition name="slide" mode="out-in">
          <component :is="Component" :key="$route.path"/>
        </transition>
      </router-view>
    </main>
    <footer>
      <!-- Navbar here -->
    </footer>
  </section>

</template>

<script setup>

</script>

<style scoped>

#tama-app {
  display: grid;
  grid:
    [header-start]  "header" min-content
    [content-start] "main"   auto
    [footer-start]  "footer" min-content;
}

header {
  grid-column: 1 / 2;
  z-index: 2;
}

main {
  grid-column: 1 / 3;
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
