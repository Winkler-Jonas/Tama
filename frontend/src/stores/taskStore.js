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
import { defineStore } from 'pinia';
import api from '@/services/api';
import {formatToDateString, formatToDjangoDate} from "@/utils/calendarLogic.js";
import { toRaw } from "vue";
import localForage from 'localforage';
import { useUserStore } from '@/stores/userStore';

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        getTasksByDate: (state) => (date) => {
            const targetDate = formatToDjangoDate(date)
            return state.tasks.filter(task => Object.keys(task.task_instances).includes(targetDate));
        },
        getTasksOfMonth: (state) => (dateStr) => {
            try {
                const filteredTasks = state.tasks.filter(task =>
                    Object.keys(task.task_instances).some(dateKey =>
                        dateKey.substring(0, 7) === dateStr
                    )
                );

                // Then sort these tasks by the earliest date within the specified month in their task_instances
                return filteredTasks.sort((taskA, taskB) => {
                    // Find the earliest date in the specified month for taskA
                    const datesA = Object.keys(taskA.task_instances)
                        .filter(date => date.substring(0, 7) === dateStr)
                        .sort();
                    const earliestDateA = datesA.length > 0 ? new Date(datesA[0]) : new Date();

                    // Find the earliest date in the specified month for taskB
                    const datesB = Object.keys(taskB.task_instances)
                        .filter(date => date.substring(0, 7) === dateStr)
                        .sort();
                    const earliestDateB = datesB.length > 0 ? new Date(datesB[0]) : new Date();

                    // Compare the two dates to determine order
                    return earliestDateA - earliestDateB;
                });
            } catch (error) {
                console.log(error)
            }

        }
    },

    actions: {
        async initializeStore() {
            const userStore = useUserStore();
            const userId = userStore.username;

            localForage.config({
                name: 'Tamado',
                storeName: `tasks-${userId}`
            });

            await this.loadTasksFromIndexedDB();
        },
        async loadTasksFromIndexedDB() {
            const storedTasks = await localForage.getItem('tasks') || [];
            this.tasks = storedTasks.map(task => ({
                ...task,
                invited_users: safeParse(task.invited_users),
                task_instances: safeParse(task.task_instances)
            }));

            function safeParse(json) {
                try {
                    return JSON.parse(json);
                } catch (e) {
                    return {};
                }
            }
        },
        async saveTasksToIndexedDB() {
            const simplifiedTasks = this.tasks.map(task => ({
                ...task,
                invited_users: task.invited_users.map(user => user.toString()),
                task_instances: JSON.stringify(task.task_instances)
            }));

            try {
                await localForage.setItem(`tasks`, simplifiedTasks);
            } catch (err) {
                this.error = 'Failed to save tasks locally.';
            }
        },

        async fetchTasks(month, year) {
            this.isLoading = true;
            try {
                const response = await api.get(`/tasks/?month=${month+1}&year=${year}`);
                this.tasks = response.data.map(task => ({
                    ...task,
                    start_date: formatToDateString(task.start_date),
                    end_date: formatToDateString(task.end_date),
                }));
                this.error = null;
                await this.saveTasksToIndexedDB();
            } catch (err) {
                this.error = err.message;
                await this.loadTasksFromIndexedDB();
            } finally {
                this.isLoading = false;
            }
        },

        async createTask(taskData) {
            try {
                taskData.start_date = formatToDjangoDate(taskData.start_date)
                taskData.end_date = formatToDjangoDate(taskData.end_date)
                const response = await api.post('/tasks/', toRaw(taskData));
                this.tasks.push(response.data);
                await this.saveTasksToIndexedDB()
            } catch (err) {
                console.log(err)
                this.error = err.message;
            }
        },

        async updateTask(taskId, updatedData, taskInstance) {
            try {
                updatedData.start_date = formatToDjangoDate(updatedData.start_date)
                updatedData.end_date = formatToDjangoDate(updatedData.end_date)

                let taskToUpdate = this.tasks.findIndex(task => task.id === taskId)
                this.tasks[taskToUpdate].category = updatedData.category
                this.tasks[taskToUpdate].description = updatedData.description
                this.tasks[taskToUpdate].start_date = updatedData.start_date
                this.tasks[taskToUpdate].end_date = updatedData.end_date
                this.tasks[taskToUpdate].task_instances[taskInstance.key] = taskInstance.value
                const response = await api.patch(`/tasks/${taskId}/`, toRaw(this.tasks[taskToUpdate]))
                await this.saveTasksToIndexedDB();
                return response.data
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async deleteTask(taskId) {
            try {
                await api.delete(`/tasks/${taskId}/`);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                await this.saveTasksToIndexedDB();
            } catch (err) {
                this.error = err.message;
            }
        },

        async synchronizeTasks() {
            // todo: possible store tasks locally and sync as soon as connection is established again. No time tho
        }
    }
});

