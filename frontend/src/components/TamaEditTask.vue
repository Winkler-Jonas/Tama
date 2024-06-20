<template>
  <tama-slide-up :slide-height="slideHeight" :is-visible="isVisible">
    <template #slide-up-content>
      <section id="tama-edit-task">
        <div class="tama-edit-task-header">
          <h2>{{ taskName }}</h2>
          <span class="text-sm text-gray">{{ $t('components.editTask.mark') }}</span>
        </div>
        <div class="tama-tasks-container">
          <tama-icon-container icon-name="inProgress" :icon-text="$t('components.editTask.inProcess')"/>
          <tama-icon-container icon-name="done" :icon-text="$t('components.editTask.done')"/>
          <tama-icon-container icon-name="stroke" :icon-text="$t('components.editTask.stroke')"/>
          <tama-icon-container icon-name="sub-task" :icon-text="$t('components.editTask.subTask')"/>
          <tama-icon-container icon-name="edit" :icon-text="$t('components.editTask.edit')"/>
          <tama-icon-container icon-name="move" :icon-text="$t('components.editTask.move')"/>
          <tama-icon-container icon-name="trash" :icon-text="$t('components.editTask.trash')"/>
        </div>
        <div class="tama-edit-task-bottom-area">
          <i @click="handleExitClicked" class="ri-close-line tama-edit-task-menu-close"></i>
          <i @click="handleFocusClicked" class="ri-timer-line tama-edit-task-menu-focus"></i>
        </div>
      </section>
    </template>
  </tama-slide-up>
</template>

<script setup>

import TamaIconContainer from "@/components/icons/TamaIconContainer.vue";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import {onMounted, onUnmounted, ref} from "vue";
import router from "@/router/index.js";

const updateHeight = () => {
  if (window.innerWidth < 800) {
    slideHeight.value = window.innerHeight < 750 ? 75 : 60;
  } else {
    slideHeight.value = 40
  }
}

onMounted(() => {
  updateHeight();  // Set initial height
  window.addEventListener('resize', updateHeight);  // Add resize listener
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight);  // Clean up listener
});

const props = defineProps({
  isVisible: {
    type: Boolean,
    required: true
  },
  taskName: {
    type: String,
    required: false,
    default: 'Web-Technologien fertig machen'
  }
})

const slideHeight = ref(0)

const emit = defineEmits(['onExit'])

const handleExitClicked = () => {
  emit('onExit')
}

const handleFocusClicked = () => {
  router.push({name: 'focus', params: { taskID: props.taskName }})
}
</script>



<style scoped>

#tama-edit-task {
  display: flex;
  flex-direction: column;
  margin-inline: var(--sgn-mi);
  margin-bottom: 1em;
  height: 100%;
}

.tama-edit-task-header {
  margin: 1em 0;
  text-align: center;
}

.tama-tasks-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(3px, 1em, 10px);
}

.tama-edit-task-bottom-area {
  margin-top: auto;
  display: flex;
  justify-content: space-between;

  margin-bottom: var(--sgn-mbt);
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