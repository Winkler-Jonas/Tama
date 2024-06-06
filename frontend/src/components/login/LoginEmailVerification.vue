<template>
  <p>{{ $t('views.login.notVerified.msg') }}</p>
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
  // todo instead of redirect we need to tell the parent we are done
  await emit('mailSent')
}

const handleResend = async () => {
  try {
    await authStore.resendActivationEmail(userStore.username, languageStore.locale);
    await waitToRedirect()
  } catch (error) {
    // unexpected error
  }
}

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