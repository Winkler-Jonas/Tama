<template>
  <language-switch />
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="username">Username:</label>
        <input type="text" v-model="username" @blur="checkUsername" required autocomplete="username">
        <p v-if="usernameError">{{ usernameError }}</p>
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" @blur="checkEmail" required autocomplete="email">
        <p v-if="emailError">{{ emailError }}</p>
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required autocomplete="new-password">
        <p v-if="errors.password">{{ errors.password }}</p>
      </div>
      <div>
        <label for="password2">Confirm Password:</label>
        <input type="password" v-model="password2" required autocomplete="new-password">
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import websocketService from '@/services/registerWS.js'
import LanguageSwitch from "@/components/LanguageSwitch.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n()

const username = ref('')
const email = ref('')
const password = ref('')
const password2 = ref('')
const errorMessage = ref('')
const errors = ref({})
const usernameError = ref('')
const emailError = ref('')
const router = useRouter()
const authStore = useAuthStore()

const register = async () => {
  if (password.value !== password2.value) {
    errorMessage.value = errorMessage.value = t('views.register.passNoMatch')
    return
  }
  try {
    await authStore.register(username.value, email.value, password.value)
    router.push('/login')
  } catch (error) {
    if (error.response && error.response.data) {
      errors.value = error.response.data
    } else {
      errorMessage.value = 'Registration failed: ' + (error.response?.data?.detail || error.message)
    }
  }
}

const checkUsername = () => {
  websocketService.checkUsername(username.value, (message) => {
    usernameError.value = message
  })
}

const checkEmail = () => {
  websocketService.checkEmail(email.value, (message) => {
    emailError.value = message
  })
}

onMounted(() => {
  // Initialize WebSocket connections when component is mounted
  websocketService.connectUsernameSocket();
  websocketService.connectEmailSocket();
})
</script>
