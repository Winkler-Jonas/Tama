<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" required autocomplete="username">
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required autocomplete="current-password">
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const login = async () => {
  try {
    await authStore.login(username.value, password.value)
    if (!authStore.user.email_verified) {
      router.push('/resend-activation')
    } else {
      router.push('/profile')
    }
  } catch (error) {
    errorMessage.value = 'Login failed: ' + (error.response?.data?.detail || error.message)
  }
}
</script>
