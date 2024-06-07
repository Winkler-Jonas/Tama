<script setup>
import Header from '@/components/Header.vue';
import FokusBoxes from '@/components/FokusBoxes.vue'
</script>

<template>
  <Header :selectHeader="selectHeader"/>
  <FokusBoxes />
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