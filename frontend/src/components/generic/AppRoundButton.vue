<template>
  <div class="tama-round-button-wrapper" @click="emit('on-click')">
    <i v-if="icon" :style="`color: ${props.fontColor}`" :class="`ri-${icon}`"></i>
  </div>

</template>

<script setup>

import {computed} from "vue";

const emit = defineEmits(['on-click'])
const props = defineProps({
  iconName: {
    type: String,
    required: false,
    default: ''
  },
  fontColor: {
    type: String,
    required: false,
    default: 'white'
  }
})

const icon = computed(() => props.iconName)

</script>

<style scoped>

.tama-round-button-wrapper {
  min-width: 50px;
  min-height: 50px;
  max-width: 100px;
  max-height: 100px;
  aspect-ratio: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  transition: background-color 0.4s ease;
}


</style>