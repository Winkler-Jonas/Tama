/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
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
