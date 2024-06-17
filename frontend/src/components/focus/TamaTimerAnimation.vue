<template>
  <div class="timer-container">
    <svg viewBox="0 0 200 200">
      <!-- Static base circle, thinner stroke -->
      <circle cx="100" cy="100" r="90" fill="none" stroke="black" stroke-width="2"/>
      <!-- Dynamic overlay circle, thicker stroke, rotated to start from the top -->
      <circle cx="100" cy="100" r="90" fill="none" stroke="black" stroke-width="10"
              class="elapsed-circle"
              :stroke-dasharray="circumference" :stroke-dashoffset="strokeDashOffset"
              stroke-linecap="round"
              transform="rotate(-90 100 100)"/>
    </svg>
    <div class="timer-label">{{ timeLabel }}</div>
  </div>
  <div>
    <tama-slide-up :is-visible="userError" :slide-height="10">
      <template #slide-up-content>
        <div class="tama-focus-user-error">
          <h2>{{ $t('components.timer.earlyLeave') }}</h2>
        </div>
      </template>
    </tama-slide-up>
  </div>
  <div v-if="canLeave" class="tama-focus-exit-section">
    <i @click="handleExitClicked" class="ri-close-line tama-focus-exit"></i>

  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {useRouter} from "vue-router";
import TamaSlideUp from "@/components/TamaSlideUp.vue";

const router = useRouter()

const props = defineProps({
  timerHours: {
    type: Number,
    required: true
  },
  timerMinutes: {
    type: Number,
    required: true
  },
  timerSeconds: {
    type: Number,
    required: true
  }
})

const userError = ref(false)
const totalSeconds = computed(() =>
    props.timerHours * 3600 + props.timerMinutes * 60 + props.timerSeconds
);

const millisecondsElapsed = ref(0);
const timerInterval = ref(null);
const radius = 90;
const circumference = 2 * Math.PI * radius;

// Adjust the stroke dash offset based on the milliseconds elapsed
const strokeDashOffset = computed(() => {
  const elapsedFraction = millisecondsElapsed.value / (totalSeconds.value * 1000);
  return circumference * elapsedFraction;
});

const timeLabel = computed(() => {
  const totalMilliseconds = totalSeconds.value * 1000 - millisecondsElapsed.value;
  const total = Math.ceil(totalMilliseconds / 1000);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const canLeave = computed(() => {
  return totalSeconds.value - millisecondsElapsed.value / 1000 === 0
})

watch(canLeave, (newValue, oldValue) => {
  if (!newValue) {
    router.beforeEach((to, from, next) => {
      if (!canLeave.value) {
        next(false)
        userError.value = true
        setTimeout(() => {
          userError.value = false
        }, 5000)
      } else {
        // todo need proper route!!
        next();
      }
    });
  }
}, {immediate: true})

onMounted(() => {
  timerInterval.value = setInterval(() => {
    if (millisecondsElapsed.value < totalSeconds.value * 1000) {
      millisecondsElapsed.value += 100;  // Increment every 100 milliseconds
    } else {
      clearInterval(timerInterval.value);
    }
  }, 100);
});

onUnmounted(() => {
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.timer-container {
  align-self: center;
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-label {
  position: absolute;
  font-size: 1.5rem;
}

.elapsed-circle {
  transition: stroke-dashoffset 0.5s linear; /* Smoothly animate dash offset changes */
}

.tama-focus-user-error {
  padding-top: 1em;
  text-align: center;
}

.tama-focus-exit-section {
  width: 100%;
  display: flex;
  justify-content: center;
}

.tama-focus-exit {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size) + 10px);
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--tama-color-orange);
}
</style>
