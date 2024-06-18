<template>
  <div class="timer-container" >
    <transition name="fade-timer" v-if="showRing">
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
    </transition>
    <div :style="`font-size: ${currentFontSize}`" class="timer-label">{{ timeLabel }}</div>
  </div>
  <div>
    <tama-focus-error @on-done="userError = false" :focus-task="focusTask" :error-trigger="userError" />
  </div>
</template>

<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {useRouter} from "vue-router";
import TamaFocusError from "@/components/focus/TamaFocusError.vue";
import {useUserStore} from "@/stores/userStore.js";

const userStore = useUserStore()
const router = useRouter()
const showRing = ref(false)

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
  },
  fontSize: {
    type: String,
    default: '25px',
  }
})
const emit = defineEmits(['onInput', 'onTimerDone', 'onFontSizeChange'])
const currentFontSize = ref(props.fontSize)

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
    emit('onTimerDone')
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
        next();
      }
    });
  }
}, {immediate: true})

const handleBeforeUnload = () => {
  console.log('inside handler')
  if (totalSeconds.value - millisecondsElapsed.value / 1000 !== 0) {
    userStore.setNewFocusTask({key: props.focusTask, value: timeLabel.value})
  } else {
    userStore.removeFocusTask(props.focusTask)
  }
}



onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  timerInterval.value = setInterval(() => {
    if (millisecondsElapsed.value < totalSeconds.value * 1000) {
      millisecondsElapsed.value += 100;
    } else {
      clearInterval(timerInterval.value);
    }
  }, 100);
  setTimeout(() => {
    showRing.value = true
    currentFontSize.value = 'var(--tama-h1-size)';
  }, 300);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  clearInterval(timerInterval.value);
});
</script>

<style scoped>
.timer-container {
  height: 100%;

  position: relative;
  margin-inline: 5%;
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: font-size 0.3s ease;
}

.elapsed-circle {
  transition: stroke-dashoffset 0.5s linear; /* Smoothly animate dash offset changes */
}

.tama-focus-user-error {
  padding-top: 1em;
  text-align: center;
}


.fade-timer-enter-active,
.fade-timer-leave-active {
  transition: opacity 0.8s ease-out;
}

.fade-timer-enter-from,
.fade-timer-leave-to {
  opacity: 0;
}

</style>
