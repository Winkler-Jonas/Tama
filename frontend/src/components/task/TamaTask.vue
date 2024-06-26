<template>
  <div class="tama-task-wrapper" @click="handleRadioClick" :class="isTicked ? 'tama-task-done': 'tama-task-active'">
    <div class="tama-task-radio-button" :class="isTicked ? 'tama-task-done': 'tama-task-active'">
      <i v-if="isTicked" class="ri-check-fill"></i>
    </div>
    <div>
      <p class="tama-task-text">
        {{ props.taskObject.description }}
      </p>
    </div>
  </div>
</template>

<script setup>

import {computed, ref} from "vue";

const props = defineProps({
  taskObject: {
    type: Object,
    required: true
  },
  isDone: {
    type: Boolean,
    required: false,
    default: false
  }
})

const emit = defineEmits(['on-task-clicked'])
const isTicked = computed(() => props.isDone)

const handleRadioClick = () => {
  emit('on-task-clicked', props.taskObject.id)
}

</script>

<style scoped>

.tama-task-wrapper {
  width: 100%;
  height: max-content;
  padding: 0.5em 1em;
  border-radius: 10px;

  display: flex;
  align-items: center;
  gap: 1em;
}

.tama-task-radio-button {
  --dimenstion: 1.5em;

  width: var(--dimenstion);
  height: var(--dimenstion);

  border-radius: 50%;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-task-active {
  border: 1px solid black;
  color: black;
}

.tama-task-done {
  border: 1px solid var(--tama-color-gray);
  color: var(--tama-color-gray);
}

</style>