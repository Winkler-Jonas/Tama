import { defineStore } from 'pinia';
import api from '@/services/api';
import {formatToDjangoDate} from "@/utils/calendarLogic.js";
import { toRaw } from "vue";

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
    },

    actions: {
        loadTasksFromLocalStorage() {
            const tasks = localStorage.getItem('tasks');
            if (tasks) {
                this.tasks = JSON.parse(tasks);
            }
        },

        saveTasksToLocalStorage() {
            localStorage.setItem('tasks', JSON.stringify(this.tasks));
        },

        async fetchTasks(month, year) {
            function formatDate(dateStr) {
                if (!dateStr) return null;
                const date = new Date(dateStr);
                return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
            }

            this.isLoading = true;
            try {
                const response = await api.get(`/tasks/?month=${month+1}&year=${year}`);
                this.tasks = response.data.map(task => ({
                    ...task,
                    start_date: formatDate(task.start_date),
                    end_date: formatDate(task.end_date),
                }));
                this.error = null;
                this.saveTasksToLocalStorage();
            } catch (err) {
                this.error = err.message;
                this.loadTasksFromLocalStorage();
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
                this.saveTasksToLocalStorage();
            } catch (err) {
                this.error = err.message;
                // Optionally add to local storage or queue for later sync
            }
        },

        async updateTask(taskId, updatedData) {
            try {
                updatedData.start_date = formatToDjangoDate(updatedData.start_date)
                updatedData.end_date = formatToDjangoDate(updatedData.end_date)
                const response = await api.patch(`/tasks/${taskId}/`, updatedData);
                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = response.data;
                    this.saveTasksToLocalStorage();
                }
                return response.data;
            } catch (err) {
                this.error = err.message;
                // todo should be stored locally and synced as soon as connection is established again
                throw err
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

