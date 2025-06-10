import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_CLIENT_URL || "http://localhost:5000/api",
    withCredentials: true,
});

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const userStorage = localStorage.getItem('user-storage');
        if (userStorage) {
            const { state } = JSON.parse(userStorage);
            if (state.user?.accessToken) {
                config.headers.Authorization = `Bearer ${state.user.accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance; 