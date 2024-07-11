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
  <div class="tama-horizontal-separator">
    <div class="tama-horizontal-left"></div>
    <p v-if="horizontalTxt" class="tama-horizontal-txt">
      {{ horizontalTxt }}
    </p>
    <div class="tama-horizontal-right"></div>
  </div>
</template>

<script setup>

const props = defineProps({
  horizontalTxt: {
    type: String,
    required: false
  }
})

</script>

<style scoped>

.tama-horizontal-separator {
  height: fit-content;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 1rem 0;
}

.tama-horizontal-left,
.tama-horizontal-right {
  flex: 1;
  height: 2px;
  background-color: #777777;
}

.tama-horizontal-txt {
  margin-inline: 1rem;
}

</style>