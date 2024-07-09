<template>
  <section id="tama-edit-task" :style="slideHeight ? `min-height: ${slideUpHeight}vh`: ''">
    <div class="tama-edit-task-header">
      <h2>{{ currentTask.description }}</h2>
      <span class="text-sm text-gray">{{ $t('components.editTask.mark') }}</span>
    </div>
    <div class="tama-edit-functions-container">
      <tama-edit-function
          v-for="(tamaFnKey, funIdx) in editFunctionKeys" :key="`FunIdx-${funIdx}`"
          ref="functionRefs"
          :function-key="tamaFnKey"
          :active-functions="activeFunctions"
          :force-disable="tamaFnKey === 'inProgress' && !inProgress"
          @on-function-click="handleFunctionClick"
      />
    </div>
    <div class="flex space-between w-full">
      <app-round-button @on-click="emit('on-close')" icon-name="close-line" class="bg-orange text-xxl" />
      <app-round-button
          @on-click="() => !mutation ? handleFocusClicked() : handleSubmitChanges()"
          :icon-name="mutation ? 'check-line': 'timer-line'"
          :class="{'bg-blue text-xl': !mutation && !saveError, 'bg-green text-xxl': mutation && !saveError, 'bg-red text-xxl': saveError}"
      />
    </div>
    <app-blurred-overlay :is-visible="showEdit || showMove" />
    <transition name="tama-edit-container">
      <tama-edit-task-edit
          v-if="showEdit"
          :task-category="currentTask.category"
          :task-description="currentTask.description"
          @on-close="modalUnsavedExit = true"
          @on-save="handleTaskEdit"
          key="edit"
      />
      <tama-edit-task-move
          v-else-if="showMove"
          :task-name="currentTask.description"
          :start-date="currentTask.start_date"
          :end-date="currentTask.end_date"
          @on-close="modalUnsavedExit = true"
          @on-save="handleTaskEdit"
          key="move"
      />
    </transition>
<!--    <tama-edit-task-main
        @on-edit-task="editTask = true"
        @on-move-task="moveTask = true"
        @on-focus="handleFocusClicked"
        @on-close="handleExitClicked"
        @change-height="(value) => emit('on-height-change', value)"
        :is-daily="isDaily"
        :task-object="currentTask"
    />-->
  </section>
</template>

<script setup>
import router from "@/router/index.js";
import {useTaskStore} from "@/stores/taskStore.js";
import {convertTask, taskAltered} from "@/utils/taskHandler.js";
import {useUserStore} from "@/stores/userStore.js";
import {formatToDjangoDate, isGreaterEqual} from "@/utils/calendarLogic.js";
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import AppRoundButton from "@/components/generic/AppRoundButton.vue";
import TamaEditTaskEdit from "@/components/edit/TamaEditTaskEdit.vue";
import TamaEditFunction from "@/components/edit/TamaEditFunction.vue";
import TamaEditTaskMove from "@/components/edit/TamaEditTaskMove.vue";
import AppBlurredOverlay from "@/components/generic/AppBlurredOverlay.vue";

const taskStore = useTaskStore()
const userStore = useUserStore()
const noneInteractive = ['inProgress']
const modalActions = ['move', 'edit']

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
  const convertedTask = convertTask(props.taskObject, props.addDate, userStore.userFocus)
  currentTask.value = convertedTask.obj
  fallBackTask.value = convertTask(props.taskObject, props.addDate, userStore.userFocus).obj
  editFunctionKeys.value = convertedTask.functions
  activeFunctions.value = [
      isGreaterEqual(today.value, convertedTask.obj.end_date) ? 'inProgress' : '',
      convertedTask.obj.done ? 'done' : '',
      convertedTask.obj.stroke ? 'stroke' : ''
  ]
  activeFunctions.value = activeFunctions.value.filter(item => item !== '')
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight);
});

const emit = defineEmits(['on-close', 'on-height-change'])
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
  },
  addDate: {
    type: Date
  }
})

const saveError = ref(false)
const functionRefs = ref([])
const showEdit = ref(false)
const showMove = ref(false)
const today = ref(new Date())
const currentTask = ref({})
const editFunctionKeys = ref([])
const activeFunctions = ref([])
const fallBackTask = ref({})
const inProgress = computed(() => isGreaterEqual(today.value, currentTask.value.end_date))
const modalUnsavedExit = ref(false)
const currentAction = ref('')
const mutation = computed(() => taskAltered(currentTask.value, fallBackTask.value) || currentAction.value === 'trash')


watch(activeFunctions, (newValue, oldValue) => {
  /**
   * Old Tasks cannot be inProgress
   * -> Removes inProgress in case added to activeFunctions
   */
  if (!inProgress.value && newValue.includes('inProgress')) {
    activeFunctions.value = activeFunctions.value.filter(item => item !== 'inProgress')
  }
  /* Revert to fallback */

  if (oldValue.includes('edit') && !newValue.includes('edit')) {
    currentTask.value.description = fallBackTask.value.description
    currentTask.value.category = fallBackTask.value.category
  }
  if (oldValue.includes('move') && !newValue.includes('move')) {
    currentTask.value.start_date = new Date(fallBackTask.value.start_date)
    currentTask.value.end_date = new Date(fallBackTask.value.end_date)
  }
  if (oldValue.includes('done') && !newValue.includes('done')) {
    currentTask.value.done = !currentTask.value.done
  }
  if (oldValue.includes('stroke') && !newValue.includes('stroke')) {
    currentTask.value.stroke = !currentTask.value.stroke
  }
})
watch(modalUnsavedExit, (newValue, oldValue) => {
  if (newValue && !oldValue && modalActions.some(item => item === currentAction.value)) {
    /* execute the moduleFunction if the user clicks exit instead of save */
    /* This allows for the function to remove highlighting and also closes the modal */
    functionRefs.value.find(ref => ref.moduleFunction && ref.moduleFunction.name.includes(currentAction.value)).moduleFunction()
  }
  modalUnsavedExit.value = false
})
watch(showMove, newValue => {
  if (newValue) {
    emit('on-height-change', 100)
  } else {
    emit('on-height-change', 60)
  }
})

const handleFunctionClick = (data) => {
  activeFunctions.value = activeFunctions.value.filter(item => !data.disable.includes(item))
  if (data.enable) {
    activeFunctions.value.push(data.enable)
  }
  currentAction.value = data.enable
  if (data.action) {
    Object.assign(currentTask.value, data.action)
  }
  if (Object.keys(data.modal).length > 0) {
    showEdit.value = data.modal.edit
    showMove.value = data.modal.move
  }
}

const handleTaskEdit = (dataObj) => {
  const objKeys = Object.keys(dataObj)
  if (objKeys.includes('start_date')) {
    currentTask.value.start_date = dataObj.start_date
    currentTask.value.end_date = dataObj.end_date
    showMove.value = false
  } else if (objKeys.includes('desc')) {
    currentTask.value.description = dataObj.desc
    currentTask.value.category = dataObj.category
    showEdit.value = false
  }
}

/**
 * Leave Functions
 */
const handleFocusClicked = () => {
  router.push({name: 'focus', params: { taskID: props.taskObject.description }})
}

const handleSubmitChanges = async () => {
  const showError = () => {
    saveError.value = true
    setTimeout(() => {
      saveError.value = false
    }, 5000)
  }

  if (props.isDaily) {
    if (currentAction.value !== 'done') {
      currentTask.value.daily = false
    }
    try {
      await taskStore.createTask({...currentTask.value})
      userStore.removeDailyByDesc(fallBackTask.value.description, props.addDate)
      emit('on-close')
    } catch (error) {
      showError()
    }
  } else {
    try {
      if (currentAction.value === 'trash') {
        await taskStore.deleteTask(props.taskObject.id)
      } else {
        const state = currentTask.value.done ? 'done' : currentTask.value.stroke ? 'cancelled' : 'inProgress'
        await taskStore.updateTask(props.taskObject.id, currentTask.value, { key: [formatToDjangoDate(props.addDate)], value: state })
      }
      emit('on-close')
    } catch (error) {
      showError()
    }
  }
}
</script>

<style scoped>

#tama-edit-task {
  height: 100%;
  width: 100%;
  padding: 1em;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.tama-edit-task-header {
  text-align: center;
}

.tama-edit-functions-container {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* Modal Content slide in */
.tama-edit-container-enter-active,
.tama-edit-container-leave-active {
  transition: all 0.5s ease;
}

.tama-edit-container-leave-active {
  transform: translateX(0%);
}

.tama-edit-container-enter-from,
.tama-edit-container-leave-to {
  transform: translateX(100%);
}
</style>