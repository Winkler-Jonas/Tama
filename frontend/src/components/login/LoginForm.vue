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
  <form @keydown.enter.stop.prevent="handleEnter"
        class="tama-login-form-scroll tama-login-form-fade"
  >
    <app-input-username
        :username-label="$t('views.login.inputLabel.usr')"
        :extern-error="username.error"
        :default-value="username.value"
        :check-taken="false"
        @on-active="() => username.error = ''"
        @on-validated="(valid) => username.valid = valid"
        @on-new-input="(data) => username.value = data"
    />
    <app-input-password
        :password-label="$t('views.login.inputLabel.pwd')"
        :extern-error="password.error"
        @on-active="handleActiveState"
        @on-validated="(valid) => password.valid = valid"
        @on-new-input="(data) => password.value = data"
    />
  </form>
  <app-button :btn-text="$t('views.login.btn')"
              class="tama-login-send"
              @on-click="handleLogin"
              ref="submitButtonRef"
  />
</template>

<script setup>
import {useI18n} from "vue-i18n"
import { nextTick, onUpdated, reactive, ref } from "vue"
import {useUserStore} from "@/stores/userStore.js"
import AppButton from "@/components/generic/AppButton.vue"
import AppInputPassword from "@/components/generic/input/AppInputPassword.vue"
import AppInputUsername from "@/components/generic/input/AppInputUsername.vue"
import AppHorizontalSeparator from "@/components/generic/AppHorizontalSeparator.vue"

const { t } = useI18n();
const userStore = useUserStore()

onUpdated(() => {
  if(props.credentialError) {
    password.error = props.credentialError
  }
})

const props = defineProps({
  credentialError: {
    type: String,
    required: false,
    default: ''
  }
})

const emit = defineEmits(['onLogin', 'onActive'])

const submitButtonRef = ref(null)

const username = reactive({
  valid: false,
  value: userStore.username || '',
  error: ''
})

const password = reactive({
  valid: false,
  value: '',
  error: ''
})

const formValid = () => {
  if (password.valid && username.valid) {
    return true
  } else {
    const fields = [password, username];
    const errorMessages = ['error.pass.empty', 'error.user.empty'];
    fields.forEach((field, index) => {
      if (field.value === '') {
        field.error = t(errorMessages[index])
      }
    });
  }
}

const handleActiveState = () => {
  password.error = ''
  emit("onActive")
}

const handleEnter = () => {
  submitButtonRef.value.focusButton()
  nextTick( () => {
    handleLogin()
  })
}

const handleLogin = () => {
  if (formValid()) {
    userStore.setPassword(password.value)
    userStore.setUsername(username.value)
    emit('onLogin')
  }
}

</script>

<style scoped>

.tama-login-form-scroll {
  flex: 1 1 auto;
  padding-top: 20vh;
  padding-bottom: 5vh;
  height: calc(20vh - 10vh);
  overflow-y: auto;
}

.tama-login-form-fade {
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.tama-login-send {
  margin-top: min(2vh, 1em);
  margin-inline: auto;
}

</style>