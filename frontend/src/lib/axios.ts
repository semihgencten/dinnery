import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

export const setupInterceptors = (store: any) => {
    api.interceptors.response.use(
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
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh failed (e.g. refresh token expired), user is already logged out by store
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
};
