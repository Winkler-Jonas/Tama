<template>
  <section id="tama-register-view" class="gl-view">
    <welcome-header class="gl-header" :back-operation="false"/>
    <app-tama-area class="gl-tama" :tama-area-text="inputScreen ? $t('views.register.hdr') : $t('view.register.hdrSend')" :tama-area-height="35"/>
    <transition name="slide-down" mode="out-in">
      <section v-if="!inputScreen" class="tama-register-view-content gl-content-fit">

          <form @keydown.enter.stop.prevent="handleEnter" class="tama-register-view-content-scroll tama-register-view-content-fade no-scrollbar">
            <app-input-email
                :email-label="$t('views.register.inputLabel.mail')"
                :extern-error="email.error"
                :default-value="email.value"
                :check-taken="true"
                @on-active="() => email.error = ''"
                @on-validated="(valid) => email.valid = valid"
                @on-new-input="(data) => email.value = data"
                class="tama-register-input-field-sep"
            />
            <app-input-username
                :username-label="$t('views.register.inputLabel.usr')"
                :extern-error="username.error"
                :default-value="username.value"
                :check-taken="true"
                @on-active="() => username.error = ''"
                @on-validated="(valid) => username.valid = valid"
                @on-new-input="(data) => username.value = data"
                class="tama-register-input-field-sep"
            />
            <app-input-password
                :password-label="$t('views.register.inputLabel.pwd')"
                :extern-error="pwdOne.error"
                :user-name="''"
                @on-active="() => pwdOne.error = ''"
                @on-validated="(valid) => pwdOne.valid = valid"
                @on-new-input="(data) => pwdOne.value = data"
                class="tama-register-input-field-sep"
            />
            <app-input-password
                :password-label="$t('views.register.inputLabel.pwdConf')"
                :extern-error="pwdTwo.error"
                :second-password="pwdOne.value"
                placeholder-str="placeholder.passRepeat"
                :user-name="''"
                @on-active="() => pwdTwo.error = ''"
                @on-validated="(valid) => pwdTwo.valid = valid"
                @on-new-input="(data) => pwdTwo.value = data"
                class="tama-register-input-field-sep"
            />
          </form>

      </section>
      <section v-else class="tama-register-view-content gl-content-underflow">
        <p v-text-animation="{ text: $t('views.register.mailSent' ), speed: 70 }" class="tama-register-view-bottom-second-txt"></p>
      </section>
    </transition>
    <div v-if="!inputScreen" class="sticky-button">
      <app-button  :btn-text="$t('views.register.btnEnter')"
                  @on-click="handleRegister"
                  ref="submitFormRef"
      />
    </div>
    <app-button
        v-else
        v-delay="{
                  seconds: 10,
                  onUpdate: (remaining) => countdown = remaining,
                  onComplete: () => router.push('/login')
            }"
        class="gl-button"
        :btn-text="$t('views.register.redirect', {num: countdown})"
    />
  </section>

</template>

<script setup>
import { useI18n } from "vue-i18n"
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {useUserStore} from "@/stores/userStore.js"
import {ref, computed, nextTick, reactive} from 'vue'
import {useLanguageStore} from "@/stores/langStore.js"
import AppButton from "@/components/generic/AppButton.vue";
import AppTamaArea from "@/components/generic/AppTamaArea.vue";
import AppInputEmail from "@/components/generic/input/AppInputEmail.vue"
import AppInputPassword from "@/components/generic/input/AppInputPassword.vue"
import AppInputUsername from "@/components/generic/input/AppInputUsername.vue"
import {EmailError, PasswordError, UnexpectedError, UserError} from "@/utils/errorHandler.js"
import WelcomeHeader from '@/components/header/AppDefaultHeader.vue'
const { t, locale, messages } = useI18n();
const languageStore = useLanguageStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const pwdOne = reactive({
  valid: false,
  value: '',
  error: ''
})

const pwdTwo = reactive({
  valid: false,
  value: '',
  error: ''
})

const email = reactive({
  valid: false,
  value: userStore.email || '',
  error: '',
})

const username = reactive({
  valid: false,
  value: userStore.username || '',
  error: ''
})

const inputScreen = ref(true)
const countdown = ref(0)
const submitFormRef = ref(null)
const emailSent = ref(false)

const formValid = () => {
  if (pwdOne.valid && pwdTwo.valid && email.valid && username.valid) {
    console.log('form valid...?')
    console.log('pwd1: ', pwdOne.value, "pwd2:", pwdTwo.value)
    return true
  } else {
    const fields = [pwdOne, pwdTwo, email, username];
    const errorMessages = ['error.pass.empty', 'error.pass.empty', 'error.email.empty', 'error.user.empty'];
    fields.forEach((field, index) => {
      if (field.value === '') {
        field.error = t(errorMessages[index])
      }
    });
  }
}

const handleEnter = () => {
  // Focus button (forms send new data on blur)
  submitFormRef.value.focusButton()
  // make sure data arrived and call register
  nextTick(() => {
    handleRegister()
  })
}

/* API-Calls */
const handleRegister = async () => {
  if (formValid()) {
    try {
      await authStore.register(username.value, email.value, pwdOne.value, languageStore.locale)
      inputScreen.value = false
      userStore.setEmail(email.value)
      userStore.setUsername(username.value)
    } catch (error) {
      if (error instanceof PasswordError) {
        pwdTwo.error = t(error.message)
      } else if (error instanceof EmailError) {
        email.error = t(error.message)
      } else if (error instanceof UserError) {
        username.error = t(error.message)
      }
      else if (error instanceof UnexpectedError) {
        // todo need display box to show system-errors (like registration not successful server error)
        console.log('Unexpected Error', error.message)
      } else {
        // Something very odd is going on
        console.log(error)
      }
    }
  }
}

/*
* Context Menu
*/
const changeLanguage = (newLocale) => {
  languageStore.setLocale(newLocale)
}

const allExceptCurrentLang = computed(() => {
  return Object.entries(messages.value[locale.value].lang)
      .filter(([key, val]) => key !== locale.value)
      .map(([key]) => ({
        [t(`lang.${key}`)]: () => changeLanguage(key)
      }));
})

const menuItems = computed(() => {
  return [
    { 'Help': () => console.log('Help clicked') },
    ...allExceptCurrentLang.value
  ]
})

</script>

<style scoped>

.tama-register-view-content {
  margin-inline: var(--sgn-mi);
  justify-self: stretch;
  position: relative;

  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 25vh;
  height: calc(100vh - 100px);
  padding-bottom: 100px;
}

.tama-register-view-content-scroll {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 1rem;
}

.tama-register-view-content-fade {
  -webkit-mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 80%, transparent 100%);
}

.tama-register-view-bottom-second-txt {
  text-align: center;
  font-size: var(--wlc-txt-sz);
}
</style>
