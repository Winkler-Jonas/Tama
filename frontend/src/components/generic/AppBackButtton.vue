<template>
  <div
       @click="handleClick"
       @keydown.enter="handleClick"
       class="tama-app-back-btn"
       :class="[isClickable ? 'tama-back-button-active': 'tama-back-button-inactive',
                { 'tama-back-button-animation': isAnimating }]"
  >
    <i :tabindex="0" ref="backIcon" class="ri-arrow-left-line icon-focus"></i>
  </div>
</template>

<script setup>

import {computed, reactive, ref} from "vue";

const emit = defineEmits(['onClick'])

const props = defineProps({
  isClickable: {
    type: Boolean,
    required: true,
  }
})

const isClickable = computed(() => props.isClickable)
const isAnimating = ref(false)
const backIcon = ref(null)


const handleClick = () => {
  backIcon.value.blur()
  if (!isClickable.value) return

  emit('onClick')
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 400)
}

</script>

<style scoped>

.tama-app-back-btn {
  padding: 10px;
  outline: none;
  border: none;
}

.icon-focus {
  padding: 10px;
}

.icon-focus:focus-visible {
  outline: none;
  border: none;
  box-shadow: inset 0 0 0 2px #FFA976;
}

.tama-back-button-active {
  color: black;
}

.tama-back-button-inactive {
  color: var(--tama-color-gray)
}

.tama-back-button-animation {
  color: var(--tama-color-orange) !important;
}

</style>