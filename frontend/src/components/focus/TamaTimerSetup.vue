<template>
  <section id="tama-timer-setup" ref="digitContainer">
    <div v-touch-drag="{target: 'hours'}" class="tama-time-setup-slide-able">
      <span v-for="(value, idx) in displayHours" :key="`hour-${idx}`">
        {{ value >= 0 ? value : '' }}
      </span>
    </div>
    <p class="tama-timer-divider">:</p>
    <div v-touch-drag="{target: 'minutes'}" class="tama-time-setup-slide-able">
      <span v-for="(value, idx) in displayMinutes" :key="`minute-${idx}`">
        {{ value >= 0 ? value : '' }}
      </span>
    </div>
    <p class="tama-timer-divider">:</p>
    <div v-touch-drag="{target: 'seconds'}" class="tama-time-setup-slide-able">
      <span v-for="(value, idx) in displaySeconds" :key="`second-${idx}`">
        {{ value >= 0 ? value : '' }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";

const values = reactive({
  padding: 3,
  center: 4,
  hours: {
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

const emit = defineEmits(['onInput', 'onFontSizeChange'])
const showDots = ref(true)
const digitContainer = ref(null)

const getFontSize = (index) => {
  if (index === 1 || index === 7) {
    return {'font-size': 'var(--container-font-size-xs)'}
  } else if (index === 2 || index === 6) {
    return {'font-size': 'var(--container-font-size-s)'}
  } else if (index === 3 || index === 5) {
    return {'font-size': 'var(--container-font-size-m)'}
  } else if (index === 4) {
    return {'font-size': 'var(--container-font-size-l)'}
  }
}

const updateHeight = () => {
  if (window.innerWidth < 800) {
    showDots.value = window.innerHeight >= 750;
  }
  if (digitContainer.value){
    const sizes = {'xs': 0.025, 's': 0.05, 'm': 0.075, 'l': 0.125};
    Object.entries(sizes).forEach(([key, value]) => {
      const fontSize = digitContainer.value.clientHeight * value;
      digitContainer.value.style.setProperty(`--container-font-size-${key}`, `${fontSize}px`);
    })
    emit('onFontSizeChange', `${sizes.l * digitContainer.value.clientHeight}px`)
  }
}

onMounted(() => {
  updateHeight();
  window.addEventListener('resize', updateHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight);  // Clean up listener
});

/* Touching */
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  }
}

const displayHours = computed(() => {
  return values.hours.array.slice(values.hours.sliceFrom, values.hours.sliceTo)
})

const displayMinutes = computed(() => {
  return values.minutes.array.slice(values.minutes.sliceFrom, values.minutes.sliceTo)
})

const displaySeconds = computed(() => {
  return values.seconds.array.slice(values.seconds.sliceFrom, values.seconds.sliceTo)
})

function moveItems(deltaY, key) {
  const item = values[key];
  if (deltaY > 0 && item.sliceTo < item.array.length) {
    values[key].sliceTo++;
    values[key].sliceFrom++;
  } else if (deltaY < 0 && item.sliceFrom > 0){
    values[key].sliceTo--;
    values[key].sliceFrom--;
  }
  values[key].value = values[key].array[values[key].sliceFrom + values.padding];
  emit('onInput', values.hours.value, values.minutes.value, values.seconds.value)
}

const vTouchDrag = {
  mounted(el, binding) {
    let startY = 0;

    const handleTouchStart = event => {
      event.preventDefault();
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = event => {
      const currentY = event.touches[0].clientY;
      const deltaY = startY - currentY;

      if (Math.abs(deltaY) > 30) {
        moveItems(deltaY, binding.value.target);
        startY = currentY;
      }
    };

    const handleTouchEnd = event => {
      // todo add momentum
      console.log('Touch ended');
    };

    el.addEventListener('touchstart', handleTouchStart, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: false });

    el._handleTouchStart = handleTouchStart;
    el._handleTouchMove = handleTouchMove;
    el._handleTouchEnd = handleTouchEnd;
  },
  unmounted(el) {
    el.removeEventListener('touchstart', el._handleTouchStart);
    el.removeEventListener('touchmove', el._handleTouchMove);
    el.removeEventListener('touchend', el._handleTouchEnd);
  }
};
</script>

<style scoped>

#tama-timer-setup {
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-columns: [hour-start] 1fr [hour-end sep-a-start] min-content [sep-a-end minute-start] 1fr [minute-end sep-b-start] min-content [sep-b-end second-start] 1fr;
  grid-template-rows: 1fr;

  align-items: center;

  --container-font-size-xs: 16px;
  --container-font-size-s: 20px;
  --container-font-size-m: 22px;
  --container-font-size-l: 25px;

  text-align: center;
}

#tama-timer-setup div:nth-child(1) {
  grid-column: hour-start / hour-end;
  grid-row: 1 / -1;
}

#tama-timer-setup p:nth-child(2) {
  grid-column: sep-a-start / sep-a-end;
  grid-row: 1 / -1;
}

#tama-timer-setup div:nth-child(3) {
  grid-column: minute-start / minute-end;
  grid-row: 1 / -1;
}

#tama-timer-setup p:nth-child(4) {
  grid-column: sep-b-start / sep-b-end;
  grid-row: 1 / -1;
}

#tama-timer-setup div:nth-child(5) {
  grid-column: second-start / 6;
  grid-row: 1 / -1;
}

.tama-time-setup-slide-able span.font-transition {
  transition: font-size 3s ease;
}

#tama-timer-setup p,
.tama-time-setup-slide-able {
  line-height: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

#tama-timer-setup p {
  font-size: var(--container-font-size-l);
}

.tama-time-setup-slide-able span:nth-child(1),
.tama-time-setup-slide-able span:nth-child(7) {
  height: var(--container-font-size-xs);
  font-size: var(--container-font-size-xs);
}

.tama-time-setup-slide-able span:nth-child(2),
.tama-time-setup-slide-able span:nth-child(6) {
  height: var(--container-font-size-s);
  font-size: var(--container-font-size-s);
}

.tama-time-setup-slide-able span:nth-child(3),
.tama-time-setup-slide-able span:nth-child(5) {
  height: var(--container-font-size-m);
  font-size: var(--container-font-size-m);
}

.tama-time-setup-slide-able span:nth-child(4) {
  height: var(--container-font-size-l);
  font-size: var(--container-font-size-l);
}

</style>