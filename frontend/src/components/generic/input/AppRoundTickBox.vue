/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
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

  overflow: hidden;
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
  width: 1.1rem;
  height: 1.1rem;
  background: radial-gradient(circle, #FFA976, #cc7a5c 70%, #b06028 100%);
  border-radius: 50%;
  box-shadow: inset 0 4px 10px rgba(255, 255, 255, 0.5),
              inset 0 -4px 10px rgba(0, 0, 0, 0.4),
              0 2px 10px rgba(0, 0, 0, 0.4);
}
</style>