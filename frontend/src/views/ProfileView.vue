<template>
  <tama-focus-select :show-focus-select="!userStore.userFocus"/>
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
  <tama-slide-up :is-visible="editActive || addActive" :slide-height="isDaily ? 50 : 60" @height-change="(value) => slideUpHeight = value">
    <template #slide-up-content>
      <component
          :is="showSlideUp"
          :is-daily="isDaily"
          :slide-up-height="slideUpHeight"
          :task-object="selectedTask"
          :add-date="currentDate"
          @on-exit="handleModalClose"
          @on-submit="handleTaskAdded"
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

const taskStore = useTaskStore()
const userStore = useUserStore()

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
const slideUpHeight = ref(0)
const showModal = ref(false)

const modalViews = {
  TamaAddTask,
  TamaEditTask
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
