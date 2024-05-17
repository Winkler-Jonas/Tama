<template>
  <main>
    <img alt="placeholder-img" :src="working">
    <h1>Working on it ... </h1>
  </main>
</template>

<script setup>
import working from '@/assets/working.gif'

</script>

<style scoped>

main {
  width: 100dvw;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

</style>
