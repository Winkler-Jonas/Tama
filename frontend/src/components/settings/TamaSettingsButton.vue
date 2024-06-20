<template>
  <div class="tama-settings-button" @click="handleButtonClick">
    <div class="tama-settings-button-icon">
      <tama-icon :icon-name="buttonIcon" />
    </div>
    <div class="tama-settings-button-text">
      <p>{{ buttonLabel }}</p>
      <p>{{ buttonSubLabel }}</p>
    </div>
  </div>

</template>

<script setup>

import TamaIcon from "@/components/generic/TamaIcon.vue";

const props = defineProps({
  buttonLabel: {
    type: String,
    required: true
  },
  buttonSubLabel: {
    type: String,
    required: false
  },
  buttonIcon: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['onClick'])

const handleButtonClick = () => {
  emit('onClick')
}

</script>

<style scoped>


.tama-settings-button {
  width: 100%;
  height: auto;

  border: 1px solid black;
  border-radius: 10px;
  padding-right: 1em;

  display: flex;
  align-items: center;
}

.tama-settings-button-icon {
  width: 20%;
  max-width: 200px;
  padding: 1em;
}

.tama-settings-button-text {
  height: 100%;
  padding: 1em 0;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.tama-settings-button-text p:nth-child(1) {

}

.tama-settings-button-text p:nth-child(2) {
  font-weight: bold;
}

</style>