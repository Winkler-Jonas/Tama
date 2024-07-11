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
  <div class="tama-full-calendar">
    <div class="tama-full-calendar-header">
      <i @click="handleSwipeRight" class="ri-arrow-left-line"></i>
      <div class="tama-full-calendar-header-text">
        <h2>{{ getHeader.month }}</h2>
        <h2>{{ getHeader.year }}</h2>
      </div>
      <i @click="handleSwipeLeft" class="ri-arrow-right-line"></i>
    </div>
    <app-horizontal-slider
        :amount-items="3"
        :current-index="currentIndex"
        :is-circular="true"
        :show-gradient="false"
        @on-swipe-left="handleSwipeLeft"
        @on-swipe-right="handleSwipeRight"
        @on-resize="handleSwipeContainerResize"
        @on-locked="handleSliderLock"
    >
      <template #slider-content>
        <div v-for="(month, monthIdx) in prevCurNextMonth" :key="`month-key-${monthIdx}`"
             :style="monthStyle"
             class="tama-full-calendar-month">
          <div v-for="dayS in monthDays[0]" :key="dayS.day_short">
            <p class="tama-full-calendar-weekDay">{{ $t(`components.calendar.weekdays.${dayS.day_short}`).charAt(0) }}</p>
          </div>
          <div class="tama-full-calendar-week" v-for="(week, weekIdx) in month" :key="weekIdx">
            <tama-calendar-digit
                class="tama-full-calendar-day"
                v-for="(day, dayIdx) in week" :key="day.date_str"
                :style="day.month !== currentMonthDigit ? 'color: var(--tama-color-gray)' : ''"
                :is-selected="[weekIdx, dayIdx].every((value, index) => value === currentSelected[index])"
                :is-today="!simpleCalendar ? isToday(day.date) : isStartDate(day.date)"
                :has-task="taskDates.includes(formatToDjangoDate(day.date))"
                :calendar-digit="day.day_date"
                @on-select="handleDaySelect(weekIdx, dayIdx, day.date)"
            />
          </div>
        </div>
      </template>
    </app-horizontal-slider>
  </div>
</template>

<script setup>
import {formatToDjangoDate, getCurrentMonth, getNextMonth, getPreviousMonth, isEqual} from "@/utils/calendarLogic.js";
import TamaCalendarDigit from "@/components/calendar/TamaCalendarDigit.vue";
import {computed, onBeforeMount, onMounted, ref, watch} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useI18n} from "vue-i18n";
import AppHorizontalSlider from "@/components/generic/AppHorizontalSlider.vue";

const { t, locale } = useI18n()
const userStore = useUserStore()

const monthDays = ref([])

const emit = defineEmits(['on-date-select', 'onMonthChange'])
const props = defineProps({
  simpleCalendar: {
    type: Boolean,
    required: false
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  taskDates: {
    type: Array,
    default: []
  }
})

const startDate = computed(() => props.startDate)
const endDate = computed(() => props.endDate)

const blueCircle = computed(() => {
  if (props.simpleCalendar) {
    return startDate.value
  } else {
    return new Date()
  }
})

const orangeCircle = computed(() => {
  if (props.simpleCalendar) {
    return endDate.value
  } else {
    return new Date()
  }
})

function findIndexOfDate(array, date) {
  date.setHours(0, 0, 0, 0);

  for (let weekIndex = 0; weekIndex < array.length; weekIndex++) {
    const week = array[weekIndex];
    const dayIndex = week.findIndex(day => {
      const itemDate = new Date(day.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate.getTime() === date.getTime();
    });

    if (dayIndex !== -1) {
      return [weekIndex, dayIndex];
    }
  }
  return [-1, -1];
}


const prevCurNextMonth = ref([])
const slideContainerWidth = ref(0)
const currentIndex = ref(1)
const currentSelected = ref([0, 0])
const currentMonth = ref([])

const handleSliderLock = () => {
  if (currentIndex.value === 0) {
    currentIndex.value++
    createMonthArray(null, 'prev')
  } else if (currentIndex.value === 2) {
    currentIndex.value--
    createMonthArray(null, 'next')
  }
}

const createMonthArray = (activeMonthDay, direction) => {
  const weekStart = userStore.weekStart ? 1: 0

  if (direction === 'next') {
    const currentLastDay = prevCurNextMonth.value.at(-1).at(-1).at(-1)
    prevCurNextMonth.value.shift()
    prevCurNextMonth.value.push(getNextMonth(currentLastDay.year_day, currentLastDay.year, weekStart))
  } else if (direction === 'prev') {
    const currentFirstDay = prevCurNextMonth.value.at(0).at(0).at(0)
    prevCurNextMonth.value.pop()
    prevCurNextMonth.value.unshift(getPreviousMonth(currentFirstDay.year_day, currentFirstDay.year, weekStart))
  } else {
    const activeMonth = getCurrentMonth(activeMonthDay, weekStart)

    const firstDay = activeMonth.at(0).at(0)
    const lastDay = activeMonth.at(-1).at(-1)

    prevCurNextMonth.value = [
        getPreviousMonth(firstDay.year_day, firstDay.year, weekStart),
        activeMonth,
        getNextMonth(lastDay.year_day, lastDay.year, weekStart)
    ]
  }
}

const monthStyle = computed(() => ({
  width: `${slideContainerWidth.value}px`,
  'min-width': `${slideContainerWidth.value}px`
}))


const handleSwipeContainerResize = (size) => {
  slideContainerWidth.value = size
}


const handleSwipeRight = () => {
  if (currentIndex.value > 0) {
    currentSelected.value = [-1, -1]
    currentIndex.value--
    currentMonth.value = prevCurNextMonth.value.at(0)
  }
}

const handleSwipeLeft = () => {
  if (currentIndex.value < 2) {
    currentSelected.value = [-1, -1]
    currentIndex.value++
    currentMonth.value = prevCurNextMonth.value.at(-1)
  }
}

onBeforeMount(() => {
  const start = new Date(blueCircle.value)
  createMonthArray(start)
  monthDays.value = getCurrentMonth(start, userStore.weekStart ? 1 : 0)
})

onMounted(() => {
  if (props.simpleCalendar) {
    currentSelected.value = findIndexOfDate(monthDays.value, orangeCircle.value)
  }
  currentSelected.value = [-1, -1] // remove selection for calendar view
  currentMonth.value = prevCurNextMonth.value[1]
})




const handleDaySelect = async (week, day, date) => {
  const dateCpy = new Date(date)
  const wrapMonth = (monthNr) => (((monthNr % 12) + 12) % 12)

  if (wrapMonth(currentMonthDigit.value - 1) === dateCpy.getMonth()) {
    currentIndex.value--
    currentMonth.value = prevCurNextMonth.value.at(0)
    handleSwipeRight()
    currentSelected.value = findIndexOfDate(currentMonth.value, dateCpy)
  } else if (wrapMonth(currentMonthDigit.value + 1) === dateCpy.getMonth()) {
    currentIndex.value++
    currentMonth.value = prevCurNextMonth.value.at(-1)
    handleSwipeLeft()
    currentSelected.value = findIndexOfDate(currentMonth.value, dateCpy)
  } else {
    if (currentSelected.value.every((value, index) => value === [week, day][index])) {
      date = null
      currentSelected.value = [-1, -1]
    } else {
      currentSelected.value = [week, day]
    }
  }
  emit('on-date-select', date)
  // retrieve Data from Date
}

const currentMonthDigit = computed(() => {
  if (currentMonth.value && currentMonth.value.length > 0) {
    return currentMonth.value.at(3).at(-1).month
  }
})

watch(currentMonthDigit, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    emit('onMonthChange', {month: newValue + 1, monthStr: getHeader.value.month, year: currentMonth.value.at(3).at(-1).date.getFullYear()})
  }
})

const isToday = (date) => {
  const today = new Date()
  const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return date1.getTime() === date2.getTime()
}

const isStartDate = (date) => {
  const today = blueCircle.value
  const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return date1.getTime() === date2.getTime()
}

const getHeader = computed(() => {
  if (currentMonth.value.length > 0) {
    const lastWeek = currentMonth.value.at(3)[0]
    return {
      year: lastWeek.year,
      month: lastWeek.date.toLocaleDateString(t(`jLocals.${locale.value}`), {month: 'long'})
    }
  }
  return {year: '', month: ''}
})

defineExpose({
  getHeader
})

</script>

<style scoped>

.tama-full-calendar {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.tama-full-calendar-header {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tama-full-calendar-header {
  font-size: var(--tama-h1-size);
}

.tama-full-calendar-header-text {
  display: flex;
  gap: 0.5em;
}

.tama-full-calendar-month {
  flex: 1;
  flex-shrink: 0;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(2em, auto);
  gap: 4px;
  width: 100%;
  margin-inline: auto;
}

.tama-full-calendar-week {
  display: contents;
}

.tama-full-calendar-weekDay {
  display: grid;
  place-items: center;

  font-weight: 100;
}

.tama-full-calendar-day {
  display: grid;
  place-items: center;
}

</style>