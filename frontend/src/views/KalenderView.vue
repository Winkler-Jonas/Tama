<script setup>
import Header from '@/components/Header.vue';
import Kalender from '@/components/Kalender.vue';
import Daily from '@/components/Task/Daily.vue';
import Aufgabe from '@/components/Task/Aufgabe.vue';
import AddTaskForm from '@/components/AddTaskForm.vue';
import EditTask from '@/components/EditTask.vue';
</script>

<template>
  <Header :selectHeader="selectHeader" />
  <Kalender @handleDayClicked="handleDayClicked" />
  <h1 class="subheadlineBlack">Aufgaben heute</h1>
  <Aufgabe @openEditTask="toggleEditTask" />
  <Daily :showDate="true"/>

  <Transition>
    <EditTask v-if="showEditTaskComp" @backdropClicked="toggleEditTask" />
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'calender',
      showAddTaskForm: false,
      showEditTaskComp: false,
      selectedDateForTask: null,
    }
  },
  methods: {
    handleDayClicked(day, month, year) {
      this.selectedDateForTask = day + ' ' + month + ' ' + year;
      console.log(this.selectedDateForTask);
    },
    toggleEditTask() {
      this.showEditTaskComp = !this.showEditTaskComp;
    }
  },
}
</script>

<style scoped>
.color-box {

  background-color: #4CAF50;
  /* Grüne Farbe */
  border: 2px solid #000;
  /* Schwarzer Rand */
  border-radius: 10px;
  /* Abgerundete Ecken */
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
  /* Schatteneffekt */
}


.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>