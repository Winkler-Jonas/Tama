<template>
  <div class="tama-round-tick-box"
       :style="state ? 'border-color: var(--tama-color-blue)': ''"
       @click="handleClick"
       @keydown.enter.prevent.stop="handleClick"
       :tabindex="0"
  >
    <div v-if="state" class="inner"></div>
  </div>
</template>

<script setup>

import { ref } from "vue";

const emit = defineEmits(['onClick'])

const state = ref(false)

const handleClick = () => {
  state.value = !state.value
  emit("onClick", state.value)
}

</script>

<style scoped>
.tama-round-tick-box {
  --w: 1.5rem;
  position: relative;
  height: var(--w);
  width: var(--w);

  border-width: 1px;
  border-style: solid;
  border-color: black;
  border-radius: 50%;
  background: #eee;
  display: flex;
  justify-content: center;
  align-items: center;

  padding: calc(var(--w) - 1.5rem);
  box-shadow:
      inset 0 10px 20px rgba(255, 255, 255, 0.5),
      inset 0 -10px 20px rgba(0, 0, 0, 0.2),
      0 8px 16px rgba(0, 0, 0, 0.2);
}

.tama-round-tick-box:focus-visible {
  outline: none;
  border-color: var(--tama-color-orange) !important;
}

.inner {
  width: 90%;
  height: 90%;
  background: radial-gradient(circle, #FFA976, #cc7a5c 70%, #b06028 100%);
  border-radius: 50%;
  box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.5),
              inset 0 -4px 10px rgba(0, 0, 0, 0.4),
              0 2px 10px rgba(0, 0, 0, 0.4);
}
</style>