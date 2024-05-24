<template>
  <div>
    <h1>Resend Activation Email</h1>
    <p>Hi {{ user.name }}</p>
    <p>Your email {{ user.email }} has not been verified yet... </p>
    <form @submit.prevent="resendActivation">
      <div>
        <label for="email">New Email Address:</label>
        <input type="email" v-model="email" required autocomplete="email">
      </div>
      <button type="submit">Resend Activation Email</button>
    </form>
    <p v-if="message">{{ message }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const message = ref('')
const errorMessage = ref('')
const authStore = useAuthStore()

const user = computed(() => authStore.user)

const resendActivation = async () => {
  try {
    const response = await authStore.resendActivationEmail(email.value)
    message.value = response.message
  } catch (error) {
    errorMessage.value = 'Failed to resend activation email: ' + (error.response?.data?.message || error.message)
  }
}
</script>
