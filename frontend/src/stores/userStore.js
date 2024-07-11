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
import {defineStore} from 'pinia'
import {ref, watchEffect, toRaw} from 'vue'
import {formatDate} from "@/utils/calendarLogic.js";
import websocketService from "@/services/registerWS.js";
import api from "@/services/api.js";

export const useUserStore = defineStore('user', () => {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const welcomeDone = ref(JSON.parse(localStorage.getItem('welcomeDone')) || false)
    const focusTasks = ref({})
    const notification = ref(false)
    const weekStart = ref(true)
    const dailyTasks = ref(JSON.parse(localStorage.getItem('dailyTasks')) || {});
    const dailySelected = ref(0)
    const userFocus = ref(localStorage.getItem('userFocus') || '')

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
        const serializedData = JSON.stringify(welcomeDone.value);
        localStorage.setItem('welcomeDone', serializedData);
    }

    function setNewFocusTask(taskValue) {
        focusTasks.value[taskValue.key] = taskValue.value
    }

    async function setUserFocus(focus) {
        try {
            await api.patch(`/users/me/`, {focus: focus})
            userFocus.value = focus
            localStorage.setItem('userFocus', focus);
        } catch (error) {
            // no time
        }
    }

    function getUserFocus() {
        return (!(this.userFocus === '' || !this.userFocus))
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
        setUserFocus,
        getUserFocus,
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
