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
  <teleport to="header">
    <div class="tama-animated-level-bar-container">
      <div class="tama-animated-level-bar text-gray text-center" :style="barStyle">
        <span>{{ currentPoints }}</span>
        <span> / </span>
        <span>{{ nextLevel }}</span>
      </div>
    </div>
  </teleport>
</template>

<script setup>

import {computed} from "vue";

const props = defineProps({
  currentPoints: {
    type: Number,
    default: 0
  },
  nextLevel: {
    type: Number,
    default: 100
  }
})

const userPoints = computed(() => props.currentPoints)

const barStyle = computed(() => ({
  'background-position': `${100 - userPoints.value}% 0`
}))


</script>

<style scoped>

.tama-animated-level-bar-container {
  position: absolute;
  width: 100%;
  top: 2em;
  height: 3vh;
  overflow: visible;

}

.tama-animated-level-bar {
  width: 90%;
  height: 100%;
  margin-inline: auto;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid black;
  border-radius: 1.5vh;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;

  transition: all 0.4s ease-out;

  background: linear-gradient(to right,
                              rgba(255, 169, 118, 1) 0%,
                              rgba(255, 169, 118, 1) 50%,
                              rgba(255, 255, 255, 1) 50%,
                              rgba(255, 255, 255, 1) 100%) no-repeat;
  background-size: 200%, 100%;
  background-position: 100% 0;
}





</style>