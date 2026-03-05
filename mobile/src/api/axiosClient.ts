import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const getBaseUrl = () => {
    if (__DEV__) {
        return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
    }
    return 'https://your-production-url.com';
};

// Base URL would be adjusted depending on local environment (e.g. 10.0.2.2 for Android Simulator)
export const axiosClient = axios.create({
    baseURL: getBaseUrl(),
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (e) {
        // error reading value
    }
    return config;
});

export const setupInterceptors = (store: any) => {
    axiosClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            // Check if error is 401 and not a retry and not the refresh request itself
            if (
                error.response?.status === 401 &&
                !(originalRequest as any)._retry &&
                !originalRequest.url?.includes('/auth/refresh')
            ) {
                (originalRequest as any)._retry = true;
                try {
                    const accessToken = await store.authStore.refreshAccessToken();
                    if (accessToken) {
                        // Update header with new token
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        return axiosClient(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh failed (e.g. refresh token expired), user is already logged out by store
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};
