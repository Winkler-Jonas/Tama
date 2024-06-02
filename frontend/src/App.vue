<template>
  <section id="tama-app" class="full-height">
    <header class="tama-header">

    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <!-- Navbar here -->
    </footer>
  </section>

</template>

<script setup>
import { ref } from 'vue';
import SignupHeader from "@/components/header/AppDefaultHeader.vue";

const imgUrl = ref(`/static/working.gif`);
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
}

footer {
  grid-area: footer;
  z-index: 1;
}

</style>
