import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const axiosInstance = axios.create({
    baseURL: process.env.EXPO_PUBLIC_FLOWERSTORE_OPENAPI_DEV_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        config.headers.set('Content-Type', 'application/json');
        config.headers.set('Accept', 'application/json');
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.log("API Response Error:", error.response.data);
            console.log("Status Code:", error.response.status);
        } else if (error.request) {
            console.log("API Request Error:", error.request);
        } else {
            console.log("Error:", error.message);
        }
        return Promise.reject(error);
    }
);


