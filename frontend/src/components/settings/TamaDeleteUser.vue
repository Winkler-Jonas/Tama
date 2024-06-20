<template>
  <div class="tama-delete-user-view">
    <h2 class="tama-delete-user-header">
      {{ $t('views.settings.user.hdr') }}
    </h2>
    <p class="tama-delete-text">{{ $t('views.settings.user.reAsk') }}</p>
    <p class="tama-delete-error" v-if="serverError">
      {{ $t('views.settings.user.error') }}
    </p>
    <div class="tama-delete-user-buttons">
      <i @click="handleExitClicked" class="ri-close-line tama-delete-close"></i>
      <i @click="handleUserDelete" class="ri-delete-bin-line tama-delete-user"></i>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";
import { ref } from "vue";

const router = useRouter()
const authStore = useAuthStore()

const emit = defineEmits(['onClose'])

const serverError = ref(false)

const handleExitClicked = () => {
  emit("onClose")
}

const handleUserDelete = async () => {
  try {
    await authStore.deleteUser()
    await router.push('/welcome')
  } catch (error) {
    serverError.value = true
  }
}

</script>

<style scoped>

.tama-delete-user-view {
  height: 100%;
  width: 100%;
  padding: 1em var(--sgn-mi);

  display: flex;
  flex-direction: column;
  gap: 1em;
}

.tama-delete-user-header,
.tama-delete-text {
  text-align: center;
}

.tama-delete-error {
  margin-top: auto;
  padding: 0.4em;
  border: 1px solid var(--tama-color-orange);
  box-shadow: rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset;
}

.tama-delete-user-buttons {
  margin-top: auto;

  display: flex;
  justify-content: space-between;
}

.tama-delete-close,
.tama-delete-user {
  height: 50px;
  width: 50px;
  border-radius: 50%;

  font-size: calc(var(--tama-h1-size));
  font-weight: bold;
  color: white;

  display: flex;
  justify-content: center;
  align-items: center;
}

.tama-delete-user {
  background-color: var(--tama-color-orange);
  font-weight: normal;
}

.tama-delete-close {
  background-color: var(--tama-color-green);
}

</style>