<template>
  <section id="tama-welcome-view">
    <welcome-header class="tama-welcome-header-grid" :btn-clickable="backBtn" @on-back-click="handleBackBtn"/>
    <div class="tama-welcome-content-grid">
      <app-rounded-top-pet :content-height="40" :header-txt="$t('views.welcome.greet') " />
      <section v-if="initialScreen" id="tama-welcome-view-bottom-one">
        <p v-text-animation="{text: $t('views.welcome.txt'), speed: 100 }" class="tama-welcome-view-txt"></p>
        <app-button tabindex="1" class="tama-welcome-view-button" :btn-text="$t('views.welcome.proceed')" @on-click="handleInitScreenButton"/>
      </section>
      <section v-else id="tama-welcome-view-bottom-second">
        <h2>{{ $t('views.welcome.email.hdr') }}</h2>
        <p>{{ $t('views.welcome.email.info') }}</p>
        <form @keydown.enter.stop.prevent="handleEnter">
          <app-input-email
              ref="inputFieldRef"
              :email-label="$t('views.welcome.email.label')"
              :extern-error="email.error"
              :default-value="email.value"
              :check-taken="true"
              :validate-taken="false"
              :start-focused="true"
              @on-is-taken="(isTaken) => mailTaken = isTaken"
              @on-active="() => email.error = ''"
              @on-validated="(valid) => email.valid = valid"
              @on-new-input="(data) => email.value = data"
          />
        </form>
        <app-button
            class="tama-welcome-view-button"
            :btn-text="$t('views.welcome.email.btn')"
            @on-click="handleEmailButton"
            ref="submitFormButton"
        />
      </section>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from '@/stores/userStore'
import {nextTick, reactive, ref} from "vue"
import AppRoundedTopPet from "@/components/generic/AppRoundedTopPet.vue";
import AppButton from "@/components/generic/AppButton.vue";
import AppInputEmail from "@/components/generic/input/AppInputEmail.vue";
import {useI18n} from "vue-i18n";
import WelcomeHeader from "@/components/header/AppDefaultHeader.vue";

const userStore = useUserStore()
const router = useRouter()
const { t } = useI18n();

const initialScreen = ref(true)
const backBtn = ref(false)
const submitFormButton = ref(null)
const mailTaken = ref(false)
const email = reactive({
  valid: false,
  value: userStore.email || '',
  error: '',
})


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
  if (email.valid) {
    return true
  } else {
    email.error = t('error.email.empty')
  }
}

const handleEnter = () => {
  // Focus button (forms send new data on blur)
  submitFormButton.value.focusButton()
  // make sure data arrived and call register
  nextTick(() => {
    handleEmailButton()
  })
}
const handleEmailButton = () => {
  if (formValid()) {
    userStore.setWelcomeDone(true)
    router.push(mailTaken.value ? '/sign-up' : '/login')
  }
};

</script>

<style scoped>
#tama-welcome-view {
  height: 100%;
  display: grid;
  grid:
    [context-header]  "context-header" min-content
    [content-start]   "content"        auto;
}

.tama-welcome-header-grid {
  grid-column: 1 / -1;
  grid-row: 1 / 2;
  z-index: 2;
  align-self: start;
}

.tama-welcome-content-grid {
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  z-index: 1;

  display: flex;
  flex-direction: column;
}

#tama-welcome-view-bottom-one,
#tama-welcome-view-bottom-second {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2em;
  margin-inline: var(--sgn-mi)
}

.tama-welcome-view-txt {
  text-align: center;
  font-size: var(--wlc-txt-sz);
}

.tama-welcome-view-button {
  margin-top: auto;
  margin-bottom: var(--sgn-mbt);
}

#tama-welcome-view-bottom-second p {
  text-align: center;
}
#tama-welcome-view-bottom-second form {
  width: 100%;
}
</style>