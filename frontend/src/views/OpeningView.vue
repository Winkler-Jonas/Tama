<script setup>
import Header from '@/components/Header.vue';
</script>

<template>
  <Header :selectHeader="selectHeader"/>
  <h2>Hallo ich bin Tama. Ich helfe dir dabei deine Ziele zu erreichen und dabei Spaß zu haben.</h2>
  <button @click="redirectToFokus">Lass uns loslegen</button>
</template>

<script>

export default {
  data() {
    return {
      selectHeader: 'opening'
    }
  },
  methods: {
    redirectToFokus() {
      this.$router.push({ name: 'fokus'})
    }
  },
}
</script>

<style scoped></style>