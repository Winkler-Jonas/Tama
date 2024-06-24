<template>
  <div class="tama-full-calendar">
    <div class="tama-full-calendar-header">
      <i @click="handleGetPreviousMonth" class="ri-arrow-left-line"></i>
      <div class="tama-full-calendar-header-text">
        <h2>{{ getHeader.month }}</h2>
        <h2>{{ getHeader.year }}</h2>
      </div>
      <i @click="handleGetNextMonth" class="ri-arrow-right-line"></i>
    </div>
    <div class="tama-full-calendar-month"
         v-touch:swipe.left="handleSwipeLeft"
         v-touch:swipe.right="handleSwipeRight"
    >
      <div v-for="dayS in monthDays[0]" :key="dayS.day_short">
        <p class="tama-full-calendar-weekDay">{{ $t(`components.calendar.weekdays.${dayS.day_short}`).charAt(0) }}</p>
      </div>
      <div class="tama-full-calendar-week" v-for="(week, weekIdx) in monthDays" :key="weekIdx">
        <tama-calendar-digit
            class="tama-full-calendar-day"
            v-for="(day, dayIdx) in week" :key="day.date_str"
            :style="day.month !== currentMonthDigit ? 'color: var(--tama-color-gray)' : ''"
            :is-selected="[weekIdx, dayIdx].every((value, index) => value === currentSelected[index])"
            :is-today="isToday(day.date)"
            :calendar-digit="day.day_date"
            @on-select="handleDaySelect(weekIdx, dayIdx, day.date)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {getCurrentMonth, getNextMonth, getPreviousMonth} from "@/utils/calendarLogic.js";
import TamaCalendarDigit from "@/components/calendar/TamaCalendarDigit.vue";
import {computed, onBeforeMount, onMounted, ref} from "vue";
import {useUserStore} from "@/stores/userStore.js";
import {useI18n} from "vue-i18n";

const { t, locale } = useI18n()
const userStore = useUserStore()
const currentSelected = ref([0, 0])
const monthDays = ref([])

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

onBeforeMount(() => {
  monthDays.value = getCurrentMonth(new Date(), userStore.weekStart ? 1 : 0)
})

onMounted(() => {
  currentSelected.value = findIndexOfDate(monthDays.value, new Date())
})


const handleSwipeRight = () => {
  handleGetPreviousMonth()
}

const handleSwipeLeft = () => {
  handleGetNextMonth()
}

const handleDaySelect = async (week, day, date) => {
  const dateCpy = new Date(date)
  const wrapMonth = (monthNr) => (((monthNr % 12) + 12) % 12)

  if (wrapMonth(currentMonthDigit.value - 1) === dateCpy.getMonth()) {
    await handleGetPreviousMonth()
    currentSelected.value = findIndexOfDate(monthDays.value, dateCpy)
  } else if (wrapMonth(currentMonthDigit.value + 1) === dateCpy.getMonth()) {
    await handleGetNextMonth()
    currentSelected.value = findIndexOfDate(monthDays.value, dateCpy)
  } else {
    currentSelected.value = [week, day]
  }

  // retrieve Data from Date
}

const currentMonthDigit = computed(() => monthDays.value.at(3).at(-1).month)

const isToday = (date) => {
  const today = new Date()
  const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const date2 = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return date1.getTime() === date2.getTime()
}

const handleGetNextMonth = async () => {
  const currentLastDay = monthDays.value.at(-1).at(-1)
  monthDays.value = getNextMonth(currentLastDay.year_day, currentLastDay.year, userStore.weekStart ? 1 : 0)
}

const handleGetPreviousMonth = async () => {
  const currentFirstDay = monthDays.value[0][0]
  monthDays.value = getPreviousMonth(currentFirstDay.year_day, currentFirstDay.year, userStore.weekStart ? 1 : 0)
}

const getHeader = computed(() => {
  if (monthDays.value.length > 0) {
    const lastWeek = monthDays.value.at(3)[0]

    return {
      year: lastWeek.year,
      month: lastWeek.date.toLocaleDateString(t(`jLocals.${locale.value}`), {month: 'long'})
    }
  }
  return {year: '', month: ''}
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