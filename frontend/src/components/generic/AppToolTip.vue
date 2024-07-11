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
  <div class="tama-tooltip"
       :style="`background: border-box ${bgColor};`"
  >
    <slot name="content"></slot>
  </div>
</template>

<script setup>

const props = defineProps({
  bgColor: {
    type: String,
    required: false,
    default: 'linear-gradient(-30deg,#D95B43,#ECD078)'
  }
})

</script>

<style scoped>


.tama-tooltip {
  position: absolute;
  top: 100%;
  color: #fff;
  font-size: var(--ctx-ft-sz);
  max-width: max-content;
  text-align: center;
  right: calc(var(--h-p-rl) * -1);
}
.tama-tooltip {
  --s: 1em; /* triangle size */
  --r: 1em; /* the radius */

  padding: 1em;
  border: var(--s) solid #0000;
  border-radius: calc(var(--r) + var(--s));
  border-top-right-radius: 0;
  mask:
      radial-gradient(100% 100% at 0 0,#0000 99%,#000 102%)
      calc(100% - var(--s)) 0/var(--s) var(--s) no-repeat border-box,
      linear-gradient(#000 0 0) padding-box;
}
</style>