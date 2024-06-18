<script setup>
import Header from '@/components/Header.vue';
import FokusBoxes from '@/components/FokusBoxes.vue'
</script>

<template>
  <Header :selectHeader="selectHeader"/>
  <FokusBoxes />
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'fokus'
    }
  },
}
</script>

<style lang="scss" scoped></style>