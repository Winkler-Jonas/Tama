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
  <div class="tama-user-add-container">
    <div class="autocomplete-container">
      <input class="reset-input autocomplete-input"
             :tabindex="0"
             :placeholder="$t('views.profile.invite.placeholder')"
             v-model="userInput"
             @input="handleNewInput"
             @focus="toggleFocus"
             @focusout="toggleFocus"
             @keydown.tab.prevent="handleAutocomplete"
             @keydown.enter.prevent="handleSendInvite"
      >
      <div v-if="!inviteResponse" class="visible-text flex">
        <span class="userInput">{{ userInput }}</span>
        <span :style="{ visibility: animateInput ? 'visible' : 'hidden' }" class="input-animation">|</span>
        <span class="autocomplete text-gray">{{ autoComplete }}</span>
        <div class="send-icon-container" @click="handleSendInvite">
          <tama-icon icon-name="sendInvite" />
        </div>
      </div>
      <div class="visible-text flex" v-else>
        <span v-text-animation="{text: inviteResponse, speed: 50}"></span>
        <div class="send-icon-container" @click="handleSendInvite">
          <tama-icon icon-color="orange" icon-name="sendInvite" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import websocketService from "@/services/registerWS.js";
import TamaIcon from "@/components/generic/TamaIcon.vue";
import friendService from "@/services/friendService.js";
import {useI18n} from "vue-i18n";

const { t } = useI18n()

const userInput = ref('')
const socketConnected = ref(false)
const websocketError = ref(false)
const websocketResponse = ref('')
const inputFocused = ref(false)
const animateInput = ref(false)
let intervalId = null;
const inviteResponse = ref('')

const handleSendInvite = async () => {
  if (!userInput.value) return;
  try {
    await friendService.sendInvite(userInput.value)
    inviteResponse.value = t('views.profile.invite.send')
    setTimeout(() => {
      inviteResponse.value = ''
    }, 3 * 1000)
  } catch (error) {
    inviteResponse.value = t('views.profile.invite.error')
    setTimeout(() => {
      inviteResponse.value = ''
    }, 3 * 1000)
  }
}

watch(inputFocused, (newVal) => {
  if (newVal) {
    animateInput.value = true
    intervalId = setInterval(() => {
      animateInput.value = !animateInput.value
    }, 800)
  } else {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    animateInput.value = false
  }
});

const handleAutocomplete = () => {
  if (websocketResponse.value) {
    userInput.value = websocketResponse.value
  }
}

const autoComplete = computed(() => {
  if (userInput.value && websocketResponse.value.startsWith(userInput.value)) {
    return websocketResponse.value.slice(userInput.value.length);
  }
  return '';
})

const handleNewInput = () => {
  if (userInput.value) {
    websocketService.send('userAuto',{ username: userInput.value })
  }
}

const toggleFocus = () => {
  inputFocused.value = !inputFocused.value
}

async function connectWebSocket() {
  try {
    socketConnected.value = false
    socketConnected.value = await websocketService.createSocket('userAuto', '/ws/get_user_suffix/')

    websocketService.setHandler('userAuto', {
      onMessage: (data) => {
        console.log(data)
        if (data.trim() === '') {
          websocketError.value = true
        } else {
          websocketResponse.value = data;
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

onMounted(() => {
  connectWebSocket()
})

onUnmounted(() => {
  websocketService.closeSocket('ask');
  if (intervalId) {
    clearInterval(intervalId);
  }
})
</script>

<style scoped>
.tama-user-add-container {
  width: 100%;
  max-height: fit-content;
  padding: 1em;
  border: 1px solid black;
  border-radius: 10px;
}

.autocomplete-container {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
}

.autocomplete-input {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  background: transparent;
  color: transparent;
}

.visible-text {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  z-index: 2;
  pointer-events: none;

  align-items: center;
}

.visible-text .userInput,
.visible-text .input-animation,
.visible-text .autocomplete {
  pointer-events: none;
}

.send-icon-container {
  pointer-events: auto;
}


.send-icon-container {
  margin-left: auto;
  height: 2rem;
  width: 2rem;
  aspect-ratio: 1;
}
</style>