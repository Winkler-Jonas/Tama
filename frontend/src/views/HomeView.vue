<script setup>
import TaskOverview from '@/components/Task/TaskOverview.vue';
import Footer from '@/components/Footer.vue';
import AddTaskForm from '@/components/AddTaskForm.vue';
import Header from '@/components/Header.vue';
</script>

<template>
  <Header />
  <!-- <div class="kalender"></div> -->
  <TaskOverview />
  <Footer @openAddTask="toggleAddTask" />
  <Transition>
    <AddTaskForm v-if="AddTask" @backdropClicked="toggleAddTask" />
  </Transition>
</template>

<script>


export default {
  data() {
    return {
      AddTask: false,
      selectHeader: 'home',
    }
  },
  components: { Task: TaskOverview, Footer, AddTaskForm },
  methods: {
    toggleAddTask(toggle) {
      this.AddTask = toggle;
    }
  },
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>