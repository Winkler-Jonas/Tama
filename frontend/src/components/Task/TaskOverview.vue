<script setup>
import Daily from '@/components/Task/Daily.vue';
import Aufgabe from '@/components/Task/Aufgabe.vue';
</script>

<template>
  <h2 class="subheadlineBlue">Aufgaben</h2>
  <Aufgabe @openEditTask="openEditTask()"/>
  <h2 class="subheadlineOrange">Daily</h2>
  <Daily />
</template>

<script>
export default {
  methods: {
    openEditTask() {
      this.$emit('openEditTask');
    }
  },
}
</script>

<style scoped>
p {
  /* background-color: red; */
  text-align: left;
  margin: 2%;
}
</style>