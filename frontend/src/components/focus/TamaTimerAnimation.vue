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
    <tama-focus-error @on-done="userError = false" :focus-task="focusTask" :error-trigger="userError" />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {useRouter} from "vue-router";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import TamaFocusError from "@/components/focus/TamaFocusError.vue";

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
  },
  canLeave: {
    type: Boolean,
    default: false
  },
  focusTask: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['onTimerOver'])

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
  if (totalSeconds.value - millisecondsElapsed.value / 1000 === 0) {
    emit('onTimerOver')
    return true
  }
})

watch(canLeave, (newValue, oldValue) => {
  if (!newValue) {
    router.beforeEach((to, from, next) => {
      if (!canLeave.value) {
        next(false)
        userError.value = true
      } else {
        // todo need proper route!!
        next('/profile');
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
  position: relative;
  margin-inline: 5%;
  width: 90%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--tama-h1-size);
}

.elapsed-circle {
  transition: stroke-dashoffset 0.5s linear; /* Smoothly animate dash offset changes */
}

.tama-focus-user-error {
  padding-top: 1em;
  text-align: center;
}
</style>
