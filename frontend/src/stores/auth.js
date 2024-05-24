import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api.js'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const token = ref(null)

    const register = async (username, email, password) => {
        const response = await api.post('/users/register/', {
            username,
            email,
            password,
        })
        token.value = response.data.token
        user.value = response.data.user
    }

    const login = async (username, password) => {
        const response = await api.post('/token/', {
            username,
            password,
        })
        token.value = response.data.access
        localStorage.setItem('token', token.value)
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        await fetchUserProfile()
    }

    const logout = () => {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }

    const deleteUser = async () => {
        await api.delete('/users/delete/')
        logout()  // Log out after deleting the user
    }

    const fetchUserProfile = async () => {
        const response = await api.get('/users/me/')
        user.value = response.data
    }

    const resendActivationEmail = async (email) => {
        const response = await api.post('/users/resend-activation/', { email })
        return response.data
    }

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
