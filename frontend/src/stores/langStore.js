import { ref } from 'vue'
import { defineStore } from 'pinia'
import { emitter } from '@/eventEmitter.js'

export const useLanguageStore = defineStore('language', () => {
    const locale = ref(localStorage.getItem('userLanguage') || 'en')

    const setLocale = (newLocale) => {
        locale.value = newLocale
        localStorage.setItem('userLanguage', newLocale)
        emitter.emit('localeChanged', newLocale)
    }

    return {
        locale,
        setLocale
    }
})
