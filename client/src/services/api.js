import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_SOCKET_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Retrieves token from local storage
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;