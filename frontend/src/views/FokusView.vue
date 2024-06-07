<script setup>
import Header from '@/components/Header.vue';
</script>

<template>
  <Header :selectHeader="selectHeader"/>
  <button @click="redirectToHome">Fertig</button>
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'fokus'
    }
  },
methods: {
  redirectToHome() {
    this.$router.push({ name: 'home'})
  }
},
}
</script>

<style lang="scss" scoped></style>