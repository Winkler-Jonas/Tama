<template>
<div class="tama-target-tasks-wrapper">
  <h2 class="tama-target-task-header">
    {{ $t('components.task.task') }}
  </h2>
  <transition-group name="list" tag="div" class="tama-target-tasks-task-list">
    <tama-task v-for="(task, taskIdx) in userTasks" :key="task.id"
               :task-object="task"
               :is-done="task.done"
               :is-stroked="task.stroke"
               @on-task-clicked="emit('on-task-clicked', task)" />
  </transition-group>
</div>
</template>

<script setup>
import TamaTask from "@/components/task/TamaTask.vue"
import {computed, onMounted} from "vue"
import {useTaskStore} from "@/stores/taskStore.js";

const taskStore = useTaskStore()

const emit = defineEmits(['on-task-clicked'])
const props = defineProps({
  dayTarget: {
    type: Date,
    required: true
  }
})

const currentDate = computed(() => props.dayTarget)

const userTasks = computed(() => {
  return taskStore.getTasksByDate(currentDate.value).filter(task => !task.daily)
})

onMounted(() => {

})

</script>

<style scoped>

.tama-target-tasks-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
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

</style>