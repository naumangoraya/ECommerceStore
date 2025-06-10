import axiosInstance from './axiosInstance';
import { useUserStore } from '../stores/useUserStore';

let refreshPromise = null;

// Request interceptor to add Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const user = useUserStore.getState().user;
        if (user?.accessToken) {
            config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is not 401 or request has already been retried, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        try {
            originalRequest._retry = true;

            // If a refresh is already in progress, wait for it
            if (refreshPromise) {
                await refreshPromise;
            } else {
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;
            }

            // Retry the original request with new token
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            useUserStore.getState().logout();
            return Promise.reject(refreshError);
        }
    }
); 