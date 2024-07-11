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
  <div @click="toggleSelected" class="tama-calendar-digit-container">
    <div class="tama-calendar-digit" :style="digitOnSelect" :class="{'tama-calendar-digit-today': styleToday}">
      <span>{{ calendarDigit }}</span>
      <div v-if="hasTask" class="digit-has-task"></div>
    </div>
    <transition name="day-selected" appear>
      <div v-if="isSelected || isToday" class="tama-calendar-select-img-container">
        <svg class="tama-calendar-select-svg" :class="{'tama-calendar-digit-today': styleToday && !isSelected}" viewBox="0 0 551.97 543.91">
          <use class="tama-calendar-select-svg" :class="{'tama-calendar-digit-today': styleToday && !isSelected}" xlink:href="#calendarCircle"></use>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {computed, ref} from "vue";

const props = defineProps({
  calendarDigit: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  },
  isToday: {
    type: Boolean,
    required: false,
    default: false
  },
  hasTask: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['onSelect'])

const digitOnSelect = computed(() => {
  const currentColor = isSelected.value ? 'var(--tama-color-orange) !important' : ''
  return {color: currentColor}
})

const isToday = computed(() => props.isToday)
const isSelected = computed(() => props.isSelected)


const styleToday = computed(() => !!isToday.value)

const toggleSelected = () => {
  emit('onSelect')
}

</script>

<style scoped>

.tama-calendar-digit-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
}

.tama-calendar-digit {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  z-index: 2;

  padding-top: .4em;
  font-size: min(5vw, 50px);
  transition: color 0.5s ease;
  display: flex;

}

.digit-has-task {
  --dimenstion: 3px;
  width: var(--dimenstion);
  height: var(--dimenstion);
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--tama-color-orange);
}

.tama-calendar-select-img-container {
  grid-row: 1 / 2;
  grid-column: 1 / 2;

  z-index: 1;
  width: min(10vw, 70px);
  height: min(10vw, 70px);

}

.tama-calendar-select-svg {
  stroke: var(--tama-color-orange);
  color: var(--tama-color-orange);
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.tama-calendar-digit-today {
  color: var(--tama-color-blue);
  stroke: var(--tama-color-blue);
}

.day-selected-enter-active {
  animation: ripple 0.4s ease-out forwards;
}

@keyframes ripple {
  0% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.75;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.day-selected-leave-active {
  animation: fadeOut 0.4s ease-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>