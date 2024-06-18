<template>
  <section id="tama-profile-view">
    <div>
      <h1>User Profile</h1>
      <div v-if="user">
        <p><strong>Username:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <button @click="deleteAccount">Delete Account</button>
      </div>
      <p v-else>Loading...</p>
    </div>
    <button @click="modalVisible = !modalVisible">Click Me</button>
    <tama-edit-task :is-visible="modalVisible" @on-exit="modalVisible = !modalVisible"/>
<!--
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
