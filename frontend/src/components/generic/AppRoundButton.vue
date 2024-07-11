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