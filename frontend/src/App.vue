<template>
  <header>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
    </nav>
  </header>
  <router-view />
</template>

<script setup>
import { ref } from 'vue';

const imgUrl = ref(`/static/working.gif`);
</script>

<style scoped>
header {
  background: #f8f9fa;
  padding: 10px;
  display: flex;
  justify-content: space-around;
}

main {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
