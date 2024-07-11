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
  <section id="tama-not-found-view" class="gl-view">
    <not-found-header class="gl-header" :back-operation="false" />
    <app-tama-area class="gl-tama" :tama-area-height="50" :tama-area-text="$t('views.notFound.hdr')"/>
    <section class="tama-not-found-content gl-content-fit">
      <p class="notFound-error-message" v-text-animation="{text: $t('views.notFound.txt'), speed: 100}"></p>
    </section>
    <app-button class="gl-button" :btn-text="$t('views.notFound.btn')" @on-click="backHomeClicked"/>
  </section>
</template>

<script setup>
import NotFoundHeader from '@/components/header/AppDefaultHeader.vue'
import AppTamaArea from "@/components/generic/AppTamaArea.vue";
import AppButton from "@/components/generic/AppButton.vue";
import router from "@/router/index.js";


const backHomeClicked = () => {
  router.push('/')
}

</script>

<style scoped>

.tama-not-found-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.notFound-error-message {
  text-align: center;
}

</style>