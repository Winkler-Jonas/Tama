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
  <app-input-field
      :input-name="usernameLabel"
      :default-value="defaultValue"
      input-type="text"
      :label-name="usernameLabel"
      auto-compl="username"
      :placeholder-str="$t(placeholderStr)"
      :is-required="true"
      :error-msg="errorMessage"
      @on-blur="setUsername"
      @on-focus="resetError"
  />
</template>

<script setup>
/**
 * The component fires 3 Events:
 *
 *    - onActive    (The input has focus -> errors should be reset)
 *    - onNewInput  (New input available)
 *    - onValidated (True if username is valid else false)
 *
 */
import AppInputField from "@/components/generic/input/AppInputField.vue";
import { useI18n } from "vue-i18n";
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import websocketService from "@/services/registerWS.js";

const { t } = useI18n();

onMounted(() => {
  websocketService.connectUsernameSocket();
})

onUnmounted(() => {
  websocketService.disconnectUsernameSocket()
})

const props = defineProps({
  usernameLabel: {
    type: String,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
    default: ''
  },
  externError: {
    type: String,
    required: false,
    default: ''
  },
  placeholderStr: {
    type: String,
    required: false,
    default: 'placeholder.user'
  },
  checkTaken: {
    type: Boolean,
    required: false,
    default: true
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: true
  }
})

const emit = defineEmits([
  'onActive',
  'onNewInput',
  'onValidated'
])

const username = ref('');
const errorMessage = ref('');
const externalError = computed(() => props.externError)

watch([username, externalError], async (newValues) => {
  const [newUsername, newExternalError] = newValues;
  errorMessage.value = '';

  if (newExternalError) {
    // Priority for external errors
    errorMessage.value = newExternalError;
  } else if (!newUsername && props.isRequired) {
    errorMessage.value = ''
  } else if (newUsername.length < 3) {
    // Validate using regex pattern
    errorMessage.value = t('error.user.short');
  } else if (props.checkTaken) {
    // Check if username is already taken
    const available = await doesUserExistOnServer(newUsername);
    if (!available) {
      errorMessage.value = t('error.user.taken');
    }
  }
}, { immediate: true });

const doesUserExistOnServer = (username) => {
  return websocketService.checkUsername(username);
};

const setUsername = async (usernameData) => {
  username.value = usernameData
  emit('onNewInput', usernameData)
  await nextTick(() => {
    emit('onValidated', !errorMessage.value && (props.isRequired ? username.value : true))  })
}

const resetError = () => {
  emit('onActive')
}

</script>

