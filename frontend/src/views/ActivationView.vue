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
  <section id="tama-activation-view" class="gl-view">
    <activation-header class="gl-header" :back-operation="false"/>
    <app-tama-area class="gl-tama" :tama-area-height="50" :tama-area-text="$t('views.activation.hdr')" />
    <section class="gl-content-fit tama-activation-content">
      <h2>{{ $t('views.activation.txtHdr', { name: userStore.username || '' }) }}</h2>
      <p v-if="isLoading" v-text-animation="{ text: $t('views.activation.loading'), speed: 100 }"></p>
      <transition name="slide-down" mode="out-in">
        <p v-if="serverResponse === 'success' && !isLoading" class="tama-activation-content-text">
          {{ $t('views.activation.txtSuccess') }}
        </p>
        <p v-else-if="serverResponse === 'failure' && !isLoading" class="tama-activation-content-text">
          {{ $t('views.activation.txtFail') }}
        </p>
      </transition>
    </section>
  <app-button v-if="!isLoading"
              :btn-text="(serverResponse === 'success') ? $t('views.activation.btnSuccess') : $t('views.activation.btnFail')"
              @on-click="handleButtonClick"
              class="gl-button"
  />
  </section>
</template>
<script setup>
import ActivationHeader from '@/components/header/AppDefaultHeader.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'
import AppTamaArea from "@/components/generic/AppTamaArea.vue";
import AppButton from "@/components/generic/AppButton.vue";
import { useUserStore } from "@/stores/userStore.js";
import router from "@/router/index.js";

const userStore = useUserStore()
const route = useRoute()
const serverResponse = ref('')
const isLoading = ref(true)

const activateAccount = async () => {
  const uidb64 = route.params.uidb64
  const token = route.params.token
  try {
    await api.activate(uidb64, token)
    serverResponse.value = 'success'
  } catch (error) {
    serverResponse.value = 'failure';
  } finally {
    setTimeout( () => {
      isLoading.value = false
    }, 5000)
  }
}

const handleButtonClick = () => {
  router.push('/')
}

onMounted(() => {
  activateAccount()
})
</script>

<style scoped>

.tama-activation-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-inline: var(--sgn-mi);
  gap: var(--sgn-mbt)
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