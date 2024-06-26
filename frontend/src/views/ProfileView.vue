<template>
  <section id="tama-profile-view"
           :style="`top: ${$route.meta.tama}vh; height: ${100 - $route.meta.tama}vh`"
           class="main-gl-view">
    <div class="tama-target-calendar">
      <tama-calendar-row
          :current-date="currentDate"
          @on-date-select="handleDaySelected"
          @on-month-change="handleMonthChange"
      />
    </div>


    <section id="tama-profile-view-scrollable">
      <div class="tama-target-content">
        <h2 class="tama-target-task-header">
          {{ $t('components.task.task') }}
        </h2>
        <tama-task v-for="(task, idx) in todayTasks" :key="task.id"
                   :is-done="task.done"
                   :task-object="task"
                   @on-task-clicked="(taskID) => handleTaskClicked(taskID, idx)"
        />

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
    </section>
  </section>
  <div class="tama-target-add-container">
    <i @click="handleAddClicked" class="ri-add-line tama-target-add-icon"></i>
  </div>
  <tama-slide-up :is-visible="editActive || addActive">
    <template #slide-up-content>
      <component :is="showSlideUp" :add-date="currentDate" @on-exit="handleModalClose" />
    </template>
  </tama-slide-up>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import TamaCalendarRow from "@/components/calendar/TamaCalendarRow.vue";
import TamaAddTask from "@/components/TamaAddTask.vue";
import TamaEditTask from "@/components/TamaEditTask.vue";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import TamaDailyTask from "@/components/task/TamaDailyTask.vue";
import {useTaskStore} from "@/stores/taskStore.js";
import TamaTask from "@/components/task/TamaTask.vue";


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

const emit = defineEmits(['main-scrolling'])



const handleTaskClicked = (taskID, idx) => {
  editActive.value = true
  showModal.value = true
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
  console.log(todayTasks.value[0])
}

const handleModalClose = () => {
  showModal.value = false
  addActive.value = false
  editActive.value = false
}


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


#tama-profile-view-scrollable {
  width: 100%;
  max-width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding-bottom: 25%;
}



.tama-target-content {
  width: 90%;
  margin-inline: auto;
  padding: 1em 0;
  display: flex;
  flex-direction: column;
  gap: 1em;
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


.tama-target-daily-task-container {
  display: flex;
  align-items: center;

  padding: 0.5em;
  border-radius: 10px;
  background-color: var(--tama-color-daily);
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
