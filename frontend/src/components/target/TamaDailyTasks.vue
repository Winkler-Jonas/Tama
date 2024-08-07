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
  <div class="tama-daily-task-wrapper">
    <h2 v-if="openDailies.length > 0 || dailiesDone.length > 0" class="tama-target-daily-header">
      {{ $t('components.task.daily') }}
    </h2>
    <div v-for="(task, dailyIdx) in dailiesDone" :key="dailyIdx"
         class="tama-daily-task-done"
    >
      <div class="tama-daily-task-done-radio">
        <i class="ri-check-fill"></i>
      </div>
      <p>{{ task.description }}</p>
    </div>
    <tama-task-carousel
        @on-daily-clicked="(newDaily) => emit('on-daily-clicked', newDaily)"
        :today-dailies="openDailies"
    />
  </div>
</template>

<script setup>
import TamaTaskCarousel from "@/components/task/TamaTaskCarousel.vue";
import {computed, onBeforeMount, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useTaskStore} from "@/stores/taskStore.js";
import {formatDate} from "@/utils/calendarLogic.js";

const userStore = useUserStore()
const taskStore = useTaskStore()

onBeforeMount(async () => {
  await userStore.getDailies()
})

const emit = defineEmits(['on-daily-clicked', 'on-amount-change'])
const props = defineProps({
  dayTarget: {
    type: [Date, null],
    required: true
  }
})


const currentDate = computed(() => props.dayTarget)

const dailiesDone = computed(() => {
  try {
    const allTasks = taskStore.getTasksByDate(currentDate.value)
    if (allTasks) {
      const filtered = allTasks.filter(task => task.daily)
      emit('on-amount-change', filtered.length)
      return filtered
    }
  } catch (error) {
    // todo proper error handling (ignore for now)
    return []
  }
})

const openDailies = computed(() => {
  const todayKey = formatDate(currentDate.value);
  if (userStore.dailyTasks) {
    const storedDailies = userStore.dailyTasks[todayKey] || [];
    return storedDailies.filter(openD => !dailiesDone.value.some(closedD => closedD.description === openD.desc) )
  }
  return []
});


</script>

<style scoped>

.tama-daily-task-wrapper {
  padding-top: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.tama-target-daily-header {
  text-align: center;
  color: var(--tama-color-orange);
}

.tama-daily-task-done {
  border-radius: 10px;
  padding: 1em 1em;
  width: 100%;
  background-color: var(--tama-color-daily);

  display: flex;
  align-items: center;
  gap: 1em;
}

.tama-daily-task-done-radio {
  flex-shrink: 0;
  flex-grow: 0;
  --dimenstion: 1.5em;
  width: var(--dimenstion);
  height: var(--dimenstion);

  border: 1px solid var(--tama-color-gray);
  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
}

</style>