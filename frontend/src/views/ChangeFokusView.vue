<script setup>
import Header from '@/components/Header.vue';
import FokusBoxes from '@/components/FokusBoxes.vue'
</script>

<template>
  <Header :selectHeader="selectHeader" />
  <div class="normaltext">
    <p>Um deinen Fokus zu ändern wähle einen neuen Fokus aus</p>
  </div>
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

<style scoped></style>