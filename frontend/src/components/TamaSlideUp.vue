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
  <teleport to="footer">
    <Transition name="tama-slide-up-overlay">
      <div v-if="isVisibleCmp" class="tama-slide-up-overlay-cls" key="overlay"></div>
    </Transition>
    <Transition name="tama-slide-up-modal">
      <div v-if="isVisible" :style="viewHeight" class="tama-slide-up-modal-cls">
        <slot :parent-height="height" name="slide-up-content"></slot>
      </div>
    </Transition>
  </teleport>
</template>

<script setup>

import {computed,  watchEffect} from "vue";

const emit = defineEmits(['height-change'])
const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  slideHeight: {
    type: Number,
    required: false,
    default: 60
  }
})

const isVisibleCmp = computed(() => props.isVisible)
const height = computed(() => props.slideHeight)

const viewHeight = computed(() => ({'min-height': `${height.value}vh`}))

watchEffect(() => {
  emit('height-change', height.value)
})

</script>

<style scoped>

.tama-slide-up-overlay-cls {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.tama-slide-up-modal-cls {
  max-height: 100vh;
  z-index: 101;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-inline: auto;
  width: 100%;
  max-width: var(--tama-max-w);
  background-color: white;

  transition: all 0.3s ease;
  border: 3px solid var(--tama-color-orange);
  border-radius: 2rem 2rem 0 0;
  border-bottom: none;
}

.tama-slide-up-overlay-enter-active,
.tama-slide-up-overlay-leave-active {
  transition: opacity 0.5s ease-out;
}

.tama-slide-up-overlay-leave-active {
  transition-delay: .3s;
  opacity: 1;
}

.tama-slide-up-overlay-enter-from,
.tama-slide-up-overlay-leave-to {
  opacity: 0;
}

.tama-slide-up-modal-enter-active,
.tama-slide-up-modal-leave-active {
  transition: all 0.5s ease;
}

.tama-slide-up-modal-leave-active {
  transform: translateY(0%);

  /* max-height: 60vh; */
}

.tama-slide-up-modal-enter-from,
.tama-slide-up-modal-leave-to {
  transform: translateY(100%);
}

</style>