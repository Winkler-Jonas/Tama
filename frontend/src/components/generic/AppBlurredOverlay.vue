<template>
  <transition name="blur-overlay"
              @before-enter="handleBeforeEnter"
              @after-enter="handleAfterEnter"
              @before-leave="handleBeforeLeave">
    <div v-if="isVisible" class="app-blurred-overlay" :style="overlayStyle"></div>
  </transition>
</template>

<script setup>
import {computed, ref} from 'vue';

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  }
})
const blurBackground = ref(0)
const isVisible = computed(() => props.isVisible);

const overlayStyle = computed(() => ({
  backdropFilter: `blur(${blurBackground.value}px)`
}))

function handleBeforeEnter(el) {
  blurBackground.value = 0;
}

function handleAfterEnter(el) {
  blurBackground.value = 10;
}

function handleBeforeLeave(el) {
  blurBackground.value = 0;
}

</script>

<style scoped>
.app-blurred-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: backdrop-filter 0.3s ease;
  z-index: 10;
  border-radius: 2rem 2rem 0 0;
}


</style>
