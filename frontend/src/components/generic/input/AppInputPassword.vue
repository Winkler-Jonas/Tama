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
      :input-name="passwordLabel"
      input-type="password"
      :label-name="passwordLabel"
      auto-compl="new-password"
      :placeholder-str="$t(placeholderStr)"
      :is-required="true"
      :error-msg="errorMessage"
      @on-blur="setPassword"
      @on-focus="resetError"
  />
</template>

<script setup>
/**
 * The component fires 3 Events:
 *
 *    - onActive    (The input has focus -> errors should be reset)
 *    - onNewInput  (New input available)
 *    - onValidated (True if password is valid else false)
 *
 */
import AppInputField from "@/components/generic/input/AppInputField.vue";
import {computed, nextTick, ref, watch} from "vue";
import {validatePassword} from "@/utils/pwdValidator.js";
import {useI18n} from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  passwordLabel: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: false,
    default: ''
  },
  externError: {
    type: String,
    required: false,
    default: ''
  },
  secondPassword: {
    type: String,
    required: false,
    default: ''
  },
  placeholderStr: {
    type: String,
    required: false,
    default: 'placeholder.pass'
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

const password = ref('');
const errorMessage = ref('')
const externalError = computed(() => props.externError)

watch([password, externalError], (newValues) => {
  const [newPassword, newExternalError] = newValues;
  errorMessage.value = ''

  if (newExternalError) {
    errorMessage.value = newExternalError;
  } else if (!newPassword) {
    errorMessage.value = '';
  } else {
    const response = validatePassword(newPassword, props.userName, props.secondPassword);
    errorMessage.value = response ? t(response, { min: 8 }) : '';
  }
}, { immediate: true });

const setPassword = (pwdData) => {
  password.value = pwdData || ''
  emit('onNewInput', pwdData)
  nextTick( () => {
    const hasError = !!errorMessage.value;
    const isValidPassword = props.isRequired ? !!password.value : true;
    emit('onValidated', !hasError && isValidPassword)
  })
}

const resetError = () => {
  emit('onActive')
}
</script>