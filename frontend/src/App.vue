<template>
  <main>
    <p>{{imgUrl}}</p>
    <img alt="placeholder-img" :src="imgUrl">
    <h1>Working on it ... </h1>
  </main>
</template>

<script setup>
import {ref} from "vue";


const imgUrl = ref(`/static/working.gif`)

console.log(imgUrl.value)

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
