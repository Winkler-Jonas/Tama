<template>
  <section id="tama-register-view">
    <app-default-header class="tama-register-header-grid" :btn-clickable="false" :back-operation="false" />
    <div class="tama-register-content-grid">
      <app-tama-area :tama-area-text="$t('views.register.hdr')"
                     :tama-area-height="25"/>
      <section v-if="inputScreen" id="tama-register-view-bottom-first">
        <form @keydown.enter.stop.prevent="handleEnter">
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
        <app-button :btn-text="$t('views.register.btnEnter')"
                    class="tama-register-view-bottom-button"
                    @on-click="handleRegister"
                    ref="submitFormRef"
        />
      </section>
      <section v-else id="tama-register-view-bottom-second">
        <p class="tama-register-view-bottom-second-txt">
          {{ $t('views.register.mailSent' )}}
        </p>
        <app-button
            v-delay="{
                  seconds: 10,
                  onUpdate: (remaining) => countdown = remaining,
                  onComplete: () => router.push('/login')
            }"
            class="tama-register-view-bottom-button"
            :btn-text="$t('views.register.redirect', {num: countdown})"
        />
      </section>
    </div>
  </section>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import {ref, computed, nextTick, reactive} from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {useUserStore} from "@/stores/userStore.js"
import {useLanguageStore} from "@/stores/langStore.js"
import AppButton from "@/components/generic/AppButton.vue";
import AppInputEmail from "@/components/generic/input/AppInputEmail.vue"
import {EmailError, PasswordError, UnexpectedError, UserError} from "@/utils/errorHandler.js"
import AppInputPassword from "@/components/generic/input/AppInputPassword.vue"
import AppInputUsername from "@/components/generic/input/AppInputUsername.vue"
import AppDefaultHeader from "@/components/header/AppDefaultHeader.vue";
import AppTamaArea from "@/components/generic/AppTamaArea.vue";

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

#tama-register-view {
  height: 100%;
  display: grid;
  grid:
    [context-header]  "context-header" min-content
    [content-start]   "content"        auto;
}

.tama-register-header-grid {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  z-index: 2;
  align-self: start;
}

.tama-register-content-grid {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 1;

  display: flex;
  flex-direction: column;
}

#tama-register-view-bottom-first,
#tama-register-view-bottom-second {
  flex: 1;
  display: flex;
  flex-direction: column;

  margin-inline: var(--sgn-mi)
}

.tama-register-view-bottom-button {
  margin-top: auto;
  align-self: center;
  margin-bottom: var(--sgn-mbt);
}

.tama-register-view-bottom-second-txt {
  text-align: center;
  font-size: var(--wlc-txt-sz);
}



</style>
