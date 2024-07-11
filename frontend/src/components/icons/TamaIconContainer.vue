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
  },
})

</script>

<style scoped>

.tama-icon-wrapper {
  position: relative;
  grid-column: auto;
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
  font-size: clamp(9px, 3.5vw, 16px) !important;
}

.tama-icon-container {
  width: 40%;
  margin-inline: auto;
  padding-bottom: clamp(10px, 3vw, 20px);
}


</style>