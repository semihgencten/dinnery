import axios from 'axios';

export const axiosClient = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
                    // Update header with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosClient(originalRequest);
                } catch (refreshError) {
                    // Refresh failed (e.g. refresh token expired), user is already logged out by store
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};
