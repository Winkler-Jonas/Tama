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
  <p style="margin-top: 3rem;">{{ $t('views.login.notVerified.msg') }}</p>
  <app-input-field
      input-name="newEmail"
      :default-value="userEmail"
      :locked="true"
      :label-name="$t('views.login.notVerified.newMail')"
      :error-msg="errorMail"
  />
  <app-button class="tama-verification-button" :btn-text="!countdown ? $t('views.login.notVerified.resend') : $t('views.login.notVerified.redirect', {num: countdown})" @on-click="handleResend"/>
</template>

<script setup>
import AppInputField from "@/components/generic/input/AppInputField.vue";
import AppButton from "@/components/generic/AppButton.vue";
import { ref } from "vue";
import {useUserStore} from "@/stores/userStore.js"
import {useAuthStore} from '@/stores/auth'
import {useLanguageStore} from "@/stores/langStore.js";


const props = defineProps({
  userEmail: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['mailSent'])

const userStore = useUserStore()
const authStore = useAuthStore()
const languageStore = useLanguageStore()

const countdown = ref(0)
const errorMail = ref('')

function delay(seconds, updateCallback) {
  return new Promise((resolve) => {
    let remainingSeconds = seconds;
    updateCallback(remainingSeconds);

    const interval = setInterval(() => {
      remainingSeconds -= 1;
      updateCallback(remainingSeconds);

      if (remainingSeconds <= 0) {
        clearInterval(interval);
        resolve();
      }
    }, 1000);
  });
}

const waitToRedirect = async () => {
  await delay(3, (remainingSeconds) => {
    countdown.value = remainingSeconds;
  });
  emit('mailSent')
}

const handleResend = async () => {
  try {
    await authStore.resendActivationEmail(userStore.username, languageStore.locale);
    await waitToRedirect()
  } catch (error) {
    // unexpected error
  }
}

defineExpose({
  handleResend
})

</script>

<style scoped>

p {
  text-align: center;
}


.tama-verification-button {
  margin-inline: auto;
  margin-top: auto;
  margin-bottom: var(--sgn-mbt);
}
</style>