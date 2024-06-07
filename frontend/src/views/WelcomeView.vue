<template>
  <section id="tama-welcome-view" class="gl-view">
    <welcome-header class="gl-header" :btn-clickable="backBtn" @on-back-click="handleBackBtn"/>
    <app-tama-area class="gl-tama" :tama-area-text="$t('views.welcome.greet')"
                   :tama-area-height="initialScreen ? tamaHeight: 30"/>

    <transition name="slide-down" mode="out-in">
      <app-vertical-slider v-if="initialScreen"
                             class="tama-welcome-view-content gl-content-underflow"
                             :container-height="70"
                             :bounce-top-target="20"
                             :bounce-bot-target="1"
                             :bounce-bot-threshold="1"
                             :bounce-top-threshold="10"
      >
        <template #content>
          <div key="welcome" class="tama-welcome-view-init-txt">
            <span v-text-animation="{ text: $t('views.welcome.txt'), speed: 100 }"></span>
          </div>
        </template>
      </app-vertical-slider>
      <div v-else key="email" class="tama-welcome-view-content gl-content-fit">
        <h2 class="tama-welcome-view-email-header">{{ $t('views.welcome.email.hdr') }}</h2>
        <p class="tama-welcome-view-email-txt">{{ $t('views.welcome.email.info') }}</p>
        <form @keydown.enter.stop.prevent="handleEnter">
          <app-input-email
              class="tama-welcome-view-email-field"
              ref="inputFieldRef"
              :email-label="$t('views.welcome.email.label')"
              :extern-error="email.error"
              :default-value="email.value"
              :check-taken="true"
              :validate-taken="false"
              :start-focused="false"
              @on-is-taken="(isTaken) => mailTaken = isTaken"
              @on-active="() => email.error = ''"
              @on-validated="(valid) => email.valid = valid"
              @on-new-input="(data) => email.value = data"
          />
        </form>
      </div>
    </transition>
    <app-button
        v-if="initialScreen"
        tabindex="1"
        class="gl-button"
        :btn-text="$t('views.welcome.proceed')"
        @on-click="handleInitScreenButton"/>
    <app-button
        v-else
        class="gl-button"
        :btn-text="$t('views.welcome.email.btn')"
        @on-click="handleEmailButton"
        ref="submitFormButton"
    />
  </section>
</template>

<script setup>
import {useI18n} from "vue-i18n";
import {useRouter} from "vue-router";
import {useUserStore} from '@/stores/userStore'
import {computed, nextTick, reactive, ref} from "vue"
import AppButton from "@/components/generic/AppButton.vue";
import AppTamaArea from "@/components/generic/AppTamaArea.vue";
import WelcomeHeader from "@/components/header/AppDefaultHeader.vue";
import AppInputEmail from "@/components/generic/input/AppInputEmail.vue";
import AppVerticalSlider from "@/components/generic/AppVerticalSlider.vue";

const userStore = useUserStore()
const router = useRouter()
const {t} = useI18n();

const initialScreen = ref(true)
const backBtn = ref(false)
const submitFormButton = ref(null)
const inputFieldRef = ref(null)
const mailTaken = ref(false)
const email = reactive({
  valid: false,
  value: userStore.email || '',
  error: '',
})

const tamaHeight = computed(() => initialScreen.value ? 45 : 40)

const handleInitScreenButton = () => {
  /**
   * Function handles the first button.
   * OnClick Text-Screen is replaced by email-form
   *
   */
  backBtn.value = true
  initialScreen.value = false
}

const handleBackBtn = () => {
  /**
   * Function handles back-button logic
   * Back-button is only clickable when user views email-field
   * otherwise disabled / grayed out
   *
   */
  backBtn.value = false
  initialScreen.value = true
}

const formValid = () => {
  /**
   * Function checks if user-input is valid
   *
   * Email-Field has to contain value
   * Email-Field has be validated (done by input)
   *
   */
  if (!email.valid || !email.value) {
    email.error = !email.value ? t('error.email.empty') : ''
    return false
  }
  return true
}

const handleEnter = () => {
  /**
   * Function enables content switch from user-input to button
   *
   * Input-Field is blurred and button focused
   * Wait for input-field to register change and execute buttonClick
   *
   */
  inputFieldRef.value.blurInput()
  submitFormButton.value.focusButton()
  nextTick(() => {
    handleEmailButton()
  })
}

const handleEmailButton = () => {
  /**
   * Function routes to new view if form is valid
   */
  if (formValid()) {
    // todo: Change setWelcomeDone to true if user did initial focus-settings
    userStore.setWelcomeDone(true)
    router.push(mailTaken.value ? '/login' : '/sign-up')
  }
};
</script>

<style scoped>
#tama-welcome-view {
  padding-bottom: var(--sgn-mbt);
}

.tama-welcome-view-content {
  margin-inline: var(--sgn-mi);
  justify-self: stretch;

  display: flex;
  flex-direction: column;
  justify-content: center;
}

/*
 * First View
 */
.tama-welcome-view-init-txt {
  position: relative;
  flex: 1;

  text-align: center;
  font-size: var(--wlc-txt-sz);
}

/*
 * Second View
 */
.tama-welcome-view-email-header {
  text-align: center;
  padding: max(3vh, 2rem) 0;
}

.tama-welcome-view-email-field {
  padding: min(3vw, 3vh, 4vw) 0;
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