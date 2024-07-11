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