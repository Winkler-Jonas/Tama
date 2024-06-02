<template>
  <div class="tama-signup-header-container">
    <div v-if="backOperation" class="tama-signup-header-container-icon"
         :class="{ 'tama-signup-header-container-icon-active': btnClickable }"
         @click="handleClick"
    >
      <i :tabindex="0" class="ri-arrow-left-line "></i>
    </div>
    <app-context-menu class="tama-default-header-context-menu" :menu-items="menuItems" />
  </div>
</template>

<script setup>
import {computed} from "vue"
import {useI18n} from "vue-i18n"
import {useLanguageStore} from "@/stores/langStore.js"
import AppContextMenu from "@/components/generic/AppContextMenu.vue"

const languageStore = useLanguageStore()
const { t, locale, messages } = useI18n();

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
  box-shadow: inset 0 0 0 2px #FFA976;
}

.tama-default-header-context-menu {
  margin-left: auto;
}

</style>