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

</script>

<style scoped>

.tama-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;

  text-align: center;
  padding: .5em 0;

  transition: all 0.3s ease;
  border: 2px solid black;
  border-radius: 20%;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
}

.tama-icon-wrapper:last-child:nth-child(3n + 1) { /* Targets the last child if it is the only item in its row in a 3-column setup */
  justify-self: center;
  grid-column: 2 / span 1; /* Positions it in the center column if your grid has 3 columns */
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

.tama-icon-content p {
  margin-top: auto;
  hyphens: auto;
  font-size: clamp(10px, 12px, 20px);
}

.tama-icon-container {
  width: 50%;
  margin-inline: auto;
}


</style>