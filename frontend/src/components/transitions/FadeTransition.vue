<template>
  <Transition name="fade-transition">
    <slot></slot>
  </Transition>

</template>

<script setup>

</script>

<style>

.fade-transition-enter-active,
.fade-transition-leave-active {
  transition: opacity 0.5s ease;
}

.fade-transition-enter-from,
.fade-transition-leave-to {
  opacity: 0;
}

</style>