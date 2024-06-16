import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '@/services/api.js'
import {getAPIErrorMessage} from "@/utils/errorHandler.js";



export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(null);

    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
    }

    const register = async (username, email, password, locale) => {
        try {
            const response = await api.post('/users/register/', {
                username,
                email,
                password,
                locale
            })
            token.value = response.data.token
            user.value = response.data.user
        } catch (error) {
            throw getAPIErrorMessage(error)
        }
    }

    const login = async (username, password) => {
        try {
            const response = await api.post('/users/login/', { username, password });
            token.value = response.data.access;
            localStorage.setItem('token', token.value);
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
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
        if (!token.value) return;

        try {
            const response = await api.get('/users/me/');
            user.value = response.data;
        } catch (error) {
            logout();
            throw getAPIErrorMessage(error);
        }
    };

    if (token.value) {
        fetchUserProfile();
    }

    const resendActivationEmail = async (username, locale) => {
        try {
            const response = await api.post('/users/resend-activation/', { username, locale });
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
