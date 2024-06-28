<template>
  <section id="tama-edit-task" :style="slideHeight ? `min-height: ${slideUpHeight}vh`: ''">
    <div class="tama-edit-task-header">
      <h2>{{ isDaily? taskObject.desc : taskObject.description }}</h2>
      <span class="text-sm text-gray">{{ $t('components.editTask.mark') }}</span>
    </div>
    <div class="tama-tasks-container">
      <tama-icon-container  v-if="!isDaily" icon-name="inProgress" :is-disabled="!inProgress" :icon-state="inProgress" :icon-text="$t('components.editTask.inProcess')"/>
      <tama-icon-container  icon-name="done" @on-container-click="handleDoneClicked" :icon-state="(currentTask.done && !undoneDaily)" :icon-text="$t('components.editTask.done')"/>
      <tama-icon-container  v-if="!isDaily" icon-name="stroke" @on-container-click="handleStrokeClicked" :icon-state="currentTask.stroke" :icon-text="$t('components.editTask.stroke')"/>
      <tama-icon-container  v-if="!isDaily" icon-name="subTask" :is-disabled="true" :icon-text="$t('components.editTask.subTask')"/>
      <tama-icon-container  icon-name="edit" @on-container-click="handleEditClicked" :icon-state="false" :icon-text="$t('components.editTask.edit')"/>
      <tama-icon-container  icon-name="move" @on-container-click="handleMoveClicked" :icon-state="false" :icon-text="$t('components.editTask.move')"/>
      <tama-icon-container  v-if="!isDaily" icon-name="trash" @on-container-click="handleDeleteClicked" :icon-state="false" :icon-text="$t('components.editTask.trash')"/>
    </div>
    <div class="tama-edit-task-bottom-area">
      <i @click="handleExitClicked" class="ri-close-line tama-edit-task-menu-close"></i>
      <i @click="handleFocusClicked" class="ri-timer-line tama-edit-task-menu-focus"></i>
    </div>
  </section>
</template>

<script setup>
import TamaIconContainer from "@/components/icons/TamaIconContainer.vue";
import {computed, onMounted, onUnmounted, ref} from "vue";
import router from "@/router/index.js";
import {isGreaterEqual} from '@/utils/calendarLogic.js'
import {useTaskStore} from "@/stores/taskStore.js";
import {createDaily} from "@/utils/taskHandler.js";
import {useUserStore} from "@/stores/userStore.js";

const taskStore = useTaskStore()
const userStore = useUserStore()


const slideHeight = ref(0)
const updateHeight = () => {
  if (window.innerWidth < 800) {
    slideHeight.value = window.innerHeight < 750 ? 75 : 60;
  } else {
    slideHeight.value = 40
  }
}



onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight);
});

const emit = defineEmits(['onExit'])
const props = defineProps({
  taskObject: {
    type: Object,
    required: true
  },
  isDaily: {
    type: Boolean,
    required: false,
    default: false
  },
  slideUpHeight: {
    type: Number,
    required: false,
  }
})

const undoneDaily = computed(() => {
  return !!(props.isDaily && props.taskObject.desc);
})
const today = ref(new Date())
const taskEdit = ref(false)
const taskMove = ref(false)
const currentTask = computed(() => props.taskObject)

const inProgress = computed(() => isGreaterEqual(today.value, currentTask.value.end_date) && !(currentTask.value.done || currentTask.value.stroke))


const handleDoneClicked = () => {
  const task = !props.isDaily ? currentTask.value : createDaily(props.taskObject.desc, today.value, userStore.userFocus)
  if (undoneDaily.value) {
    taskStore.createTask(task)
    userStore.removeDailyByDesc(task.description, today.value)
  } else {
    task.done = !task.done
    task.stroke = false
    taskStore.updateTask(task.id, task)
  }
}

const handleStrokeClicked = () => {
  const task = currentTask.value
  task.stroke = !task.stroke
  task.done = false
  taskStore.updateTask(currentTask.value.id, task)
}

const handleEditClicked = () => {

}

const handleMoveClicked = () => {

}

const handleDeleteClicked = () => {
  taskStore.deleteTask(currentTask.value.id)
  emit('onExit')
}






const handleExitClicked = () => {
  emit('onExit')
}

const handleFocusClicked = () => {
  router.push({name: 'focus', params: { taskID: props.taskObject.description }})
}
</script>

<style scoped>

#tama-edit-task {
  width: 100%;
  max-width: var(--tama-max-w);
  margin-inline: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tama-edit-task-header {
  margin: 1em 0;
  text-align: center;
}

.tama-tasks-container {
  height: 100%;
  width: 90%;
  margin-inline: auto;

  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  justify-content: center;
  align-items: start;
}

.tama-tasks-container::after {
  content: '';
  width: 100%;
  grid-column: 1 / -1;
}

@media (max-width: 389px) {
  .tama-tasks-container {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 5px;
  }
}

.tama-edit-task-bottom-area {
  width: calc(100% - var(--sgn-mi));
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--sgn-mbt);
  margin-inline: auto;
}

.tama-edit-task-menu-close,
.tama-edit-task-menu-focus {
  height: 50px;
  width: 50px;
  border-radius: 50%;


  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-edit-task-menu-close {
  font-size: calc(var(--tama-h1-size) + 10px);
  background-color: var(--tama-color-orange);
}


.tama-edit-task-menu-focus {
  font-size: calc(var(--tama-h1-size));
  background-color: var(--tama-color-green);
}
</style>