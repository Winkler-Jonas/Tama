<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" required />
      <input type="password" v-model="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const username = ref('');
const password = ref('');

const login = async () => {
  try {
    const response = await api.login({
      username: username.value,
      password: password.value,
    });
    console.log('Login successful:', response.data);
    // Store tokens in local storage or Vuex
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  } catch (error) {
    console.error('Login error:', error.response.data);
  }
};
</script>