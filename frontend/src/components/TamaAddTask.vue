<template>
  <section id="tama-add-task-modal" key="modal">
    <div class="tama-add-task-menu-container">
      <app-ai-input
          :label-name="$t('components.addTask.task.label')"
          @on-input="handleTaskInput" />
      <app-dropdown
          :menu-label="$t('components.addTask.repeat.label')"
          @on-input-clicked="activeMenu = 2"
          @on-select="handleRepeatSelect"
          :menu-items="Object.values(repeatValues)"
          direction="up"
          :external-collapse="activeMenu === 2"
      />
      <app-dropdown
          :menu-label="$t('components.addTask.due.label')"
          @on-input-clicked="activeMenu = 3"
          @on-select="handleDueSelect"
          :menu-items="Object.values(dueValues)"
          direction="up"
          :external-collapse="activeMenu === 3"
      />
      <app-dropdown
          :menu-label="$t('components.addTask.category.label')"
          @on-input-clicked="activeMenu = 4"
          @on-select="handleCategorySelect"
          :menu-items="Object.values(categoryValues)"
          direction="up"
          :external-collapse="activeMenu === 4"
      />
      <div class="tama-add-task-menu-submit-area">
        <i @click="handleExitClicked" class="ri-close-line tama-add-task-menu-close"></i>
        <i @click="handleSubmitClicked" class="ri-check-line tama-add-task-menu-submit"></i>
      </div>
    </div>
  </section>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {computed, reactive, ref} from "vue";
import AppAiInput from "@/components/generic/input/AppAiInput.vue";
import AppDropdown from "@/components/generic/input/AppDropdown.vue";
import {useUserStore} from "@/stores/userStore.js";
import {useTaskStore} from "@/stores/taskStore.js";
import {formatEndDate} from "@/utils/taskHandler.js";

const { tm } = useI18n()
const userStore = useUserStore()
const taskStore = useTaskStore()

const props = defineProps({
  addDate: {
    type: Date,
    required: true
  }
})

const emit = defineEmits(['onExit', 'onSubmit'])

const contentData = ref(tm(''))
const activeMenu = ref(0)

const repeatValues = computed(() => {
  const repeatData = contentData.value.components.addTask.repeat || {};
  const {label, ...repeatValues} = repeatData
  return repeatValues
})
const dueValues = computed(() => {
  const dueData = contentData.value.components.addTask.due || {};
  const {label, ...dueValues} = dueData
  return dueValues
})
const categoryValues = computed(() => {
  const categoryData = contentData.value.components.addTask.category || {};
  const {label, ...categoryValues} = categoryData
  return categoryValues
})




const userInput = reactive({
  description: '',
  repeat: '',
  start_date: props.addDate,
  end_date: props.addDate,
  category: '',
  important: 0
})

const handleTaskInput = (usrInput) => {
  userInput.description = usrInput
}

const handleRepeatSelect = (selected) => {
  userInput.repeat = Object.keys(repeatValues.value)[selected[1]]
}

const handleDueSelect = (selected) => {
  userInput.end_date = formatEndDate(selected[1], props.addDate, userStore.weekStart ? 1: 0)
}

const handleCategorySelect = (selected) => {
  userInput.category = Object.keys(categoryValues.value)[selected[1]]
}

const handleExitClicked = () => {
  emit('onExit')
}

const handleSubmitClicked = () => {
  if (Object.values(userInput).every(value => value !== null && value !== undefined && value !== '')) {
    try {
      taskStore.createTask(userInput)
      emit('onSubmit')
    } catch (error) {
      // todo display error somehow
    }
  }
}

</script>

<style scoped>

.icon {
  width: 37px;
  height: 37px;
}

.tama-add-task-modal-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

#tama-add-task-modal {
  margin-inline: auto;
  width: 100%;
}

.tama-add-task-menu-container {
  height: 100%;
  min-height: 60vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 1rem;
  padding: 0 var(--sgn-mi)
}

.tama-add-task-menu-submit-area {
  margin-top: auto;
  display: flex;
  justify-content: space-between;

  margin-bottom: var(--sgn-mbt);
}

.tama-add-task-menu-close,
.tama-add-task-menu-submit {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size) + 10px);
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-add-task-menu-close {
  background-color: var(--tama-color-orange);
}

.tama-add-task-menu-submit {
  background-color: var(--tama-color-green);
}
</style>