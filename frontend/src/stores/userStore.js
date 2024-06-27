import {defineStore} from 'pinia'
import {ref, watchEffect, toRaw} from 'vue'
import {formatDate} from "@/utils/calendarLogic.js";
import websocketService from "@/services/registerWS.js";

export const useUserStore = defineStore('user', () => {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const welcomeDone = ref(false)
    const focusTasks = ref({})
    const notification = ref(false)
    const weekStart = ref(true)
    const dailyTasks = ref(JSON.parse(localStorage.getItem('dailyTasks')) || {});
    const dailySelected = ref(0)
    const userFocus = ref('Studieren')

    function setDailySelected (idx) {
        dailySelected.value = idx
    }

    function addDailies(allDailies) {
        const currentDate = formatDate(new Date())
        if (!dailyTasks.value[currentDate]) {
            dailyTasks.value[currentDate] = allDailies.map(str => ({
                desc: str,
                status: false
            }));
            updateLocalStorage();
        }
    }

    function updateLocalStorage() {
        const rawData = toRaw(dailyTasks.value);
        const simpleData = Object.entries(rawData).reduce((acc, [key, value]) => {
            acc[key] = value.map(item => ({ desc: item.desc, status: item.status }));
            return acc;
        }, {});

        const serializedData = JSON.stringify(simpleData);
        localStorage.setItem('dailyTasks', serializedData);
    }

    watchEffect(updateLocalStorage);

    function removeDailyByDate(date) {
        const formattedDate = formatDate(date);
        if (dailyTasks.value[formattedDate]) {
            delete dailyTasks.value[formattedDate];
            updateLocalStorage();
        }
    }

    function removeDailyByDesc(desc, date) {
        const formattedDate = formatDate(date)
        dailyTasks.value[formattedDate].reduceRight((acc, task, idx) => {
            if (task.desc === desc) dailyTasks.value[formattedDate].splice(idx, 1);
            return acc;
        }, null)
        updateLocalStorage()
    }

    async function getDailies() {
        const todayFormatted = formatDate(new Date());
        if (dailyTasks.value[todayFormatted]) {
            return dailyTasks.value[todayFormatted];
        } else {
            try {
                const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const socketConnected = await websocketService.createSocket('daily', '/ws/getDaily/');
                websocketService.setHandler('daily', {
                    onMessage: (data) => {
                        const dataArray = Object.values(data)
                        if (dataArray.every(item => item.trim() === '')) {
                            console.log('Error parsing daily-response')
                        } else {
                            addDailies(dataArray)
                        }
                        return getDailies()
                    },
                    onError: (data) => {
                        console.log('Error creating dailies')
                    },
                })
                if (socketConnected) {
                    websocketService.send('daily', { focus: userFocus.value, user_time_zone: timeZone });
                }
            } catch (error) {
                console.error('Failed to connect:', error);
            }

        }
    }

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
        dailySelected,
        notification,
        welcomeDone,
        focusTasks,
        dailyTasks,
        userFocus,
        weekStart,
        username,
        password,
        email,
        setEmail,
        getDailies,
        setPassword,
        setUsername,
        setWeekStart,
        getTaskFocus,
        clearUserInfo,
        setWelcomeDone,
        setNotification,
        removeFocusTask,
        setNewFocusTask,
        setDailySelected,
        removeDailyByDesc
    }
}, {
    persist: {
        enabled: true,
    }
})
