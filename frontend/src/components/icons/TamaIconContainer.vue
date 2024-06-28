<template>
  <div class="tama-icon-wrapper"
       @click="emit('on-container-click')"
       :class="[{'container-disabled': isDisabled}, {'container-active': iconState}]">
    <div class="tama-icon-container">
      <tama-icon :icon-name="iconName"/>
    </div>
    <p :lang="languageStore.locale">{{ iconText }}</p>
  </div>
</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {useLanguageStore} from "@/stores/langStore.js";
import {onMounted} from "vue";
const languageStore = useLanguageStore()

const emit = defineEmits(['on-container-click'])
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  iconText: {
    type: String,
    required: true,
  },
  iconState: {
    type: Boolean,
    required: false,
    default: false
  },
  isDisabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

const sizeContainers = () => {
  const grid = document.querySelector('.tama-tasks-container');
  const items = document.querySelectorAll('.tama-icon-wrapper');
  const gridWidth = grid.clientWidth;
  const itemWidth = items[0].clientWidth;
  const itemsPerRow = Math.floor(gridWidth / itemWidth);
  const totalRows = Math.ceil(items.length / itemsPerRow);
  const lastRowItemCount = items.length - (totalRows - 1) * itemsPerRow;

  if (lastRowItemCount === 1 && items.length > 1) {
    grid.style.gridTemplateColumns = `repeat(${itemsPerRow}, 1fr)`;
    items[items.length - 1].style.gridColumn = `${Math.floor(itemsPerRow / 2) + 1}`;
  } else {
    grid.style.gridTemplateColumns = `repeat(auto-fit, minmax(100px, 1fr))`;
    items.forEach(item => item.style.gridColumn = 'auto');
  }
}

onMounted(() => {
  sizeContainers()
})

</script>

<style scoped>

.tama-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 1;

  text-align: center;
  padding: .5em 0;

  transition: all 0.3s ease;
  border: 2px solid black;
  border-radius: 20%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.tama-icon-wrapper.container-disabled {
  background-color: rgba(199, 196, 198, 0.9);
  border: 2px solid var(--tama-color-gray);
  box-shadow: none;
}

.tama-icon-wrapper.container-active {
  border: 2px solid var(--tama-color-orange);
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
}

.tama-icon-wrapper p {
  hyphens: auto;
  font-size: clamp(9px, 3.5vw, 25px) !important;
}

.tama-icon-container {
  width: 40%;
  margin-inline: auto;
  padding-bottom: clamp(10px, 3vw, 20px);
}


</style>