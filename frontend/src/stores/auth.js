import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '@/services/api.js'
import {getAPIErrorMessage} from "@/utils/errorHandler.js";

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)

    const register = async (username, email, password) => {
        try {
            const response = await api.post('/users/register/', {
                username,
                email,
                password,
            })
            token.value = response.data.token
            user.value = response.data.user
        } catch (error) {
            throw getAPIErrorMessage(error)
        }
    }

    const login = async (username, password) => {
        try {
            // Perform the login request
            const response = await api.post('/users/login/', { username, password });

            // Store the token and set the authorization header
            token.value = response.data.access;
            localStorage.setItem('token', token.value);
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;

            // Fetch the user profile
            await fetchUserProfile();
        } catch (error) {
            throw getAPIErrorMessage(error);
        }
    };

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }

    const deleteUser = async () => {
        await api.delete('/users/delete/')
        logout()
    }

    const fetchUserProfile = async () => {
        try {
            const response = await api.get('/users/me/');
            user.value = response.data;
            return response.data;
        } catch (error) {
            const stack = error.stack.split('\n');

            const callerFunction = stack[2].match(/at (\w+)/);

            if (callerFunction && callerFunction[1] === 'login') {
                // If the caller function is 'login', rethrow the original error
                throw error;
            } else {
                // Otherwise, parse and throw a custom error
                throw getAPIErrorMessage(error);
            }
        }
    };

    const resendActivationEmail = async (username) => {
        try {
            const response = await api.post('/users/resend-activation/', { username });
            return response.data;
        } catch (error) {
            throw getAPIErrorMessage(error);
        }
    };

    return {
        user,
        token,
        register,
        login,
        logout,
        deleteUser,
        fetchUserProfile,
        resendActivationEmail,
    }
})
