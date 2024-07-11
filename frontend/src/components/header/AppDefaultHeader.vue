/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/
<template>
  <div class="tama-signup-header-container">
    <app-back-buttton v-if="backOperation" :is-clickable="btnClickable" @on-click="handleClick" />
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
    required: false,
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