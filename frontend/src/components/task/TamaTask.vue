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
  <div ref="taskWrapper" class="tama-task-wrapper" @click="emit('on-task-clicked')" :class="(isTicked || stroked) ? 'tama-task-done': 'tama-task-active'">
    <svg v-if="stroked" class="overlay" xmlns="http://www.w3.org/2000/svg" :viewBox="`0 0 ${containerWidth} ${containerHeight}`">
      <line x1="0" y1="0" :x2="containerWidth" :y2="containerHeight" stroke="var(--tama-color-gray)" stroke-width="2"/>
    </svg>
    <div class="tama-task-radio-button" :class="[isTicked ? 'tama-task-done': 'tama-task-active', {'tama-task-done': isStroked}]">
      <i v-if="isTicked" class="ri-check-fill"></i>
    </div>
    <div>
      <p class="tama-task-text">
        {{ props.taskObject.description }}
      </p>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, ref} from "vue";

onMounted(() => {
  nextTick(() => {
    containerWidth.value = taskWrapper.value.offsetWidth
    containerHeight.value = taskWrapper.value.offsetHeight
  })
})

const emit = defineEmits(['on-task-clicked'])
const props = defineProps({
  taskObject: {
    type: Object,
    required: true
  },
  isDone: {
    type: Boolean,
    required: false,
    default: false
  },
  isStroked: {
    type: Boolean,
    required: false,
    default: false
  }
})
const isTicked = computed(() => props.isDone)
const stroked = computed(() => props.isStroked)

const taskWrapper = ref(null)
const containerWidth = ref(0)
const containerHeight = ref(0)


</script>

<style scoped>

.tama-task-wrapper {
  position: relative;
  width: 100%;
  height: max-content;
  padding: 1em 1em;
  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 1em;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.tama-task-radio-button {
  --dimenstion: 1.5em;
  flex-shrink: 0;
  flex-grow: 0;
  min-width: var(--dimenstion);
  min-height: var(--dimenstion);
  width: var(--dimenstion);

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
}

.tama-task-active {
  border: 1px solid black;
  color: black;
}

.tama-task-done {
  flex-shrink: 0;
  flex-grow: 0;
  border: 1px solid var(--tama-color-gray);
  color: var(--tama-color-gray);
}

</style>