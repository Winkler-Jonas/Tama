<template>
  <section id="tama-focus-view" :style="timerSetup ? 'justify-content: space-between;' : 'justify-content: flex-start;'">
    <div class="tama-focus-pet-container">
      <img src="@/assets/pet.png" alt="tama-pet"/>
    </div>
    <div class="tama-focus-components">
      <tama-timer-setup v-if="timerSetup" @on-start="handleTimerStart"/>
      <tama-timer-animation v-else :timer-hours="timer.hours" :timer-minutes="timer.minutes" :timer-seconds="timer.seconds" />
    </div>
  </section>
</template>

<script setup>

import TamaTimerSetup from "@/components/focus/TamaTimerSetup.vue";
import TamaTimerAnimation from "@/components/focus/TamaTimerAnimation.vue";
import {reactive, ref} from "vue";


const timerSetup = ref(true)
const timer = reactive({
  hours: 0,
  minutes: 0,
  seconds: 0
})


const handleTimerStart = (hours, minutes, seconds) => {
  timer.hours = hours
  timer.minutes = minutes
  timer.seconds = seconds
  timerSetup.value = false
}

</script>

<style scoped>

#tama-focus-view {
  height: 100%;
  padding: var(--sgn-mbt) var(--sgn-mi);
  background-color: var(--tama-color-blue);

  display: flex;
  flex-direction: column;

  gap: 2rem;
}

.tama-focus-pet-container {
  height: 25%;
  width: auto;


  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-focus-pet-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

</style>