import { create } from "zustand";
import { persist } from "zustand/middleware";
import axiosInstance from "../lib/axiosInstance";
import { toast } from "react-hot-toast";

// Create the store without the interceptor
export const useUserStore = create(
	persist(
		(set, get) => ({
			user: null,
			loading: false,
			checkingAuth: true,

			signup: async ({ name, email, password, confirmPassword }) => {
				set({ loading: true });

				if (password !== confirmPassword) {
					set({ loading: false });
					return toast.error("Passwords do not match");
				}

				try {
					const res = await axiosInstance.post("/auth/signup", { name, email, password });
					set({ user: res.data, loading: false });
					toast.success("Signup successful!");
				} catch (error) {
					set({ loading: false });
					toast.error(error.response?.data?.message || "An error occurred");
				}
			},
			login: async (email, password) => {
				set({ loading: true });

				try {
					const res = await axiosInstance.post("/auth/login", { email, password });
					set({ user: res.data, loading: false });
					toast.success("Login successful!");
				} catch (error) {
					set({ loading: false });
					toast.error(error.response?.data?.message || "An error occurred");
				}
			},

			logout: async () => {
				try {
					await axiosInstance.post("/auth/logout");
					set({ user: null });
					toast.success("Logged out successfully");
				} catch (error) {
					toast.error(error.response?.data?.message || "An error occurred during logout");
				}
			},

			checkAuth: async () => {
				if (!get().user) {
					set({ checkingAuth: false });
					return;
				}

				set({ checkingAuth: true });
				try {
					const response = await axiosInstance.get("/auth/check");
					if (response.data) {
						set({ user: response.data, checkingAuth: false });
					} else {
						set({ user: null, checkingAuth: false });
					}
				} catch (error) {
					set({ checkingAuth: false, user: null });
				}
			},

			refreshToken: async () => {
				try {
					const response = await axiosInstance.post("/auth/refresh-token");
					const { accessToken } = response.data;
					set((state) => ({
						user: state.user ? { ...state.user, accessToken } : null
					}));
					return accessToken;
				} catch (error) {
					set({ user: null });
					throw error;
				}
			}
		}),
		{
			name: 'user-storage',
			partialize: (state) => ({ user: state.user })
		}
	)
);

// Add axios interceptor for token refresh
let refreshPromise = null;

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

// Axios interceptor for handling unauthorized requests
axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		if (error.response?.status === 401) {
			// On 401, clear user state and redirect to login
			useUserStore.getState().logout();
		}
		return Promise.reject(error);
	}
);
