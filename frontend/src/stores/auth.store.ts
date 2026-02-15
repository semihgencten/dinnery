import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../lib/axios';

export interface User {
    id: number;
    email: string;
    language: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export class AuthStore {
    user: User | null = null;
    token: string | null = localStorage.getItem('token');
    refreshToken: string | null = localStorage.getItem('refreshToken');
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
        if (this.token) {
            this.loadUser();
        }
    }

    get isAuthenticated() {
        return !!this.token;
    }

    setToken(token: string | null) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    setRefreshToken(token: string | null) {
        this.refreshToken = token;
        if (token) {
            localStorage.setItem('refreshToken', token);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }

    async login(email: string, password: string) {
        this.isLoading = true;
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            runInAction(() => {
                this.setToken(response.data.accessToken);
                this.setRefreshToken(response.data.refreshToken); // Store refresh token
                this.isLoading = false;
            });
            await this.loadUser();
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async register(data: any) {
        this.isLoading = true;
        try {
            // Register usually returns the user or just success. 
            // Based on controller it returns UserResponseDto.
            // We might want to auto-login or ask user to login. 
            // For now, let's just return the response.
            const response = await api.post('/auth/register', data);
            return response.data;
        } catch (error) {
            console.error('Registration failed', error);
            throw error;
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async loadUser() {
        this.isLoading = true;
        try {
            const response = await api.get<User>('/users/me');
            runInAction(() => {
                this.user = response.data;
            });
        } catch (error) {
            console.error('Load user failed', error);
            // Don't logout immediately on loadUser failure, it might be just network error
            // But if it's 401, the interceptor will handle it or we can clearer logic here
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async updateProfile(data: { language?: string }) {
        try {
            const response = await api.patch<User>('/users/me', data);
            runInAction(() => {
                this.user = response.data;
            });
        } catch (error) {
            console.error('Update profile failed', error);
            throw error;
        }
    }

    logout() {
        this.setToken(null);
        this.setRefreshToken(null);
        this.user = null;
    }

    async refreshAccessToken() {
        if (!this.refreshToken) {
            this.logout();
            throw new Error('No refresh token available');
        }

        try {
            const response = await api.post<{ accessToken: string }>('/auth/refresh', {
                refreshToken: this.refreshToken,
            });

            runInAction(() => {
                this.setToken(response.data.accessToken);
                // Currently backend doesn't return new refresh token, but if it did, update it here
            });

            return response.data.accessToken;
        } catch (error) {
            console.error('Refresh token failed', error);
            this.logout();
            throw error;
        }
    }
}
