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
  <div class="flex column tama-calendar-task" :style="[backgroundColor, isDone]">
    <div class="flex space-between tama-calendar-task-header">
      <span class="text-sm" style="font-weight: bold">{{ currentTask.description }}</span>
      <i v-if="currentTask.repeat !== 'never'" class="ri-refresh-line text-blue" style="font-weight: bold"></i>
    </div>
    <div class="flex space-between">
      <span class="text-sm">{{ currentTask.start_date.replace(/-/g, '.') }}</span>
      <span class="text-sm">{{ !startIsEnd ? currentTask.end_date.replace(/-/g, '.') : '' }}</span>
    </div>
  </div>
</template>

<script setup>

import { computed } from "vue";

const props = defineProps({
  taskObj: {
    type: Object
  }
})

const currentTask = computed(() => props.taskObj)
const startIsEnd = computed(() => currentTask.value.start_date === currentTask.value.end_date)
const backgroundColor = computed(() => ({
  'background-color': currentTask.value.daily ? 'var(--tama-color-daily)' : 'white'
}))

const isDone = computed(() => {
  const done = Object.values(currentTask.value.task_instances).every(instance => instance === 'done')
  return {
    color: done ? 'var(--tama-color-gray)' : '',
    'border-color': done ? 'var(--tama-color-gray)' : ''
  }
})



</script>

<style scoped>

.tama-calendar-task {
  padding: 1em;
  gap: 1em;

  border: 1px solid black;
  border-radius: 10px;
}

.tama-calendar-task-header {
  align-items: flex-start;
  gap: 1em;
}

</style>