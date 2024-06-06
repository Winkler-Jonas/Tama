<template>
  <section id="tama-welcome-view">
    <welcome-header class="tama-welcome-header-grid" :btn-clickable="backBtn" @on-back-click="handleBackBtn"/>
    <app-tama-area class="tama-tama-area-grid" :tama-area-text="$t('views.welcome.greet')"
                   :tama-area-height="tamaHeight"/>

    <transition :name="transitionName" mode="out-in">
      <app-vertical-slider v-if="initialScreen"
                             class="tama-welcome-content-grid"
                             :container-height="70"
                             :bounce-top-target="20"
                             :bounce-bot-target="1"
                             :bounce-bot-threshold="1"
                             :bounce-top-threshold="10"
      >
        <template #content>
          <div key="welcome" class="tama-welcome-view-txt">
            <span v-text-animation="{ text: $t('views.welcome.txt'), speed: 100 }"></span>
          </div>
        </template>
      </app-vertical-slider>
      <div v-else key="email" class="tama-welcome-view-email">
        <h2>{{ $t('views.welcome.email.hdr') }}</h2>
        <p>{{ $t('views.welcome.email.info') }}</p>
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
        class="tama-welcome-view-button"
        :btn-text="$t('views.welcome.proceed')"
        @on-click="handleInitScreenButton"/>
    <app-button
        v-else
        class="tama-welcome-view-button"
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
import AppHorizontalSlider from "@/components/generic/AppVerticalSlider.vue";
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

const tamaHeight = ref(45)
const transitionName = computed(() => initialScreen.value ? 'slide-down' : 'slide-down')

const handleInitScreenButton = () => {
  backBtn.value = true
  initialScreen.value = false
}

const handleBackBtn = () => {
  backBtn.value = false
  initialScreen.value = true
}


/**
 * Form logic
 */
const formValid = () => {
  if (!email.valid) {
    return false
  }
  if (!email.value) {
    email.error = t('error.email.empty')
    return false
  }
  return true
}

const handleEnter = () => {
  // Focus button (forms send new data on blur)
  inputFieldRef.value.blurInput()
  submitFormButton.value.focusButton()
  // make sure data arrived and call register
  nextTick(() => {
    handleEmailButton()
  })
}
const handleEmailButton = () => {
  if (formValid()) {
    userStore.setWelcomeDone(true)
    router.push(mailTaken.value ? '/login' : '/sign-up')
  }
};
</script>

<style scoped>
#tama-welcome-view {
  height: 100%;
  width: 100%;

  display: grid;
  grid-template-rows: [header-start] min-content [header-end tama-start] min-content [tama-end content-start] auto [content-end button-row] min-content;
  grid-template-columns: 1fr;
}

.tama-welcome-header-grid {
  grid-column: 1 / 2;
  grid-row: header-start / header-end;
  z-index: 3;
  align-self: end;
}

.tama-tama-area-grid {
  grid-column: 1 / -1;
  grid-row: header-start / tama-end;

  z-index: 2;
}

.tama-welcome-content-grid {
  grid-column: 1 / -1;
  grid-row: tama-start / content-end;
  z-index: 1;
  align-self: end;
  justify-self: center;

  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tama-welcome-view-txt {
  position: relative;
  flex: 1;
  text-align: center;
  font-size: var(--wlc-txt-sz);

  margin-inline: var(--sgn-mi);
}

.tama-welcome-view-email {
  grid-column: 1 / -1;
  grid-row: content-start / content-end;
  align-self: end;

  position: relative;
  flex: 1;
  height: 100%;
  margin-inline: var(--sgn-mi);

  display: flex;
  flex-direction: column;

}

.tama-welcome-view-email h2 {
  text-align: center;
  padding: max(3vh, 2rem) 0;
}

.tama-welcome-view-email-field {
  padding: min(3vw, 3vh, 4vw) 0;
}

.tama-welcome-view-button {
  z-index: 1;
  grid-row: button-row / -1;
  grid-column: 1 / -1;
  justify-self: center;
  margin-bottom: var(--sgn-mbt);
}

/* For the content sliding down from the top */
.slide-down-enter-active, .slide-down-leave-active {
  transition: transform 0.5s ease-out;
}

.slide-down-enter-from, .slide-down-leave-to {
  transform: translateY(-100%); /* Starts from above the view */
}

.slide-down-enter-to, .slide-down-leave-from {
  transform: translateY(0); /* Ends at the original position */
}

/* For the content sliding up from the bottom */
.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.5s ease-out;
}

.slide-up-enter-from, .slide-up-leave-to {
  transform: translateY(100%); /* Starts from below the view */
}

.slide-up-enter-to, .slide-up-leave-from {
  transform: translateY(0); /* Ends at the original position */
}


</style>