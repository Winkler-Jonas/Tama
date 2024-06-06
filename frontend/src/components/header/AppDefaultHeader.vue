<template>
  <div class="tama-signup-header-container">
    <app-back-buttton :is-clickable="btnClickable" @on-click="handleClick" />
    <app-context-menu class="tama-default-header-context-menu" :menu-items="menuItems" />
  </div>
</template>

<script setup>
import {computed, ref} from "vue"
import {useI18n} from "vue-i18n"
import {useLanguageStore} from "@/stores/langStore.js"
import AppContextMenu from "@/components/generic/AppContextMenu.vue"
import AppBackButtton from "@/components/generic/AppBackButtton.vue";

const languageStore = useLanguageStore()
const { t, locale, messages } = useI18n();
const backButton = ref(null)

const props = defineProps({
  btnClickable: {
    type: Boolean,
    required: true,
  },
  backOperation: {
    type: Boolean,
    required: false,
    default: true,
  }
})

const emit = defineEmits(['onBackClick'])

const handleClick = () => {
  if (props.btnClickable) {
    emit("onBackClick")
  }
}

/**
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

.tama-signup-header-container {
  background-color: var(--h-bg);
  font-size: var(--h-icon-sz);
  padding: var(--h-p-rl);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tama-signup-header-container-icon {
  color: #777777;
  padding: 5px;
}

.tama-signup-header-container-icon-active {
  color: black;
}
.tama-signup-header-container-icon i:focus,
.tama-signup-header-container-icon i:active {
  outline: none;
  border: none;
}

.tama-default-header-context-menu {
  margin-left: auto;
}

</style>