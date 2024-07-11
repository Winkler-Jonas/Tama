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

  user-select: none;
}
</style>