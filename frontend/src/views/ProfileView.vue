<template>
  <section id="tama-profile-view" :style="`padding-top: ${$route.meta.tama}vh`" class="main-gl-view">
    <tama-calendar-row
        :current-date="currentDate"
        @on-date-select="handleDaySelected"
        @on-month-change="handleMonthChange"
    />
    <div class="tama-target-content">
      <h2 class="tama-target-task-header">
        {{ $t('components.task.task') }}
      </h2>
      <div class="tama-target-task">
        <p class="tama-target-task-text">
          Nichts zu tun, drücke "+" und füge eine neue Aufgabe hinzu
        </p>
      </div>
      <div class="tama-target-daily-task">
        <h2 class="tama-target-daily-header">
          {{ $t('components.task.daily') }}
        </h2>
        <tama-daily-task />
<!--        <div @click="handleEditClicked" class="tama-target-daily-task-container">
          <div class="round-circle"></div>
          <p class="tama-target-daily-txt">
            Esse mindestens 3 verschiedene Arten Obst
          </p>
        </div>-->
      </div>
    </div>
    <div @click="handleAddClicked" class="tama-target-add-container">
      <i class="ri-add-line tama-target-add-icon"></i>
    </div>
    <tama-slide-up :is-visible="editActive || addActive">
      <template #slide-up-content>
        <component :is="showSlideUp" :add-date="currentDate" @on-exit="handleModalClose" />
      </template>
    </tama-slide-up>
  </section>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue'
import TamaCalendarRow from "@/components/calendar/TamaCalendarRow.vue";
import TamaAddTask from "@/components/TamaAddTask.vue";
import TamaEditTask from "@/components/TamaEditTask.vue";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import TamaDailyTask from "@/components/task/TamaDailyTask.vue";
import {useTaskStore} from "@/stores/taskStore.js";

const taskStore = useTaskStore()


const addActive = ref(false)
const editActive = ref(false)
const currentDate = ref(new Date())
const currentMonth = ref(currentDate.value.getMonth())
const currentYear = ref(currentDate.value.getFullYear())
const todayTasks = ref([])

const modalViews = {
  TamaAddTask,
  TamaEditTask
}

const showSlideUp = computed(() => {
  if (addActive.value) {
    return modalViews.TamaAddTask
  } else if (editActive.value) {
    return modalViews.TamaEditTask
  }
})

const showModal = ref(false)

const handleAddClicked = () => {
  addActive.value = true
  showModal.value = true
}

const handleEditClicked = () => {
  editActive.value = true
  showModal.value = true
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
}

onMounted(() => {
  try {
    taskStore.fetchTasks(currentMonth.value, currentYear.value)
  } catch (error) {
    // ignore
  }

})

</script>

<style scoped>

#tama-profile-view {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  overflow-y: hidden;
}

.tama-target-add-container {
  margin-top: auto;
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
  margin-bottom: .5em;
}

.tama-target-content {
  width: 80%;
  margin-inline: auto;
  overflow-y: auto;

  padding: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.tama-target-daily-task-container {
  display: flex;
  align-items: center;

  padding: 0.5em;
  border-radius: 10px;
  background-color: rgba(255, 169, 118, 0.5);
}

.round-circle {
  width: 30px;
  height: 20px;
  border: 1px solid black;
  border-radius: 50%;
}

.tama-target-task-header {
  color: var(--tama-color-blue);
  text-align: center;
}

.tama-target-daily-header {
  color: var(--tama-color-orange);
  text-align: center;
}

.tama-target-daily-txt {
  padding-left: 1em;
}

.tama-target-task-text {
  padding: 0.5em;
  color: var(--tama-color-gray);

}


</style>
