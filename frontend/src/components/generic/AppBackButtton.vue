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
       @click="handleClick"
       @keydown.enter="handleClick"
       class="tama-app-back-btn"
       :class="[isClickable ? 'tama-back-button-active': 'tama-back-button-inactive',
                { 'tama-back-button-animation': isAnimating }]"
  >
    <i :tabindex="0" ref="backIcon" class="ri-arrow-left-line icon-focus"></i>
  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";

const emit = defineEmits(['onClick'])

const props = defineProps({
  isClickable: {
    type: Boolean,
    required: true,
  }
})

const isClickable = computed(() => props.isClickable)
const isAnimating = ref(false)
const backIcon = ref(null)


const handleClick = () => {
  backIcon.value.blur()
  if (!isClickable.value) return

  emit('onClick')
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 400)
}

</script>

<style scoped>

.tama-app-back-btn {
  padding: 10px;
  outline: none;
  border: none;
}

.icon-focus {
  padding: 10px;
}

.icon-focus:focus-visible {
  outline: none;
  border: none;
  box-shadow: inset 0 0 0 2px #FFA976;
}

.tama-back-button-active {
  color: black;
}

.tama-back-button-inactive {
  color: var(--tama-color-gray)
}

.tama-back-button-animation {
  color: var(--tama-color-orange) !important;
}

</style>