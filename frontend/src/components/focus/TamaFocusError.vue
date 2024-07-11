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
  <tama-slide-up :is-visible="showError" :slide-height="20">
    <template #slide-up-content>
      <h2 class="tama-focus-error-style" v-text-animation="{ text: aiResponse, speed: 50 }"></h2>
    </template>
  </tama-slide-up>
</template>

<script setup>
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import websocketService from "@/services/registerWS.js";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  errorTrigger: {
    type: Boolean,
    required: true
  },
  focusTask: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['onDone']);
const sockedConnected = ref(false);
const aiResponse = ref('');
const showError = ref(false);

const submitTask = async () => {
  if (sockedConnected.value) {
    websocketService.send('focus', { task: props.focusTask });
  }
};

const errorTrigger = computed(() => props.errorTrigger);

watch(errorTrigger, async (newValue, oldValue) => {
  if (oldValue && !newValue) {
    await submitTask();
  } else if (!oldValue && newValue) {
    showError.value = true;
    setTimeout(() => {
      showError.value = false;
      emit('onDone')
    }, 5000);
  }
});

const handleResponse = (data) => {
  if (data === '') {
    aiResponse.value = t('components.timer.earlyLeave');
  } else {
    aiResponse.value = data;
  }
};

const handleError = (error) => {
  aiResponse.value = t('components.timer.earlyLeave');
};

async function connectWebSocket() {
  try {
    sockedConnected.value = await websocketService.createSocket('focus', '/ws/focusUP/');

    websocketService.setHandler('focus', {
      onMessage: (data) => {
        handleResponse(data)
      },
      onError: (data) => {
        handleError(data)
      },
    });
    await submitTask()
  } catch (error) {
    sockedConnected.value = false;
  }
}

watch(sockedConnected, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    connectWebSocket();
  }
});

onMounted(() => {
  connectWebSocket();
});

onUnmounted(() => {
  websocketService.closeSocket();
});
</script>


<style scoped>

.tama-focus-error-style {
  text-align: center;
  padding: 1em;
}

</style>