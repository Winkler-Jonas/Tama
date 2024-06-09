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