<script setup>
import Header from '@/components/Header.vue';
import FokusBoxes from '@/components/FokusBoxes.vue'
</script>

<template>
  <Header :selectHeader="selectHeader" />
  <p>Um deinen Fokus zu ändern wähle einen neuen Fokus aus</p>
  <FokusBoxes />
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'changeFokus'
    }
  },
}
</script>

<style scoped>

</style>