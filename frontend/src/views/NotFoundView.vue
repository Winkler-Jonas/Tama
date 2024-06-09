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