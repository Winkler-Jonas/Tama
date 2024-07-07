<template>
  <div class="tama-edit-task-edit-container flex column">
    <div class="tama-edit-task-edit-new-task-description">
      <h2>{{ $t('components.addTask.task.label') }}</h2>
      <div class="tama-edit-task-edit-text-container w-fill h-fill">
        <textarea v-model.trim="task"> </textarea>
      </div>
    </div>
    <app-dropdown
        :menu-items="Object.values(categoryValues)" direction="up"
        :menu-label="$t('components.addTask.category.label')"
        :default-select="selectedCategory"
        @on-select="(category) => selectedCategory = category.at(1)"/>
    <fade-transition>
      <div class="flex space-between w-full push-bot" v-if="functionEnabled">
        <app-round-button @on-click="handleClose" icon-name="close-line" class="bg-orange text-xxl" />
        <app-round-button v-if="saveAllowed" @on-click="handleSave" icon-name="check-line" class="bg-green text-xxl" />
      </div>
    </fade-transition>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AppRoundButton from "@/components/generic/AppRoundButton.vue";
import AppDropdown from "@/components/generic/input/AppDropdown.vue";
import {useI18n} from "vue-i18n";
import FadeTransition from "@/components/transitions/FadeTransition.vue";

const { tm } = useI18n()
const contentData = ref(tm(''))

const emit = defineEmits(['on-close', 'on-save'])
const props = defineProps({
  taskDescription: {
    type: String,
    required: true
  },
  taskCategory: {
    type: String,
    required: true
  }
})

const task = ref(props.taskDescription)
const functionEnabled = ref(false)
const saveAllowed = computed(() =>
    (task.value && task.value !== props.taskDescription) ||
    (task.value && props.taskCategory !== Object.keys(categoryValues.value).at(selectedCategory.value)))

const categoryValues = computed(() => {
  const categoryData = contentData.value.components.addTask.category || {};
  const {label, ...categoryValues} = categoryData
  return categoryValues
})

const selectedCategory = ref(Object.keys(categoryValues.value).indexOf(props.taskCategory))

const handleClose = () => {
  setTimeout(() => {
    emit('on-close')
  }, 100)
  functionEnabled.value = false
}

const handleSave = () => {
  setTimeout(() => {
    emit('on-save', {desc: task.value, category: Object.keys(categoryValues.value).at(selectedCategory.value)})
  }, 100)
  functionEnabled.value = false
}


onMounted(() => {
  setTimeout(() => {
    functionEnabled.value = true
  }, 600)
})

</script>

<style scoped>

.tama-edit-task-edit-container {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 11;
  padding: 1em 1em var(--sgn-mbt) 1em;
  justify-content: flex-start;
}

textarea {
  all: unset;
  width: 100%;
  height: 100%;
  resize: none;
}

.tama-edit-task-edit-new-task-description {
  width: 100%;
  height: 40%;
  margin-bottom: 3rem;
}

.tama-edit-task-edit-text-container {
  flex: 1;
  padding: 0.5em;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
}

</style>