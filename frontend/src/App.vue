/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
<template>
  <section id="tama-app" class="full-height">
    <header class="tama-header" :style="`position: ${$route.meta.position}`">
      <app-tama-area v-if="$route.meta.tama" :tama-image-change="feedTama" :tama-area-height="$route.meta.tama" />
    </header>
    <main :style="mainStyle">
      <router-view v-slot="{ Component }">
        <component :is="Component" @main-scrolling="handleMainScroll" @feed-tama="feedTama = !feedTama" :key="$route.fullPath"/>
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
import {computed, ref} from "vue";

const authStore = useAuthStore()
const mainScrolling = ref(true)
const feedTama = ref(false)

const mainStyle = computed(() => ({
  'overflow-y': mainScrolling.value ? 'auto' : 'hidden'
}))

const handleMainScroll = (disableEnable) => {
  if (disableEnable === 'disable') {
    mainScrolling.value = false
  } else if (disableEnable === 'enable') {
    mainScrolling.value = true
  }
}


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
  position: fixed;
  height: fit-content;
  top: 0;
  width: 100%;
  margin-inline: auto;
  z-index: 2;
}

main {
  grid-row: 1 / 3;
  grid-column: 1 / -1;
  z-index: 1;
  height: 100%;
  max-height: 100vh;
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
