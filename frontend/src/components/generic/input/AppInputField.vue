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
  <div class="tama-input-field-capsule-container">
    <label
        v-if="labelName"
        :for="`form-${inputName}-${inputType}`"
        class="tama-input-field-label"
    >
      {{ labelName }}
    </label>
    <div class="tama-input-field-internal-container">
      <input
          v-model="usrInput"
          :id="`form-${inputName}-${inputType}`"
          :name="inputName"
          @blur="handleBlur"
          @focus="handleFocus"
          :autocomplete="autoCompl"
          :required="isRequired"
          :type="inputType"
          :placeholder="placeholderStr"
          :maxlength="maxLen"
          :minlength="minLen"
          :readonly="locked"
          class="tama-input-field"
          ref="inputFieldRef"
      />
    </div>
    <div v-if="displayError" class="tama-input-field-error-container">
      <i class="ri-error-warning-line"></i>
      <p class="tama-input-field-error-txt">
        {{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<script setup>

import {ref, computed, onUpdated, watchEffect} from "vue";

const props = defineProps({
  inputName: {
    type: String,
    required: true,
  },
  defaultValue: {
    type: String,
    required: false,
    default: ''
  },
  labelName: {
    type: String,
    required: false,
    default: '',
  },
  placeholderStr: {
    type: String,
    required: false,
    default: '',
  },
  inputType: {
    type: String,
    required: false,
    default: 'text',
    validator(value) {
      // use tell for number input
      return ['password', 'text', 'email', 'textarea', 'tel'].includes(value);
    },
  },
  maxLen: {
    type: Number,
    required: false,
  },
  minLen: {
    type: Number,
    required: false,
  },
  locked: {
    type: Boolean,
    required: false,
    default: false,
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
  autoCompl: {
    type: String,
    required: false,
    default: ''
  },
  errorMsg: {
    type: String,
    required: false
  }
})

const emit = defineEmits([
    'onBlur',
    'onFocus'
])

const usrInput = ref(props.defaultValue)
const inputFieldRef = ref(null)
const isFocused = ref(false)

const focusInput = () => {
  inputFieldRef.value.focus()
  isFocused.value = true
}

const blurInput = () => {
  inputFieldRef.value.blur()
  isFocused.value = false
}

const handleBlur = () => {
  isFocused.value = false
}

const handleFocus = () => {
  isFocused.value = true
}

watchEffect(() => {
  if (isFocused.value) {
    emit("onFocus", usrInput.value)
  } else {
    emit("onBlur", usrInput.value)
  }
})

const displayError = computed(() => {
  return !isFocused.value && props.errorMsg !== ''
})

defineExpose({
  focusInput,
  blurInput
})

</script>

<style scoped>

.tama-input-field-capsule-container {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  min-width: 100%;
  align-items: flex-start;
  gap: 5px;
}

.tama-input-field-label {
  font-size: 20px;
}

.tama-input-field-internal-container {
  background-color: transparent;
  min-width: inherit;
  min-height: 3rem;
  padding-left: 1rem;
  border: 1px solid black;
  border-radius: .5rem;
  transition: border-color 0.3s ease;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.tama-input-field-internal-container:focus-within {
  border-color: rgba(253, 222, 196, 1);
}

.tama-input-field {
  min-width: inherit;
  background-color: white;
  outline: none;
  border: none;
  color: #777777 !important;
}

/* Removes autofill background color */
.tama-input-field:-webkit-autofill,
.tama-input-field:-webkit-autofill:hover,
.tama-input-field:-webkit-autofill:focus,
.tama-input-field:-webkit-autofill:active {
  color: #777777 !important;
  transition: background-color 5000s ease-in-out 0s;
  transition-delay: 9999s;
  -webkit-text-fill-color: inherit !important;
}

.tama-input-field:-moz-autofill {
  color: #777777 !important;
  box-shadow: 0 0 0 30px white inset !important;
  -moz-text-fill-color: inherit !important;
}


.tama-input-field::placeholder {
  color: #777777 !important;
}

.tama-input-field-error-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #FFA976;
  padding: .3rem;
  border-radius: .5rem;
  width: 100%;
  font-size: small;
}


.tama-input-field-error-txt {
  flex: 1;
  padding-left: .5rem;

}



</style>