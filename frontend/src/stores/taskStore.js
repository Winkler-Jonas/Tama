import { defineStore } from 'pinia';
import api from '@/services/api';  // Ensure the path matches where your api.js file is located

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        isLoading: false,
        error: null,
    }),

    actions: {
        async fetchTasks(month, year) {
            this.isLoading = true;
            try {
                const response = await api.get(`/tasks/?month=${month}&year=${year}`);
                this.tasks = response.data;
                this.error = null;
            } catch (err) {
                this.error = err.message;
                this.tasks = [];  // Reset tasks on error
            } finally {
                this.isLoading = false;
            }
        },

        async createTask(taskData) {
            try {
                const response = await api.post('/tasks/', taskData);
                this.tasks.push(response.data);  // Add the new task to the state
            } catch (err) {
                this.error = err.message;
            }
        },

        async updateTask(taskId, updatedData) {
            try {
                const response = await api.patch(`/tasks/${taskId}/`, updatedData);
                const index = this.tasks.findIndex(task => task.id === taskId);
                if (index !== -1) {
                    this.tasks[index] = response.data;  // Update the task in the state
                }
            } catch (err) {
                this.error = err.message;
            }
        },

        async deleteTask(taskId) {
            try {
                await api.delete(`/tasks/${taskId}/`);
                this.tasks = this.tasks.filter(task => task.id !== taskId);  // Remove the task from the state
            } catch (err) {
                this.error = err.message;
            }
        },
    }
});
