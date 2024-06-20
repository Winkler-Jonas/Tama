<template>
  <section id="tama-profile-view" :style="`padding-top: ${$route.meta.tama}vh`" class="main-gl-view">
    <div>
      <h1>User Profile</h1>
      <div v-if="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
      </div>
      <p v-else>Loading...</p>
    </div>


    <div class="calendar-test">
      <tama-icon class="calendar-selected" icon-name="calendarCircle" />
      <span class="calendar-digit">1</span>
    </div>

    <!--
    <button @click="modalVisible = !modalVisible">Click Me</button>
    <tama-edit-task :is-visible="modalVisible" @on-exit="modalVisible = !modalVisible"/>

    <tama-add-task :is-visible="modalVisible" @on-exit="modalVisible = !modalVisible"/>
-->

  </section>
</template>

<script setup>
import {computed, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TamaAddTask from "@/components/TamaAddTask.vue";
import TamaEditTask from "@/components/TamaEditTask.vue";
import TamaNavBar from "@/components/TamaNavBar.vue";
import TamaIcon from "@/components/generic/TamaIcon.vue";

const authStore = useAuthStore()
const user = computed(() => authStore.user)
const router = useRouter()
const modalVisible = ref(false)

const deleteAccount = async () => {
  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
    try {
      await authStore.deleteUser()
      router.push('/register')
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
  }
}


const selected = ref('')


</script>

<style scoped>

#tama-profile-view {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}

.calendar-test {
  padding-bottom: 2rem;

  height: 50px;
  width: 50px;
  position: relative;
}

.calendar-digit {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);

  font-size: 30px;
}

.calendar-selected {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-55%);
}


</style>
