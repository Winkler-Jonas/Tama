<template>
<div class="tama-target-tasks-wrapper">
  <h2 class="tama-target-task-header">
    {{ showHeader ? $t('components.task.task'): $t('components.task.taskDone') }}
  </h2>
  <transition name="fade">
    <div v-if="userTasks.length === 0 && showHeader" class="tama-target-tasks-none">
      <p>{{ $t('views.target.none') }}</p>
    </div>
  </transition>
  <transition-group name="list" tag="div" class="tama-target-tasks-task-list">
    <tama-task v-for="(task, taskIdx) in userTasks" :key="task.id"
               :task-object="task"
               :is-done="task.task_instances[formatToDjangoDate(currentDate)] === 'done'"
               :is-stroked="task.task_instances[formatToDjangoDate(currentDate)] === 'cancelled'"
               @on-task-clicked="emit('on-task-clicked', task)" />
  </transition-group>
</div>
</template>

<script setup>
import TamaTask from "@/components/task/TamaTask.vue"
import {computed, onMounted, ref} from "vue"
import {useTaskStore} from "@/stores/taskStore.js";
import {formatToDjangoDate, isGreaterEqual} from "@/utils/calendarLogic.js";

const taskStore = useTaskStore()

const emit = defineEmits(['on-task-clicked'])
const props = defineProps({
  dayTarget: {
    type: [Date, null],
    required: true
  }
})

const today = ref(new Date())
const currentDate = computed(() => props.dayTarget)

const showHeader = computed(() => isGreaterEqual(today.value, currentDate.value))

const userTasks = computed(() => {
  return taskStore.getTasksByDate(currentDate.value).filter(task => !task.daily)
})

</script>

<style scoped>

.tama-target-tasks-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tama-target-tasks-none {
  padding: 1em 0;
  color: var(--tama-color-gray);
}

.tama-target-tasks-wrapper h2 {
  text-align: center;
  color: var(--tama-color-blue);
}

.tama-target-tasks-task-list {
  padding-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}

.list-leave-active {
  position: absolute;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

</style>