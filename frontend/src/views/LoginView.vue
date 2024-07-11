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
  <section id="tama-login-view" class="gl-view">
    <login-header class="gl-header" :btn-clickable="backBtn" @on-back-click="handleBackButton"/>
    <app-tama-area class="gl-tama" :tama-area-text="inputScreen ? $t('views.login.hdr') : $t('views.login.notVerified.hdr')" :tama-area-height="30"/>
    <transition name="slide-down" mode="out-in">
      <section v-if="inputScreen" class="tama-login-content gl-content-underflow">
        <login-form @on-login="login" :credential-error="errorMessage" @on-active="() => errorMessage = ''"/>
      </section>
      <section v-else class="tama-login-content gl-content-fit">
        <login-email-verification ref="emailResendRef" :userEmail="userEmail" @mail-sent="inputScreen = true"/>
      </section>
    </transition>
    <div v-if="inputScreen" class="tama-login-register-link-container">
      <app-horizontal-separator :horizontal-txt="$t('components.horizontalSeparator.or')" />
      <div class="tama-login-register-text">
        <span>{{ $t('views.login.newQ') }}</span>
        <span class="tama-login-register-link"
              @click="router.push('/sign-up')">{{ $t('views.login.newBtn') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useI18n} from "vue-i18n";
import {useUserStore} from "@/stores/userStore.js"
import LoginForm from "@/components/login/LoginForm.vue";
import LoginEmailVerification from "@/components/login/LoginEmailVerification.vue";
import {CredentialError, EmailError, PasswordError, UnexpectedError} from "@/utils/errorHandler.js";
import LoginHeader from "@/components/header/AppDefaultHeader.vue";
import AppTamaArea from "@/components/generic/AppTamaArea.vue";
import AppHorizontalSeparator from "@/components/generic/AppHorizontalSeparator.vue";
import {useTaskStore} from "@/stores/taskStore.js";

const { t } = useI18n();
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()
const taskStore = useTaskStore();

const inputScreen = ref(true)
const emailResendRef = ref(null)

const errorMessage = ref('')
const userEmail = ref('')
const backBtn = ref(false)

const handleBackButton = () => {
  backBtn.value = false
  inputScreen.value = true
}

const login = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(userStore.username, userStore.password);
    await taskStore.initializeStore()
    await router.push('/home');
  }
  catch (error) {
    if (error instanceof (CredentialError || PasswordError)) {
      errorMessage.value = t(error.message)
    } else if (error instanceof EmailError) {
      inputScreen.value = false
      backBtn.value = true
      userEmail.value = error.data
    } else if (error instanceof CredentialError) {
      console.log(error)
      console.log(error.message)

    }else if (error instanceof UnexpectedError) {
      // todo need message-box for server-errors
      console.log('Unexpected Error', error.message)
    } else {
      // something very odd is going on
      console.log(error)
    }
  }
};
</script>

<style scoped>

.tama-login-content {
  margin-inline: var(--sgn-mi);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 1em;
}


.tama-login-register-link-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: var(--sgn-mbt);
}

.tama-login-register-text {
  display: flex;
  justify-content: center;
}

.tama-login-register-link {
  margin-left: 1em;
}

/* Sliding transition on content switch */
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.5s ease-out;
}

.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%);
}

.slide-down-enter-to, .slide-down-leave-from {
  transform: translateY(0);
}

</style>