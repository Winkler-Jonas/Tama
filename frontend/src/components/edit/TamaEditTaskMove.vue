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
  <div class="tama-edit-task-edit-container">
    <div class="w-full text-center">
      <h2>{{ $t('components.moveTask.header', {task: taskName}) }}</h2>
    </div>
    <div class="tama-edit-task-edit-calendar">
      <tama-calendar
          :simple-calendar="true"
          :start-date="dates.start_date"
          :end-date="dates.end_date"
          @on-date-select="handleDateSelect"
      />
    </div>
<!--    <div class="move-function-container flex push-bot">
      <div v-for="(moveFunction, idx) in moveFunctions" :key="`move-function-${idx}`"
          @click="handleFunctionClick(moveFunction.key)"
          :class="{'function-active': currentSelected === moveFunction.key}">
        <p>{{ moveFunction.value }}</p>
      </div>
    </div>-->
    <fade-transition>
      <div class="flex space-between w-full push-bot" v-if="functionEnabled">
        <app-round-button @on-click="handleClose" icon-name="close-line" class="bg-orange text-xxl" />
        <app-round-button v-if="saveAllowed" @on-click="handleSave" icon-name="check-line" class="bg-green text-xxl" />
      </div>
    </fade-transition>
  </div>
</template>

<script setup>

import AppRoundButton from "@/components/generic/AppRoundButton.vue";
import {computed, onMounted, reactive, ref} from "vue";
import {useI18n} from "vue-i18n";
import TamaCalendar from "@/components/calendar/TamaCalendar.vue";
import {isDateBefore, isEqual} from "@/utils/calendarLogic.js";
import FadeTransition from "@/components/transitions/FadeTransition.vue";

const { tm } = useI18n()
const contentData = ref(tm(''))

const emit = defineEmits(['on-save', 'on-close'])
const props = defineProps({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  taskName: {
    type: String,
  }
})

const saveAllowed = computed(() => {
  if (isEqual(props.startDate, dates.start_date) && isEqual(props.endDate, dates.end_date)) {
    return false
  } else if (isDateBefore(dates.end_date, dates.start_date)) {
    return false
  }
  return true
})
const functionEnabled = ref(false)
const dates = reactive({
  start_date: new Date(props.startDate),
  end_date: new Date(props.endDate)
})
const firstDateSelect = ref(false)

const handleDateSelect = (date) => {
  if (!firstDateSelect.value) {
    firstDateSelect.value = true
    dates.start_date = date
    dates.end_date = date
  } else {
    firstDateSelect.value = false
    dates.end_date = date
  }
}

const handleClose = () => {
  setTimeout(() => {
    emit('on-close')
  }, 100)
  functionEnabled.value = false
}

const handleSave = () => {
  setTimeout(() => {
    emit('on-save', dates)
  }, 100)
  functionEnabled.value = false
}

onMounted(() => {
  console.log(props.startDate)
  console.log(props.endDate)

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
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

}

.move-function-container div.function-active {
  border: 1px solid var(--tama-color-orange)
}

.tama-edit-task-edit-calendar {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 90%;
  margin-inline: auto;
}

</style>