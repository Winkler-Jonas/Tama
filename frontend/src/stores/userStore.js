import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const welcomeDone = ref(false)

    function setEmail(newEmail) {
        email.value = newEmail
    }

    function setUsername(newUsername) {
        username.value = newUsername
    }

    function setPassword(newPassword) {
        password.value = newPassword
    }

    function setWelcomeDone(value) {
        welcomeDone.value = value
    }

    function clearUserInfo() {
        email.value = ''
        username.value = ''
        password.value = ''
        welcomeDone.value = false
    }

    return {
        email,
        username,
        password,
        welcomeDone,
        setEmail,
        setUsername,
        setPassword,
        setWelcomeDone,
        clearUserInfo
    }
}, {
    persist: {
        enabled: true,
    }
})
