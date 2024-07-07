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
            return state.tasks.filter(task => task.start_date === targetDate);
        },
        getTasksOfMonth: (state) => (date) => {
            const yearMonth = formatToDjangoDate(date).substring(0, 7);
            const x = state.tasks.filter(task => task.start_date.includes(yearMonth))
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

        async updateTask(taskId, updatedData) {
            try {
                updatedData.start_date = formatToDjangoDate(updatedData.start_date)
                updatedData.end_date = formatToDjangoDate(updatedData.end_date)
                const response = await api.patch(`/tasks/${taskId}/`, updatedData);

                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = {
                        ...response.data.updated_task,
                        start_date: formatToDateString(response.data.updated_task.start_date),
                        end_date: formatToDateString(response.data.updated_task.end_date)
                    };
                }

                if (response.data.new_task) {
                    const formattedNewTask = {
                        ...response.data.new_task,
                        start_date: formatToDateString(response.data.new_task.start_date),
                        end_date: formatToDateString(response.data.new_task.end_date)
                    };
                    this.tasks.push(formattedNewTask);
                }

                this.saveTasksToLocalStorage();
                return response.data;
            } catch (err) {
                this.error = err.message;
                throw err;
            }
        },

        async deleteTask(taskId) {
            try {
                await api.delete(`/tasks/${taskId}/`);
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this.saveTasksToLocalStorage();
            } catch (err) {
                this.error = err.message;
                // Optionally handle local deletion or queue for later sync
            }
        },

        async synchronizeTasks() {
            // Implement synchronization logic here
            // This could iterate over locally stored tasks and try to sync them with the server
        }
    }
});

