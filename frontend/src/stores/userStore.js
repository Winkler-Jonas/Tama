import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const welcomeDone = ref(false)
    const focusTasks = ref({})
    const notification = ref(false)
    const weekStart = ref(true)

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

    function setNewFocusTask(taskValue) {
        focusTasks.value[taskValue.key] = taskValue.value
    }

    function getTaskFocus(task) {
        return focusTasks.value[task] ? focusTasks.value[task] : 0
    }

    function removeFocusTask(task) {
        if (focusTasks.value.hasOwnProperty(task)) {
            delete focusTasks.value[task]
        }
    }

    function setNotification(value) {
        notification.value = value
    }

    function setWeekStart(value) {
        weekStart.value = value
    }

    function clearUserInfo() {
        email.value = ''
        username.value = ''
        password.value = ''
        welcomeDone.value = false
        focusTasks.value = {}
    }

    return {
        email,
        username,
        password,
        welcomeDone,
        focusTasks,
        notification,
        weekStart,
        setEmail,
        setUsername,
        setPassword,
        setWelcomeDone,
        setNewFocusTask,
        getTaskFocus,
        removeFocusTask,
        setWeekStart,
        setNotification,
        clearUserInfo
    }
}, {
    persist: {
        enabled: true,
    }
})
