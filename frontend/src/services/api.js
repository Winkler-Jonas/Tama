import axios from 'axios'

// Assuming VITE_SECRET_KEY is set in your .env file
const apiKey = decodeURIComponent(import.meta.env.VITE_API_KEY)

const api = axios.create({
    baseURL: `${window.location.protocol}//${window.location.hostname}/api`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Custom-Header': apiKey,
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.activate = (uidb64, token) => {
    return api.get(`/users/activate/${uidb64}/${token}/`)
}

export default api
