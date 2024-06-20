import {defineStore} from 'pinia'
import {ref} from 'vue'
import api from '@/services/api.js'
import {getAPIErrorMessage} from "@/utils/errorHandler.js";
import { emitter } from '@/eventEmitter.js'



export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('accessToken') || null);
    const refreshToken = ref(localStorage.getItem('refreshToken') || null);
    const expiresAt = ref(localStorage.getItem('expiresAt') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);

    const initAuth = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if (accessToken && refreshToken) {
            setAuthData(accessToken, refreshToken);
        }
    };

    const setAuthData = (accessToken, refreshTokenValue) => {
        const now = new Date();
        expiresAt.value = new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Assuming token expires in 60 minutes

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshTokenValue);
        localStorage.setItem('expiresAt', expiresAt.value);

        token.value = accessToken;
        refreshToken.value = refreshTokenValue;

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        scheduleTokenRefresh();
    };

    const clearAuthData = () => {
        token.value = null;
        refreshToken.value = null;
        expiresAt.value = null;
        user.value = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('expiresAt');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
    };


    const refreshTokenFn = async () => {
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refreshToken.value });
            setAuthData(response.data.access, refreshToken.value);
        } catch (error) {
            clearAuthData();
            emitter.emit('auth:expired');
        }
    };

    const scheduleTokenRefresh = () => {
        const now = new Date();
        const expirationTime = new Date(expiresAt.value);
        const delay = expirationTime.getTime() - now.getTime() - 5 * 60 * 1000; // Refresh 5 minutes before token expires

        setTimeout(refreshTokenFn, delay > 0 ? delay : 0);
    };

    if (token.value) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
        scheduleTokenRefresh();
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
            setAuthData(response.data.access, response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
            user.value = response.data.user;
            await fetchUserProfile();
        } catch (error) {
            clearAuthData();
            throw getAPIErrorMessage(error);
        }
    };

    const logout = () => {
        clearAuthData();
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
        login,
        logout,
        initAuth,
        register,
        deleteUser,
        fetchUserProfile,
        resendActivationEmail,
        refreshToken: refreshTokenFn,
    }
})
