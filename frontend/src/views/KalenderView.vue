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

  <h1 class="subheadlineBlack">Aufgaben {{ selectedDateForTask }}</h1>
  <Aufgabe :key="renderKey" @openEditTask="toggleEditTask"/>
  <Daily :showDate="true" />


  <Transition>
    <EditTask v-if="showEditTaskComp" @backdropClicked="toggleEditTask"  @rerender="rerender" :task="task"/>
  </Transition>
</template>

<script>
export default {
  data() {
    return {
      selectHeader: 'calender',
      showAddTaskForm: false,
      showEditTaskComp: false,
      selectedDateForTask: 'heute',
      task: null,
      renderKey: 0,
    }
  },
  methods: {
    handleDayClicked(day, month, year, isToday, isTomorow) {
      if(isToday) {
        this.selectedDateForTask = 'heute';
      } else if(isTomorow) {
        this.selectedDateForTask = 'morgen';
      } else {
        this.selectedDateForTask = day + ' ' + month + ' ' + year;
      }
      console.log(this.selectedDateForTask);
    },
    toggleEditTask(task) {
      if(!this.showEditTaskComp) {
        this.task = task;
      }
      this.showEditTaskComp = !this.showEditTaskComp;
    },
    rerender() {
      this.renderKey++;
    }
  },
}
</script>

<style scoped>
.stick {
  position: sticky;
}

.subheadlineBlack {
  margin-top: 10px;
}

.color-box {
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