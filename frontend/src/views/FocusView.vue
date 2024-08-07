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
  <section id="tama-focus-view">
    <teleport to="header">
      <div class="tama-focus-pet-container">
        <img src="@/assets/pet.png" alt="tama-pet"/>
      </div>
    </teleport>
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
    <teleport to="footer">
      <div class="tama-focus-bottom-area">
        <transition name="tama-focus-fade">
          <i v-if="showStartButton" @click="handleTimerStart" class="ri-play-large-line tama-timer-start-button"></i>
          <i v-else-if="showExitButton" @click="handleExitClicked" class="ri-close-line tama-timer-focus-exit"></i>
        </transition>
      </div>
    </teleport>
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
  height: 100%;
  max-height: 100%;
  width: 100%;
  background-color: var(--tama-color-blue);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.tama-focus-components {
  height: calc(70vh - var(--sgn-mbt));
  width: 90%;
  margin-inline: auto;

  position: relative;

  overflow: hidden;
  z-index: 4;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

.tama-focus-pet-container {
  height: 30vh;
  width: auto;
  overflow-y: hidden;

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



.tama-focus-bottom-area {
  background-color: var(--tama-color-blue);

  display: flex;
  justify-content: center;

  padding-bottom: var(--sgn-mbt);
  min-height: calc(50px + var(--sgn-mbt));
  height: fit-content;
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