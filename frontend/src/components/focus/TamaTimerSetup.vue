<template>
  <section id="tama-timer-setup">
    <div class="tama-timer-setup-digit-container">
      <div v-touch-drag="{target: 'hour'}"
           class="tama-time-setup-slide-able">
        <p v-for="value in values.hour.array.slice(values.hour.sliceFrom, values.hour.sliceTo)" :key="`hour-${value}`">
          {{ value >= 0 ? value : '' }}
        </p>
      </div>
      <p v-if="showDots" class="tama-timer-divider">:</p>
      <div v-touch-drag="{target: 'minutes'}"
           class="tama-time-setup-slide-able">
        <p v-for="value in values.minutes.array.slice(values.minutes.sliceFrom, values.minutes.sliceTo)" :key="`minute-${value}`">
          {{ value >= 0 ? value : '' }}
        </p>
      </div>
      <p v-if="showDots" class="tama-timer-divider">:</p>
      <div v-touch-drag="{target: 'seconds'}"
           class="tama-time-setup-slide-able">
        <p v-for="value in values.seconds.array.slice(values.seconds.sliceFrom, values.seconds.sliceTo)" :key="`seconds-${value}`">
          {{ value >= 0 ? value : '' }}
        </p>
      </div>
    </div>
    <div class="tama-timer-start-container">
      <i @click="handleStart" class="ri-play-large-line tama-timer-start-button"></i>
    </div>
  </section>
</template>

<script setup>

import {onMounted, onUnmounted, reactive, ref} from "vue";

const values = reactive({
  padding: 0,
  center: 4,
  hour: {
    array: [...Array(3).fill(-1), ...Array(100).keys(), ...Array(3).fill(-1)],
    sliceFrom: 0,
    sliceTo: 7,
    value: 0
  },
  minutes: {
    array: [...Array(3).fill(-1), ...Array(61).keys(), ...Array(3).fill(-1)],
    sliceFrom: 0,
    sliceTo: 7,
    value: 0
  },
  seconds: {
    array: [...Array(3).fill(-1), ...Array(61).keys(), ...Array(3).fill(-1)],
    sliceFrom: 0,
    sliceTo: 7,
    value: 0
  }
})

const emit = defineEmits(['onStart'])
const showDots = ref(true)

const updateHeight = () => {
  if (window.innerWidth < 800) {
    showDots.value = window.innerHeight >= 750;
  }
}

onMounted(() => {
  updateHeight();  // Set initial height
  window.addEventListener('resize', updateHeight);  // Add resize listener
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight);  // Clean up listener
});

const handleStart = () => {
  emit('onStart', values.hour.value, values.minutes.value, values.seconds.value)
}

/* Touching */

const startY = ref(0);
let lastMoveTime = Date.now();
let speed = 0;

function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

const handleTouchMove = throttle((event) => {
  event.preventDefault();
  const currentY = event.touches[0].clientY;
  const deltaY = startY.value - currentY;
  const currentTime = Date.now();
  const timeDiff = currentTime - lastMoveTime;

  if (Math.abs(deltaY) > 5) {
    const key = event.currentTarget.dataset.target;
    speed = deltaY / timeDiff; // Speed in pixels per millisecond
    lastMoveTime = currentTime;
    moveItems(deltaY, key);
    startY.value = currentY;
  }
}, 50);

function moveItems(deltaY, key) {
  if (deltaY > 0) {
    if (values[key].sliceTo < (values[key].array.length + values.padding)) {
      values[key].sliceTo++;
      values[key].sliceFrom++;
    }
  } else {
    if (values[key].sliceFrom > 0) {
      values[key].sliceTo--;
      values[key].sliceFrom--;
    }
  }
  values[key].value = values[key].array[values[key].sliceFrom + 3];
}

function applyMomentum(key) {
  const decay = 0.8;
  const minSpeed = 0.1;

  function momentumStep() {
    if (Math.abs(speed) > minSpeed) {
      moveItems(speed, key);
      speed *= decay;
      requestAnimationFrame(momentumStep);
    } else {
      speed = 0;
    }
  }
  requestAnimationFrame(momentumStep);
}

const vTouchDrag = {
  mounted(el, binding) {
    el.dataset.target = binding.value.target;
    el.addEventListener('touchstart', (event) => {
      startY.value = event.touches[0].clientY;
      event.preventDefault();
    }, { passive: false });

    el.addEventListener('touchmove', handleTouchMove, { passive: false });

    el.addEventListener('touchend', () => {
      const key = el.dataset.target;
      applyMomentum(key);
    }, { passive: false });
  },
  unmounted(el) {
    el.removeEventListener('touchstart', handleTouchMove);
    el.removeEventListener('touchmove', handleTouchMove);
    el.removeEventListener('touchend', handleTouchMove);
  }
};
</script>

<style scoped>

#tama-timer-setup {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.tama-timer-setup-digit-container {
  width: 100%;
  height: 90%;
  max-height: 50vh;
  padding-bottom: 2rem;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow: hidden;
}

.tama-time-setup-slide-able {
  width: 30%;
  height: 30%;
}

.tama-timer-divider {
  align-self: center;
  font-size: 3rem;
}

.tama-timer-start-container {

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-timer-start-button {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size));
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--tama-color-green);
}

.tama-time-setup-slide-able p {
  text-align: center;
  transition: font-size 0.2s ease;
}

.tama-time-setup-slide-able p:nth-child(1),
.tama-time-setup-slide-able p:nth-child(7) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2em;
  font-size: 1em;
}

.tama-time-setup-slide-able p:nth-child(2),
.tama-time-setup-slide-able p:nth-child(6) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 2.5em;
  font-size: 1.5em;
}

.tama-time-setup-slide-able p:nth-child(3),
.tama-time-setup-slide-able p:nth-child(5) {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 3em;
  font-size: 2em;
}

.tama-time-setup-slide-able p:nth-child(4) {
  font-size: 3rem;
}

</style>