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
