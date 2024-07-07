<template>
  <section id="tama-calendar-view" :style="`padding-top: ${$route.meta.tama}vh`">
    <tama-calendar @on-month-change="loadTasksOfMonth" />
  </section>

</template>

<script setup>
import TamaCalendar from "@/components/calendar/TamaCalendar.vue";
import {useTaskStore} from "@/stores/taskStore.js";
import {ref} from "vue";

const taskStore = useTaskStore()


const monthlyTasks = ref([])

const loadTasksOfMonth = async (monthAndYear) => {
  await taskStore.fetchTasks(monthAndYear.month, monthAndYear.year)
  console.log(monthAndYear.month, monthAndYear.year)
  const newDate = new Date(monthAndYear.year, monthAndYear.month, 1)
  console.log(newDate)
  taskStore.getTasksOfMonth(newDate)

}


</script>

<style scoped>

#tama-calendar-view {
  width: 90%;
  max-width: 100%;
  margin-inline: auto;
}

</style>