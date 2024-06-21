<template>
  <section
      @touchstart.passive="handleTouchStart"
      @touchmove.passive="handleTouchMove"
      @touchend.passive="handleTouchEnd"
      id="tama-calendar-row">
    <div class="tama-calendar-row-header">
      <h2 v-if="weekDays && weekDays.length > 0">
        {{ getCurrentMonth }}
      </h2>
    </div>
    <div class="tama-calendar-row-container">
      <div class="tama-calendar-row-day-container" v-for="(day, idx) in weekDays" :key="day.date_str">
        <p style="font-weight: 100;" class="tama-calendar-weekday-letter">{{ $t(`components.calendar.weekdays.${day.day_short}`).charAt(0) }}</p>
        <tama-calendar-digit
            class="tama-calendar-weekday-number"
            @on-select="currentSelected = idx"
            :is-selected="(currentSelected === idx)"
            :calendar-digit="day.day_date"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {computed, onMounted, ref} from "vue";
import { useUserStore } from "@/stores/userStore.js";
import TamaCalendarDigit from "@/components/calendar/TamaCalendarDigit.vue";
import { getNextWeek, getCurrentWeek, getPreviousWeek } from "@/utils/calendarLogic.js";

const { t, locale } = useI18n()
const userStore = useUserStore()
const weekDays = ref([])
const currentSelected = ref(8)
let touchStartX = 0;
let touchEndX = 0;

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
  weekDays.value = getCurrentWeek(new Date(), userStore.weekStart ? 1 : 0)
  currentSelected.value = findIndexOfToday(weekDays.value)

})

const handleTouchStart = (event) => {
  touchStartX = event.changedTouches[0].clientX;
};

const handleTouchMove = (event) => {
  touchEndX = event.changedTouches[0].clientX;
};

const handleTouchEnd = () => {
  if (touchStartX - touchEndX > 50) {
    // swipe Left
    weekDays.value = getNextWeek(++weekDays.value.at(-1).year_day, weekDays.value.at(-1).year, userStore.weekStart ? 1: 0)
  } else if (touchEndX - touchStartX > 50) {
    // swipe right
    weekDays.value = getPreviousWeek(--weekDays.value.at(0).year_day, weekDays.value.at(0).year, userStore.weekStart ? 1: 0)
  }
  currentSelected.value = findIndexOfToday(weekDays.value)
};

const getCurrentMonth = computed(() => {
  return weekDays.value[0].date.toLocaleDateString(t(`jLocals.${locale.value}`), {month: 'long'})
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

.tama-calendar-row-container {
  display: flex;
  justify-content: space-between;
}

.tama-calendar-row-day-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
}

.tama-calendar-weekday-letter {
  font-weight: 100 !important;
}

.tama-calendar-weekday-number {
  font-weight: bold;
}

</style>