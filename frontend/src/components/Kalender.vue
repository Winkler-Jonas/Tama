<template>

  <div class="calendar">
    <!-- Header mit Navigationsschaltflächen und aktuellem Monat/Jahr -->
    <div class="header">
      <button @click="prevMonth">«</button>
      <h2 class="subheadlineBlack">{{ monthNames[currentMonth] }} {{ currentYear }}</h2>
      <button @click="nextMonth">»</button>
    </div>
    <!-- Wochentage anzeigen -->
    <div class="weekdays smalltextWeekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>
    <!-- Tage des Monats anzeigen -->
    <div class="days normaltext">
      <!-- Leere Elemente für die Tage vor dem ersten Tag des Monats -->
      <div v-for="n in emptyDays" :key="n" class="empty"></div>
      <!-- Tage des aktuellen Monats -->
      <div v-for="(day, index) in daysInMonth" :key="day" class="day"
        @click="handleDayClicked(day, currentMonth, currentYear, index)" :class="{ today: isToday(day), selecedDay: index === selectedDay}" >
        <span>{{ day }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const currentDate = new Date();
    return {
      // Aktuelles Jahr und Monat
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      // Monatsnamen
      monthNames: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ],
      // Namen der Wochentage
      // weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      weekdays: ["S", "M", "T", "W", "T", "F", "S"],
      selectedDay: currentDate.getDate() - 1,
    };
  },
  computed: {
    // Anzahl der Tage im aktuellen Monat berechnen
    daysInMonth() {
      const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      return Array.from({ length: days }, (_, i) => i + 1);
    },
    // Anzahl der leeren Elemente vor dem ersten Tag des Monats berechnen
    emptyDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      return Array.from({ length: firstDay });
    }
  },
  methods: {
    // Zum vorherigen Monat wechseln
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    // Zum nächsten Monat wechseln
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    isToday(day) {
      const currentDate = new Date();
      return (
        this.currentYear === currentDate.getFullYear() &&
        this.currentMonth === currentDate.getMonth() &&
        day === currentDate.getDate()
      );
    },
    isTomorow(day) {
      const currentDate = new Date();
      return (
        this.currentYear === currentDate.getFullYear() &&
        this.currentMonth === currentDate.getMonth() &&
        day === currentDate.getDate() +1
      );
    },
    handleDayClicked(day, currentMonth, currentYear, index) {
      this.$emit('handleDayClicked', day, this.monthNames[currentMonth], currentYear, this.isToday(day), this.isTomorow(day))
      this.selectedDay = index;
    }
  },
};
</script>

<style scoped>
/* Styling für den Kalender */
.calendar {
  max-width: 300px;
  margin: auto;
  /* border: 1px solid #ddd; */
  /* border-radius: 5px; */
  /* box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  /* background-color: #f5f5f5; */
  /* border-bottom: 1px solid #ddd; */
}

.day {
  box-sizing: border-box;

}

.weekdays,
.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.weekday,
.day,
.empty {
  padding: 10px;
  text-align: center;
}

.weekday {
  /* background-color: #f9f9f9; */
  /* border-bottom: 1px solid #ddd; */
  padding-bottom: 0%;
}

/* .day {
  border: 1px solid #f0f0f0;
} */
.empty {
  visibility: hidden;
}

button {
  background-color: var(--tama-color-white);
  border: none;
}

.today span{
  color: var(--tama-color-orange);
}

.selecedDay {
  padding-left: 4px;
}

.selecedDay span{
  border: 2px solid var(--tama-color-orange);
  padding: 25%;
  /* padding-left: 0%; */
  border-radius: 50%;
}
</style>
