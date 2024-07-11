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
  <teleport to="header">
    <fade-transition>
      <div v-if="showHeader" class="tama-calendar-dynamic-header">
        <h2>{{ currentMonth.month }} {{ currentMonth.year }}</h2>
      </div>
    </fade-transition>
  </teleport>
  <section id="tama-calendar-view" :style="`padding-top: ${$route.meta.tama}vh`">
    <tama-calendar ref="calendarRef"
                   :task-dates="datesWithTasks"
                   @on-month-change="loadTasksOfMonth"
                   @on-date-select="loadTasksOfDay"
    />
    <app-horizontal-separator/>
    <tama-score :open-tasks="openTasks" :closed-tasks="closedTasks" />
    <h2 class="text-center" style="padding-bottom: 1em">{{ $t('views.calendar.hdr') }}</h2>
    <tama-month-tasks :task-objects="dailyTasks.length > 0 ? dailyTasks : monthlyTasks" />
  </section>
</template>

<script setup>
import TamaCalendar from "@/components/calendar/TamaCalendar.vue";
import {useTaskStore} from "@/stores/taskStore.js";
import {computed, onMounted, reactive, ref} from "vue";
import TamaMonthTasks from "@/components/calendar/TamaMonthTasks.vue";
import FadeTransition from "@/components/transitions/FadeTransition.vue";
import AppHorizontalSeparator from "@/components/generic/AppHorizontalSeparator.vue";
import TamaScore from "@/components/calendar/TamaScore.vue";
import {formatToDjangoDate} from "@/utils/calendarLogic.js";

const taskStore = useTaskStore()

const emit = defineEmits(['main-scrolling'])
const calendarRef = ref(null)
const monthlyTasks = ref([])
const dailyTasks = ref([])
const datesWithTasks = ref([])
const scrollHeight = ref(0)

const showHeader = computed(() => scrollHeight.value > 30)
const currentMonth = reactive({month: '', year: 0})
const openTasks = ref(0)
const closedTasks = ref(0)


const loadTasksOfMonth = async (monthAndYear) => {
  currentMonth.month = monthAndYear.monthStr
  currentMonth.year = monthAndYear.year
  const dateString = `${monthAndYear.year}-${monthAndYear.month.toString().padStart(2, '0')}`

  await taskStore.fetchTasks(monthAndYear.month -1, monthAndYear.year)
  monthlyTasks.value = taskStore.getTasksOfMonth(dateString)
  datesWithTasks.value = monthlyTasks.value.reduce((acc, task) => {
    const dates = Object.keys(task.task_instances);
    return acc.concat(dates);
  }, []);

  // count open Tasks
  openTasks.value = monthlyTasks.value.reduce((acc, task, index) => {
    const inProgressCount = Object.entries(task.task_instances).reduce((innerAcc, [key, value]) => {
      if (key.substring(0, 7) === dateString && value === 'inProgress') {
        return innerAcc + 1;
      }
      return innerAcc;
    }, 0);
    return acc + inProgressCount;
  }, 0);

  // count closed Tasks
  closedTasks.value = monthlyTasks.value.reduce((acc, task, index) => {
    const doneCount = Object.entries(task.task_instances).reduce((innerAcc, [key, value]) => {
      if (key.substring(0, 7) === dateString && value === 'done') {
        return innerAcc + 1;
      }
      return innerAcc;
    }, 0);
    return acc + doneCount;
  }, 0);
}

const loadTasksOfDay = async (date) => {
  if (!date) {
    dailyTasks.value = []
  }
  const dateStr = formatToDjangoDate(date);
  dailyTasks.value = monthlyTasks.value.filter(task =>
      Object.keys(task.task_instances).some(dateKey => dateKey === dateStr)
  );
}

onMounted(() => {
  emit('main-scrolling', 'enable')

  const scrollableElements = document.getElementsByTagName('main');

  if (scrollableElements.length > 0) {
    const scrollableElement = scrollableElements[0];

    scrollableElement.addEventListener('scroll', () => {
      if (scrollableElement.scrollTop !== 0) {
        scrollHeight.value = scrollableElement.scrollTop
      }
    })
  }
})

</script>

<style scoped>

#tama-calendar-view {
  width: 90%;
  max-width: 100%;
  margin-inline: auto;
}

.tama-calendar-dynamic-header {
  width: 100%;
  position: fixed;
  top: 1em;
  text-align: center;
}

</style>