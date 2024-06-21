<template>
  <div @click="toggleSelected" class="tama-calendar-digit-container">
    <span class="tama-calendar-digit" :style="digitOnSelect">
      {{ calendarDigit }}
    </span>
    <transition name="day-selected" appear>
      <div v-if="isSelected" class="tama-calendar-select-img-container">
        <svg class="tama-calendar-select-svg" viewBox="0 0 551.97 543.91">
          <use class="tama-calendar-select-svg" xlink:href="#calendarCircle"></use>
        </svg>
      </div>
    </transition>
  </div>
</template>

<script setup>

import {computed, ref} from "vue";

const props = defineProps({
  calendarDigit: {
    type: Number,
    required: true
  },
  isSelected: {
    type: Boolean,
    required: true
  }
})
const emit = defineEmits(['onSelect'])

const digitOnSelect = computed(() => {
  const currentColor = isSelected.value ? 'var(--tama-color-orange)' : ''
  return {color: currentColor}
})

const isSelected = computed(() => props.isSelected)


const toggleSelected = () => {
  emit('onSelect')
}

</script>

<style scoped>

.tama-calendar-digit-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  align-items: center;
  justify-items: center;
}

.tama-calendar-digit {
  grid-row: 1 / 2;
  grid-column: 1 / 2;
  z-index: 2;

  padding-top: .4em;
  font-size: min(5vw, 50px);
}

.tama-calendar-select-img-container {
  grid-row: 1 / 2;
  grid-column: 1 / 2;

  z-index: 1;
  width: min(10vw, 70px);
  height: min(10vw, 70px);

}

.tama-calendar-select-svg {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: contain;
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
}

.day-selected-enter-active {
  animation: ripple 0.4s ease-out forwards;
}

@keyframes ripple {
  0% {
    transform: scale(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.75;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.day-selected-leave-active {
  animation: fadeOut 0.4s ease-out forwards;
}

@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>