<template>
  <div class="tama-focus-icon-wrapper" @click="emit('on-focus-select')" :class="{'focus-active': active}">
    <div class="tama-focus-icon-container" >
      <tama-icon :icon-name="categoryKey" />
    </div>
    <p>{{ categoryInLang }}</p>
  </div>

</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {computed, onMounted, watchEffect} from "vue";

onMounted(() => {
  const items = document.querySelectorAll('.tama-focus-icon-wrapper');
  let maxDimension = 0;

  // Determine the maximum dimension required by any item (either width or height)
  items.forEach(item => {
    const currentWidth = item.offsetWidth;
    if (currentWidth > maxDimension) {
      maxDimension = currentWidth;
    }
  });
  items.forEach(item => {
    item.style.width = `${maxDimension}px`;
    item.style.height = `${maxDimension}px`;
  });
})

const emit = defineEmits(['on-focus-select'])
const props = defineProps({
  categoryKey: {
    type: String,
    required: true
  },
  categoryValue: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: false,
    default: false
  }
})

const categoryInLang = computed(() => props.categoryValue)
const active = computed(() => props.isActive)

</script>

<style scoped>

.tama-focus-icon-wrapper {
  width: 100%;
  height: 100%;
  text-align: center;
  padding: 0.5em 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  border: 2px solid var(--tama-color-blue);
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 20%;
}

.tama-focus-icon-wrapper.focus-active {
  border: 2px solid var(--tama-color-orange);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}

.tama-focus-icon-container {
  max-width: clamp(80px, 50%, 150px);


}



</style>