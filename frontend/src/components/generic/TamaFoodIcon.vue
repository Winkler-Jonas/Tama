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
    <div class="tama-food-icon" :style="iconPosition" @click="handleClick">
      <tama-icon :icon-name="token > 0 ? 'foodBadColor' : 'foodBagGray'" />
    </div>
  </teleport>
</template>

<script setup>
import TamaIcon from "@/components/generic/TamaIcon.vue";
import {computed, onMounted, onUnmounted, ref} from "vue";
import websocketService from "@/services/registerWS.js";

const emit = defineEmits(['on-value-change'])
const props = defineProps({
  tamaHeight: {
    type: Number,
    default: 30,
  }
})

const token = ref(0)
const tamaHeight = computed(() => props.tamaHeight)
const socketConnected = ref(false)
const websocketError = ref(false)

const iconPosition = computed(() => ({
  top: `calc(${tamaHeight.value}vh - 12vh)`
}))

const handleClick = () => {
  if (socketConnected.value) {
    websocketService.send('token',{ action: 'remove_token' })
  }
}

const refreshIcon = () => {
  if (socketConnected.value) {
    websocketService.send('token',{ action: 'refresh' })
  }
}

async function connectWebSocket() {
  try {
    socketConnected.value = false
    socketConnected.value = await websocketService.createSocket('token', '/ws/token/')

    websocketService.setHandler('token', {
      onMessage: (data) => {
        if (!data) {
          websocketError.value = true
        } else {
          token.value = data.available;
          console.log(data)
          emit('on-value-change', {current: data.used - data.available, final: data.level})
        }
      },
      onError: (data) => {
        console.log(`Error: ${data.error}`)
        websocketError.value = true;
      },
    });
  } catch (error) {
    socketConnected.value = false;
    console.error('Failed to connect:', error);
  }
}

onMounted(async () => {
  await connectWebSocket()
  refreshIcon()
})

onUnmounted(() => {
  websocketService.closeSocket('token');
})

defineExpose({
  refreshIcon,
})

</script>

<style scoped>

.tama-food-icon {
  position: absolute;
  right: 1em;

  --icon-dimenstion: 7vh;
  width: var(--icon-dimenstion);
  height: var(--icon-dimenstion);
  aspect-ratio: 1;

}

</style>