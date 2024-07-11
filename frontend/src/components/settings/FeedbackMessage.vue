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
  <div class="feedback-message">
      <p>{{ feedbackMessage }}</p>
    <div class="feedback-timestamp-container">
      <span>{{ feedbackDate }}</span>
      <span>{{ feedbackTime }}</span>
      <i @click="handleDeleteClicked" class="ri-delete-bin-line feedback-delete"></i>
    </div>
  </div>

</template>

<script setup>

import { onMounted, ref } from "vue";

const props = defineProps({
  feedbackMessage: {
    type: String,
    required: true
  },
  feedbackTimeStamp: {
    type: String,
    required: true
  }
})
const emit = defineEmits(['onDelete'])

const feedbackDate = ref('')
const feedbackTime = ref('')

const handleDeleteClicked = () => {
  emit('onDelete')
}

onMounted(() => {
  const dateObj = new Date(props.feedbackTimeStamp)

  const day = dateObj.getDate().toString().padStart(2, '0');  // Add leading zero if needed
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const year = dateObj.getFullYear();

  // Format the date
  feedbackDate.value = `${day}.${month}.${year}`;

  // Extract time components
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const seconds = dateObj.getSeconds().toString().padStart(2, '0');

  // Format the time
  feedbackTime.value = `${hours}:${minutes}:${seconds}`;

})

</script>

<style scoped>

.feedback-message {
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 1em;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5em 0;
}

.feedback-delete{
  height: 30px;
  width: 30px;
  border-radius: 50%;
  color: white;
  margin-right: 10px;

  font-size: 20px;
  background-color: var(--tama-color-orange);
  align-self: center;

  display: flex;
  justify-content: center;
  align-items: center;
}

.feedback-message-container p {
  padding: 1em;
}

.feedback-timestamp-container {
  border-top: 1px solid black;

  display: flex;
  justify-content: space-between;
}

.feedback-timestamp-container span {
  padding: 1em;
}

</style>