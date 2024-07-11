/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
<template>
  <tama-icon-container
      class="icon-container-cls"
      :class="{'container-active': activeFunctions.includes(functionKey)}"
      :is-disabled="!moduleFunction || forceDisable"
      :icon-text="$t(`components.editTask.${functionKey}`)"
      :icon-name="functionKey"
      @on-container-click="moduleFunction"
  />
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import TamaIconContainer from "@/components/icons/TamaIconContainer.vue";

onMounted(() => {
  moduleFunction.value = taskFunctions[Object.keys(taskFunctions).find(fnKey => fnKey.toLowerCase().includes(props.functionKey.toLowerCase()))]
})

const emit = defineEmits(['on-function-click'])
const props = defineProps({
  functionKey: {
    /**
     * [done, stroke, subTask, edit, move, trash ... ]
     */
    type: String,
  },
  activeFunctions: {
    /**
     * Array containing all active functions
     * [done, stroke ... ]
     */
    type: Array
  },
  forceDisable: {
    /**
     * Used to disable inProgress
     */
    type: Boolean,
  },
  externalClick: {
    type: Boolean,
    default: false
  }
})

const moduleFunction = ref(null)
const externalClick = computed(() => props.externalClick)

watch(externalClick, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    moduleFunction.value()
  }
})

const addRemoveKey = () => props.activeFunctions.includes(props.functionKey) ? props.functionKey : ''
const emitData = (disableFunctions, enableFunctions, taskChanges, modal = {}) => {
  const trimmedDisable = disableFunctions.filter(item => item !== '')

  emit('on-function-click', {
    disable: trimmedDisable,
    enable: enableFunctions,
    action: taskChanges,
    modal: modal,
  })
}

const inProgressDummy = () => {
  // dummy function
}

const trashTask = () => {
  const key = addRemoveKey()
  emitData(
      ['done', 'stroke', 'edit', 'move', 'inProgress', key],
      key ? 'inProgress' : props.functionKey,
      {},
      {}
  )
}

const moveTask = () => {
  const key = addRemoveKey()
  emitData(
      ['done', 'stroke', 'trash', key],
      key ? '' : props.functionKey,
      {},
      {
        edit: false,
        move: !key
      }
  )
}

const editTask = () => {
  const key = addRemoveKey()
  emitData(
      ['done', 'stroke', 'trash', key],
      key ? '' : props.functionKey,
      {},
      {
          edit: !key,
          move: false
      }
  )
}

const markTaskDone = () => {
  const key = addRemoveKey()
  emitData(
      ['stroke', 'move', 'edit', 'trash', 'inProgress', key],
      key ? 'inProgress' : props.functionKey,
      {done: true})
}

const markTaskStroke = () => {
  const key = addRemoveKey()
  emitData(
      ['done', 'move', 'edit', 'trash', 'inProgress', key],
      key ? 'inProgress' : props.functionKey,
      {stroke: true})
}

const taskFunctions = {
  inProgressDummy,
  trashTask,
  moveTask,
  editTask,
  markTaskDone,
  markTaskStroke
}

defineExpose({
  moduleFunction
})

</script>

<style scoped>

.icon-container-cls {
  margin: 5px;
  flex: 0 0 calc(33.33% - 10px);
}

@media (min-width: 700px) {
  .tama-task-container {
    flex: 0 0 calc(20% - 10px);
    gap: 15px;
  }
}
</style>