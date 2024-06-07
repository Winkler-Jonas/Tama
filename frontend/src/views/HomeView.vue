<script setup>
import Task from '@/components/Task.vue';
import Footer from '@/components/Footer.vue';
import AddTaskForm from '@/components/AddTaskForm.vue';
import Header from '@/components/Header.vue';
</script>

<template>
  <Header />
  <!-- <div class="kalender"></div> -->
  <Task />
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
    }
  },
  components: { Task, Footer, AddTaskForm },
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