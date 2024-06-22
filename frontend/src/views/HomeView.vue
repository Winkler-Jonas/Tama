<script setup>
import TaskOverview from '@/components/Task/TaskOverview.vue';
import Footer from '@/components/Footer.vue';
import AddTaskForm from '@/components/AddTaskForm.vue';
import Header from '@/components/Header.vue';
import EditTask from '@/components/EditTask.vue';
import Daily from '@/components/Task/Daily.vue';
import Aufgabe from '@/components/Task/Aufgabe.vue';
</script>

<template>
  <Header />
  <!-- <div class="kalender"></div> -->
  <h2 class="subheadlineBlue">Aufgaben</h2>
  <Aufgabe :key="renderKey" @openEditTask="toggleEditTask"/>
  <h2 class="subheadlineOrange">Daily</h2>
  <Daily />
  <Footer @openAddTask="toggleAddTask" />
  <Transition>
    <AddTaskForm v-if="showAddTaskForm" @backdropClicked="toggleAddTask" @rerender="rerender"/>
  </Transition>
  <Transition>
    <EditTask v-if="showEditTaskComp" @backdropClicked="toggleEditTask"  @rerender="rerender" :task="task"/>
  </Transition>
</template>

<script>


export default {
  data() {
    return {
      showAddTaskForm: false,
      showEditTaskComp: false,
      task: null,
      renderKey: 0,
    }
  },
  components: { Task: TaskOverview, Footer, AddTaskForm },
  methods: {
    toggleAddTask() {
      this.showAddTaskForm = !this.showAddTaskForm;
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
.subheadlineOrange,  .subheadlineBlue{
  margin-top: 10px;
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