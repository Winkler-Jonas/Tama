<template>
  <div>
    <p>Current Locale: {{ languageStore.locale }}</p>
    <button @click="changeLanguage('en')">English</button>
    <button @click="changeLanguage('de')">German</button>
  </div>
</template>

<script setup>
import { useLanguageStore } from '@/stores/langStore.js'

const languageStore = useLanguageStore()

const changeLanguage = (newLocale) => {
  languageStore.setLocale(newLocale)
}
</script>
