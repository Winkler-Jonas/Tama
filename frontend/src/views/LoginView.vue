<template>
  <section id="tama-login-view">
    <app-default-header class="tama-login-header-grid" :btn-clickable="false" :back-operation="false" />
    <div class="tama-login-content-grid">
      <app-rounded-top-pet
          :content-height="30"
          :header-txt="inputScreen ? $t('views.login.hdr') : $t('views.login.notVerified.hdr')"
      />
      <section v-if="inputScreen" id="tama-login-view-bottom-first">
        <login-form @on-login="login" :credential-error="errorMessage" />
        <div style="text-align: center">
          <span>{{ $t('views.login.newQ') }}</span>
          <span class="tama-login-register-link"
                @click="router.push('/sign-up')">{{ $t('views.login.newBtn') }}</span>
        </div>
      </section>
      <section v-else id="tama-login-view-bottom-second">
        <login-email-verification  :userEmail="userEmail" @mail-sent="inputScreen = true"/>
      </section>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import {useRouter} from 'vue-router'
import {useAuthStore} from '@/stores/auth'
import {useI18n} from "vue-i18n";
import AppRoundedTopPet from "@/components/generic/AppRoundedTopPet.vue";
import {useUserStore} from "@/stores/userStore.js"
import LoginForm from "@/components/login/LoginForm.vue";
import LoginEmailVerification from "@/components/login/LoginEmailVerification.vue";
import {CredentialError, EmailError, PasswordError, UnexpectedError} from "@/utils/errorHandler.js";
import AppDefaultHeader from "@/components/header/AppDefaultHeader.vue";


const { t } = useI18n();
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const inputScreen = ref(true)


const errorMessage = ref('')
const userEmail = ref('')


const login = async () => {
  errorMessage.value = ''
  try {
    await authStore.login(userStore.username, userStore.password);
    await router.push('/profile');
  }
  catch (error) {
    if (error instanceof (CredentialError || PasswordError)) {
      errorMessage.value = t(error.message)
    } else if (error instanceof EmailError) {
      inputScreen.value = false
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

#tama-login-view {
  height: 100%;
  display: grid;
  grid:
    [context-header]  "context-header" min-content
    [content-start]   "content"        auto;
}

.tama-login-header-grid {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  z-index: 2;
  align-self: start;
}

.tama-login-content-grid {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 1;

  display: flex;
  flex-direction: column;
}

#tama-login-view-bottom-first,
#tama-login-view-bottom-second {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2em;
  margin-inline: var(--sgn-mi)
}

.tama-login-register-link {
  margin-left: 1em;
}

</style>