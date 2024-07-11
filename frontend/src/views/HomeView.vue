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
  <tama-focus-select :show-focus-select="!userStore.getUserFocus()"/>
  <tama-level-bar :current-points="currentPoints" :next-level="requiredPoints" />
  <tama-food-icon ref="foodRef" :tama-height="$route.meta.tama" @on-value-change="handleFoodIcon"/>
  <section id="tama-profile-view"
           :style="`top: ${$route.meta.tama}vh; height: ${100 - $route.meta.tama}vh`"
           class="main-gl-view">
    <div class="tama-target-calendar">
      <tama-calendar-row
          :current-date="currentDate"
          @on-date-select="handleDaySelected"
          @on-month-change="handleMonthChange"
          @on-swipe="currentDate = null"
      />
    </div>
    <div class="tama-target-tasks-scrollable" :style="srollablePadding">
      <tama-target-tasks
          @on-task-clicked="handleTaskClicked"
          :day-target="currentDate"
          @on-amount-change="(value) => totalNormalTasks = value"/>
      <tama-daily-tasks
          @on-daily-clicked="handleDailyClicked"
          :day-target="currentDate"
          @on-amount-change="(value) => totalDailyTasks = value"/>
    </div>
  </section>
  <transition name="fade">
    <div v-if="isGreaterEqual(today, currentDate)" class="tama-target-add-container">
      <i @click="handleAddClicked" class="ri-add-line tama-target-add-icon"></i>
    </div>
  </transition>
  <tama-slide-up :is-visible="editActive || addActive" :slide-height="slideUpHeight" @height-change="(value) => slideUpHeight = value">
    <template #slide-up-content>
      <component
          :is="showSlideUp"
          :is-daily="isDaily"
          :slide-up-height="slideUpHeight"
          :task-object="selectedTask"
          :add-date="currentDate"
          @on-close="handleModalClose"
          @on-submit="handleTaskAdded"
          @on-height-change="handleHeightChange"
      />
    </template>
  </tama-slide-up>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import TamaCalendarRow from "@/components/calendar/TamaCalendarRow.vue";
import TamaAddTask from "@/components/TamaAddTask.vue";
import TamaEditTask from "@/components/TamaEditTask.vue";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import {useTaskStore} from "@/stores/taskStore.js";
import TamaTargetTasks from "@/components/target/TamaTargetTasks.vue";
import TamaDailyTasks from "@/components/target/TamaDailyTasks.vue";
import {isGreaterEqual} from '@/utils/calendarLogic.js'
import TamaFocusSelect from "@/components/focus/TamaFocusSelect.vue";
import {useUserStore} from "@/stores/userStore.js";
import {useAuthStore} from "@/stores/auth.js";
import TamaLevelBar from "@/components/generic/TamaLevelBar.vue";
import TamaFoodIcon from "@/components/generic/TamaFoodIcon.vue";

const taskStore = useTaskStore()
const userStore = useUserStore()
const authStore = useAuthStore()

const totalDailyTasks = ref(0)
const totalNormalTasks = ref(0)
const addActive = ref(false)
const editActive = ref(false)
const currentDate = ref(new Date())
const today = ref(new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const todayTasks = ref([])
const selectedTask = ref({})
const isDaily = ref(false)
const slideUpHeight = ref(60)
const showModal = ref(false)
const currentPoints = ref(0)
const requiredPoints = ref(0)
const foodRef = ref(null)

const modalViews = {
  TamaAddTask,
  TamaEditTask
}

const handleFoodIcon = (currentGoal) => {
  currentPoints.value = currentGoal.current
  requiredPoints.value = currentGoal.final
}

const handleHeightChange = (heightInVH) => {
  slideUpHeight.value = heightInVH
}

const emit = defineEmits(['main-scrolling'])

const srollablePadding = computed(() => ({
  'padding-bottom': `${20 + totalDailyTasks.value + totalNormalTasks.value}vh`
}))

const handleTaskClicked = (taskObj) => {
  editActive.value = true
  showModal.value = true
  selectedTask.value = taskObj
}

const handleDailyClicked = (dailyObj) => {
  editActive.value = true
  showModal.value = true
  isDaily.value = true
  selectedTask.value = dailyObj
}

const showSlideUp = computed(() => {
  if (addActive.value) {
    return modalViews.TamaAddTask
  } else if (editActive.value) {
    return modalViews.TamaEditTask
  }
})

const handleAddClicked = () => {
  addActive.value = true
  showModal.value = true
}

const handleTaskAdded = () => {
  taskStore.fetchTasks(currentMonth.value, currentYear.value)
  todayTasks.value = taskStore.getTasksByDate(currentDate.value)
  handleModalClose()
}

const handleMonthChange = (monthYear) => {
  currentMonth.value = monthYear[0]
  currentYear.value = monthYear[1]
  taskStore.fetchTasks(currentMonth.value, currentYear.value)
}

const handleDaySelected = (date) => {
  currentDate.value = date
  todayTasks.value = taskStore.getTasksByDate(date)
}

const handleModalClose = () => {
  showModal.value = false
  addActive.value = false
  editActive.value = false
  isDaily.value = false
  console.log(foodRef.value)
  foodRef.value.refreshIcon()
}

const showFocusSelect = computed(() => !userStore.userFocus)

onMounted(() => {
  emit('main-scrolling', 'disable')

  try {
    taskStore.fetchTasks(currentMonth.value, currentYear.value)
  } catch (error) {
    // ignore
  }
})

</script>

<style scoped>

#tama-profile-view {
  position: relative;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
}

.tama-target-calendar {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
}


.tama-target-tasks-scrollable {
  padding-top: 1em;
  width: 90%;
  max-width: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 3em;
}

.tama-target-add-container {
  position: fixed;
  width: 100%;
  bottom: calc(3.5em + 50px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-target-add-container i {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size) + 10px);
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>
