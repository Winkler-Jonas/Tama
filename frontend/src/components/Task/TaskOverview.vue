<script setup>
import Daily from '@/components/Task/Daily.vue';
import Aufgabe from '@/components/Task/Aufgabe.vue';
</script>

<template>
  <h1>Aufgaben</h1>
  <Aufgabe />
  <h1>Daily</h1>
  <Daily />
</template>

<script>
export default {

}
</script>

<style scoped>
p {
  /* background-color: red; */
  text-align: left;
  margin: 2%;
}
</style>