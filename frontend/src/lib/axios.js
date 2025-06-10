import axios from "axios";
import { useUserStore } from "../stores/useUserStore";

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_CLIENT_URL || "http://localhost:5000/api",
	withCredentials: true, // send cookies to the server
});

// Add a request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
	(config) => {
		const user = useUserStore.getState().user;
		if (user?.accessToken) {
			config.headers.Authorization = `Bearer ${user.accessToken}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default axiosInstance;
