<template>
  <button class="tama-context-menu-button" ref="btnRef">
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

const btnRef = ref(null)

const focusItem = () => {
  btnRef.value.focus()
}

defineExpose({
  focusItem,
})

</script>

<style scoped>

.tama-context-menu-button {
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

.tama-context-menu-button {
  width: 100%;
  color: black;
  text-align: left;
  padding: .5rem 0;
}

.tama-context-menu-button:focus,
.tama-context-menu-button:active {
  border-bottom: 1px solid #FFA976;
}

</style>