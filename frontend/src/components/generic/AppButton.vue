<template>
  <button
    @click="onButtonClick"
    class="tama-app-button"
    ref="buttonRef"
  >
    {{ btnText }}
  </button>

</template>

<script setup>

import {ref} from "vue";

const props = defineProps({
  btnText: {
    type: String,
    required: true
  }
})


const buttonRef = ref(null)

const emit = defineEmits([
    'onClick'
])

const onButtonClick = () => {
  emit("onClick")
}

const focusButton = () => {
  buttonRef.value.focus()
}

defineExpose({
  focusButton
})

</script>

<style scoped>

.tama-app-button {
  /* Remove default button styling (except cursor)*/

  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  outline: none;
  text-decoration: none;
  box-shadow: none;

  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.tama-app-button {
  border: none;
  border-radius: 10px;
  max-width: fit-content;
  padding: 1rem;
  background-color: #FFA976;
  color: white;
  text-align: center;

}

</style>