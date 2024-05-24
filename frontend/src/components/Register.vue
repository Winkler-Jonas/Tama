<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="username" placeholder="Username" required />
      <input v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <input type="password" v-model="password2" placeholder="Confirm Password" required />
      <button type="submit">Register</button>
    </form>
    <div v-if="error">
      <p>Error: {{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import api from '../services/api';

const username = ref('');
const email = ref('');
const password = ref('');
const password2 = ref('');
const error = ref('');

const register = async () => {
  try {
    const response = await api.register({
      username: username.value,
      email: email.value,
      password: password.value,
      password2: password2.value,
    });
    console.log('Registration successful:', response.data);
  } catch (errorResponse) {
    console.error('Registration error:', errorResponse.response.data);
    error.value = JSON.stringify(errorResponse.response.data);
  }
};
</script>
