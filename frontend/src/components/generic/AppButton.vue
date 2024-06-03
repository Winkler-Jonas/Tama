<template>
  <div
      @click="handleButtonClick"
      @focusin="toggleFocus"
      @focusout="toggleFocus"
      ref="buttonRef"
      class="tama-app-button-container">
    <button class="btn-remove-default"></button>
    <p class="text-button" :style="focusText">{{ btnText }}</p>
  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";

const props = defineProps({
  btnText: {
    type: String,
    required: true
  }
})

const buttonRef = ref(null)
const hasFocus = ref(false)
const focusText = computed( () => {
  return hasFocus.value ? {'color': 'var(--tama-color-blue)'} : ''
})

const emit = defineEmits([
    'onClick'
])

const handleButtonClick = () => {
  emit("onClick")
}

const toggleFocus = () => {
  hasFocus.value = !hasFocus.value
}

const focusButton = () => {
  buttonRef.value.focus()
}

defineExpose({
  focusButton
})
</script>

<style scoped>
.tama-app-button-container {
  background-color: var(--tama-color-orange);
  padding: 1em;
  border-radius: 8px;

  width: fit-content;
  height: fit-content;

  display: grid;
  grid-template-columns: [left] max-content;
  grid-template-rows: [top] min-content;
}

.tama-app-button-container button {
  z-index: 0;
  grid-row: 1 / -1;
  grid-column: 1 / -1;
  background-color: transparent;
}

.tama-app-button-container:focus-visible {
  outline: none;
  border: none;
}

.tama-app-button-container p {
  z-index: 1;
  background-color: transparent;
  text-align: center;
  border: none;
  outline: none;

  grid-row: 1 / -1;
  grid-column: 1 / -1;
}
</style>