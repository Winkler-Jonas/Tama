<template>
  <section id="tama-calendar-row">
    <div class="tama-calendar-row-header">
      <h2 v-if="prevCurNextWeek && prevCurNextWeek.length > 0">
        {{ currentMonthName }}
      </h2>
    </div>
    <div class="tama-calendar-row-container" :style="itemStyle">
      <p v-for="dayLetter in prevCurNextWeek[0]" :key="dayLetter.date_str">
        {{ $t(`components.calendar.weekdays.${dayLetter.day_short}`).charAt(0) }}
      </p>
    </div>
    <app-horizontal-slider
        :amount-items="3"
        :current-index="currentIndex"
        :is-circular="true"
        @on-swipe-right="handleSwipeRight"
        @on-swipe-left="handleSwipeLeft"
        @on-resize="handleSwipeContainerResize"
        @on-locked="currentIndex = 1"
    >
      <template #slider-content>
        <div v-for="(week, weekIdx) in prevCurNextWeek" :key="`week-slider-${weekIdx}`"
             :style="itemStyle"
             class="tama-calendar-row-slider-item"
        >
          <div v-for="(day, dayIdx) in week" :key="`day-key-${weekIdx}-${dayIdx}`">
            <tama-calendar-digit
                :is-selected="(currentSelected === dayIdx)"
                :calendar-digit="day.day_date"
                @on-select="currentSelected = dayIdx"
            />
          </div>
        </div>
      </template>
    </app-horizontal-slider>
  </section>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref} from "vue";
import { useUserStore } from "@/stores/userStore.js";
import TamaCalendarDigit from "@/components/calendar/TamaCalendarDigit.vue";
import { getNextWeek, getCurrentWeek, getPreviousWeek } from "@/utils/calendarLogic.js";
import AppHorizontalSlider from "@/components/generic/AppHorizontalSlider.vue";

const { t, locale } = useI18n()
const userStore = useUserStore()
const weekDays = ref([])
const currentSelected = ref(8)

const prevCurNextWeek = ref([])
const slideContainerWidth = ref(0)
const currentIndex = ref(1)
const currentWeek = ref({})


const createWeekArray = (activeWeekDay, direction) => {
  const weekStart = userStore.weekStart ? 1: 0

  if (direction === 'next') {
    const lastDay = prevCurNextWeek.value.at(-1).at(-1)
    prevCurNextWeek.value.shift()
    prevCurNextWeek.value.push(getNextWeek(lastDay.year_day, lastDay.year, weekStart))
  } else if (direction === 'prev') {
    const firstDay = prevCurNextWeek.value.at(0).at(0)
    prevCurNextWeek.value.pop()
    prevCurNextWeek.value.unshift(getPreviousWeek(firstDay.year_day, firstDay.year, weekStart))
  } else {
    const activeWeek = getCurrentWeek(activeWeekDay, weekStart)

    const firstDay = activeWeek.at(0)
    const lastDay = activeWeek.at(-1)

    prevCurNextWeek.value = [
      getPreviousWeek(firstDay.year_day, firstDay.year, weekStart),
      activeWeek,
      getNextWeek(lastDay.year_day, lastDay.year, weekStart)
    ]
  }
}

const itemStyle = computed(() => ({
  width: `${slideContainerWidth.value}px`,
  'min-width': `${slideContainerWidth.value}px`
}))

const handleSwipeContainerResize = (args) => {
  slideContainerWidth.value = args[0]
}

const handleSwipeRight = () => {
  if (currentIndex.value > 0) {
    currentSelected.value = -1
    currentIndex.value--
    currentWeek.value = prevCurNextWeek.value.at(0)
    setTimeout(() => {
      createWeekArray(null, 'prev')
    }, 550)
  }
}

const handleSwipeLeft = () => {
  if (currentIndex.value < 2) {
    currentSelected.value = -1
    currentIndex.value++
    currentWeek.value = prevCurNextWeek.value.at(-1)
    setTimeout(() => {
      createWeekArray(null, 'next')
    }, 550)
  }
}

const findIndexOfToday = (array) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return array.findIndex(item => {
    const itemDate = new Date(item.date);
    itemDate.setHours(0, 0, 0, 0);
    return itemDate.getTime() === today.getTime();
  });
};

onMounted(() => {
  const today = new Date()
  createWeekArray(today)
  currentWeek.value = prevCurNextWeek.value.at(1)
  currentSelected.value = findIndexOfToday(weekDays.value)
})


const currentMonthName = computed(() => {
  const middleOfTheWeek = currentWeek.value.at(3)
  return middleOfTheWeek.date.toLocaleDateString(t(`jLocals.${locale.value}`), {month: 'long'})
})

</script>

<style scoped>

#tama-calendar-row {
  width: 100%;
  padding-inline: var(--sgn-mi);
  border-bottom: 1px solid black;
}

.tama-calendar-row-header {
  text-align: center;
  padding-bottom: 1em;
}

.tama-calendar-row-container,
.tama-calendar-row-slider-item {
  flex-shrink: 0;
  margin-inline: auto;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  justify-items: center;
  gap: 4px;
}



</style>