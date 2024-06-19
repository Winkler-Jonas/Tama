<template>
  <section id="tama-settings-view">
    <tama-settings-dropdown
        :dropdown-label="$t('views.settings.language')"
        dropdown-icon="language"
        :dropdown-items="langValues"
        :dropdown-default="langValues.findIndex(obj => obj.key === languageStore.locale)"
    />
   <tama-settings-dropdown
        :dropdown-label="$t('views.settings.weekStart.label')"
        dropdown-icon="week"
        :dropdown-items="weekStartValues"
        :dropdown-default="weekStartValues.findIndex(obj => obj.value === (userStore.weekStart ? $t('views.settings.weekStart.monday') : $t('views.settings.weekStart.sunday')))"
    />
    <tama-settings-dropdown
        :dropdown-label="$t('views.settings.notification.label')"
        dropdown-icon="notification"
        :dropdown-items="notificationValues"
        :dropdown-default="notificationValues.findIndex(obj => obj.value === (userStore.notification ? $t('views.settings.notification.on') : $t('views.settings.notification.off')))"
    />
  </section>
</template>

<script setup>
import TamaSettingsDropdown from "@/components/settings/TamaSettingsDropdown.vue";
import { useI18n } from "vue-i18n";
import {computed, onBeforeMount, onMounted} from "vue";
import { useLanguageStore } from "@/stores/langStore.js";
import {useUserStore} from "@/stores/userStore.js";

const { tm, t } = useI18n()

const userStore = useUserStore()
const languageStore = useLanguageStore()
const contentData = computed(() => tm(''))

const langValues = computed(() => createDropdownArgument(contentData.value.lang || {}, changeLanguage))
const weekStartValues = computed(() => createDropdownArgument(Object.fromEntries(Object.entries(contentData.value.views.settings.weekStart || {}).filter(([key, value]) => key !== 'label')), changeWeekStart))
const notificationValues = computed(() => createDropdownArgument(Object.fromEntries(Object.entries(contentData.value.views.settings.notification || {}).filter(([key, value]) => key !== 'label')), changeNotificationSetting))

const changeLanguage = (newLocale) => {
  languageStore.setLocale(newLocale)
}

const changeWeekStart = () => {
  userStore.setWeekStart(!userStore.weekStart)
}

const changeNotificationSetting = () => {
  userStore.setNotification(!userStore.notification)
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
}

</style>