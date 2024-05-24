<template>
  <div>
    <h1>Account Activation</h1>
    <p v-if="message">{{ message }}</p>
    <p v-else>Activating your account, please wait...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()
const message = ref('')

const activateAccount = async () => {
  const uidb64 = route.params.uidb64
  const token = route.params.token
  try {
    const response = await api.activate(uidb64, token)
    message.value = 'Account activated successfully!'
  } catch (error) {
    console.error('Activation error:', error.response?.data)
    message.value = 'Activation failed: ' + (error.response?.data?.message || error.message)
  }
}

onMounted(() => {
  activateAccount()
})
</script>
