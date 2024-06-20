<template>
  <section id="tama-settings-view" :style="`padding-top: ${$route.meta.tama}vh`">
    <tama-settings-dropdown
        :dropdown-label="$t('views.settings.language')"
        dropdown-icon="language"
        collapse-direction="down"
        :dropdown-items="langValues"
        @on-input-clicked="activeMenu = 1"
        :external-collapse="activeMenu === 1"
        :dropdown-default="langValues.findIndex(obj => obj.key === languageStore.locale)"
    />
    <tama-settings-dropdown
        :dropdown-label="$t('views.settings.weekStart.label')"
        dropdown-icon="week"
        collapse-direction="down"
        :dropdown-items="weekStartValues"
        @on-input-clicked="activeMenu = 2"
        :external-collapse="activeMenu === 2"
        :dropdown-default="weekStartValues.findIndex(obj => obj.value === (userStore.weekStart ? $t('views.settings.weekStart.monday') : $t('views.settings.weekStart.sunday')))"
    />
    <tama-settings-dropdown
        :dropdown-label="$t('views.settings.notification.label')"
        dropdown-icon="notification"
        :dropdown-items="notificationValues"
        @on-input-clicked="activeMenu = 3"
        :external-collapse="activeMenu === 3"
        :dropdown-default="notificationValues.findIndex(obj => obj.value === (userStore.notification ? $t('views.settings.notification.on') : $t('views.settings.notification.off')))"
    />
    <tama-settings-button
        button-icon="feedback"
        :button-label="$t('views.settings.feedback.label')"
        :button-sub-label="$t('views.settings.feedback.subLabel')"
        @on-click="handleFeedbackClicked"
    />
    <tama-settings-button
        button-icon="deleteUser"
        :button-label="$t('views.settings.user.label')"
        :button-sub-label="$t('views.settings.user.subLabel')"
        @on-click="handleUserDeleteClicked"
    />
    <tama-slide-up :is-visible="showMessageBox" :slide-height="!feedbackActive ? 40 : 50">
      <template #slide-up-content>
        <component
            :is="feedbackOrUser"
            @on-close="handleSlidableClose"
        />
      </template>
    </tama-slide-up>
  </section>
</template>

<script setup>
import TamaSettingsDropdown from "@/components/settings/TamaSettingsDropdown.vue";
import { useI18n } from "vue-i18n";
import { computed, ref } from "vue";
import { useLanguageStore } from "@/stores/langStore.js";
import { useUserStore } from "@/stores/userStore.js";
import TamaSettingsButton from "@/components/settings/TamaSettingsButton.vue";
import TamaSlideUp from "@/components/TamaSlideUp.vue";
import TamaFeedback from "@/components/settings/TamaFeedback.vue";
import TamaDeleteUser from "@/components/settings/TamaDeleteUser.vue";

const { tm } = useI18n()

const userStore = useUserStore()
const languageStore = useLanguageStore()
const contentData = computed(() => tm(''))

const feedbackActive = ref(false)
const showMessageBox = ref(false)
const activeMenu = ref(0)
const langValues = computed(() => createDropdownArgument(contentData.value.lang || {}, changeLanguage))
const weekStartValues = computed(() => createDropdownArgument(Object.fromEntries(Object.entries(contentData.value.views.settings.weekStart || {}).filter(([key, value]) => key !== 'label')), changeWeekStart))
const notificationValues = computed(() => createDropdownArgument(Object.fromEntries(Object.entries(contentData.value.views.settings.notification || {}).filter(([key, value]) => key !== 'label')), changeNotificationSetting))

const slideUps = {
  TamaFeedback,
  TamaDeleteUser
}

const feedbackOrUser = computed(() => {
  if (showMessageBox.value && feedbackActive.value) {
    // Show Feedback
    console.log('feedback -')
    return slideUps.TamaFeedback
  } else if (showMessageBox.value && !feedbackActive.value) {
    // Show Delete User
    console.log('deleteUser -')
    return slideUps.TamaDeleteUser
  }
})


const changeLanguage = (newLocale) => {
  languageStore.setLocale(newLocale)
}

const changeWeekStart = () => {
  userStore.setWeekStart(!userStore.weekStart)
}

const changeNotificationSetting = () => {
  userStore.setNotification(!userStore.notification)
}

const handleFeedbackClicked = () => {
  activeMenu.value = 0
  showMessageBox.value = true
  feedbackActive.value = true
}

const handleUserDeleteClicked = () => {
  activeMenu.value = 0
  showMessageBox.value = true
}

const handleSlidableClose = (value) => {
  if (value) {
    feedbackActive.value = false
  }
  showMessageBox.value = false
}

const createDropdownArgument = (obj, callback) => {
  return Object.entries(obj).map(([key, value]) => ({
    key: key,
    value: value,
    callback: () => callback(key)
  }))
}

</script>

<style scoped>

#tama-settings-view {
  height: 100%;
  margin-inline: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: min(2em, 5vh);

  padding-bottom: min(10vh, 3rem);
}

</style>