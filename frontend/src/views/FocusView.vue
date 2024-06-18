<template>
  <section id="tama-focus-view">
    <div class="tama-focus-pet-container">
      <img src="@/assets/pet.png" alt="tama-pet"/>
    </div>
    <div class="tama-focus-components">

        <component :is="setupOrTimer"
                   @on-input="(h, m, s) => setTimer([h,m,s])"
                   @on-timer-done="timerDone = true"
                   @on-font-size-change="(value) => middleFontSize = value"
                   :timer-hours="timer.hours"
                   :timer-minutes="timer.minutes"
                   :timer-seconds="timer.seconds"
                   :focus-task="props.taskID"
                   :font-size="middleFontSize"
                   :key="setupOrTimer"
        />

    </div>
    <div class="tama-focus-bottom-area">
      <transition name="tama-focus-fade">
        <i v-if="showStartButton" @click="handleTimerStart" class="ri-play-large-line tama-timer-start-button"></i>
        <i v-else-if="showExitButton" @click="handleExitClicked" class="ri-close-line tama-timer-focus-exit"></i>
      </transition>
    </div>
  </section>
</template>

<script setup>
import TamaTimerAnimation from "@/components/focus/TamaTimerAnimation.vue";
import TamaTimerSetup from "@/components/focus/TamaTimerSetup.vue";
import {computed, onMounted, reactive, ref, watch, watchEffect} from "vue";
import {useUserStore} from "@/stores/userStore.js";

const userStore = useUserStore()

onMounted(() => {
  const timeLeft = userStore.getTaskFocus(props.taskID)
  if (timeLeft) {
    timerSetup.value = false
    setTimer(timeLeft.split(':').map(Number))
  }
  console.log(timer)
})

const timerTabs = {
  TamaTimerSetup,
  TamaTimerAnimation
}

const props = defineProps({
  taskID: {
    type: String,
    required: true
  }
})

const timerSetup = ref(true)
const timerDone = ref(false)
const timer = reactive({
  hours: 0,
  minutes: 0,
  seconds: 0
})
const middleFontSize = ref('')

const setupOrTimer = computed(() => {
  if (!timerSetup.value) {
    // Timer was cancelled previously
    return timerTabs.TamaTimerAnimation
  } else if (timerSetup.value) {
    // Normal mount - show timerSetup
    return timerTabs.TamaTimerSetup
  }
})

const showStartButton = computed(() => Object.values(timer).some(value => value !== 0) && timerSetup.value)
const showExitButton = computed(() => timerDone.value && !timerSetup.value)

/* Events / Button Action */

const handleTimerStart = (hours, minutes, seconds) => {
  if (Object.values(timer).some(value => value !== 0)) {
    timerSetup.value = false
    timerDone.value = false
  }
}

const handleExitClicked = () => {
  resetTimer()
  timerSetup.value = true
  timerDone.value = true
}


const handleTimerDone = () => {
  resetTimer()
}





/* Helper functions */
const setTimer = (hmsArray) => {
  hmsArray.forEach((value, index) => {
    timer[Object.keys(timer)[index]] = value;
  });
}
const resetTimer = () => {
  Object.keys(timer).forEach(key => {
    timer[key] = 0;
  });
}
</script>

<style scoped>

#tama-focus-view {
  max-height: 100%;
  height: 100%;
  width: 100%;
  background-color: var(--tama-color-blue);

  display: grid;

  grid-template-rows: [tama-start] minmax(auto, 35%) [tama-end timer-start] auto [timer-end bottom-start] max-content;
  grid-template-columns: 1fr;
  grid-row-gap: min(1em, 1vh);
}

.tama-focus-pet-container {
  grid-column: 1 / 2;
  grid-row: tama-start / tama-end;

  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: var(--sgn-mbt);
}

.tama-focus-pet-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.tama-focus-components {
  grid-column: 1 / 2;
  grid-row: timer-start / timer-end;
  position: relative;
}

.tama-focus-bottom-area {
  grid-column: 1 / 2;
  grid-row: bottom-start / -1;

  padding-bottom: var(--sgn-mbt);
  min-height: calc(50px + var(--sgn-mbt));
  height: fit-content;
  justify-self: center;
  align-self: end;
}

.tama-timer-start-button,
.tama-timer-focus-exit {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size));
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: flex-end;

}

.tama-timer-start-button {
  background-color: var(--tama-color-green);
}

.tama-timer-focus-exit {
  background-color: var(--tama-color-orange);
}



/* Animations */

.slide-enter-active, .slide-leave-active {
  transition: transform 0.5s;
}

.slide-enter, .slide-leave-to /* .slide-leave-active in <2.1.8 */ {
  position: absolute;
  width: 100%;
  height: 100%;
}

.slide-enter {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

.slide-leave-active {
  transition: transform 0.5s;
}

.slide-leave-active .slide-enter-active {
  transition: transform 0.5s ease-in-out;
}

.slide-leave-active {
  transform: translateX(-100%);
}


.tama-focus-fade-enter-active {
  transition: all 0.3s ease-out;
}

.tama-focus-fade-leave-active {
  transition: all 0.8s ease;
}

.tama-focus-fade-enter-from,
.tama-focus-fade-leave-to {
  opacity: 0;
}

</style>