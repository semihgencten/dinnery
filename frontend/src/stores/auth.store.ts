import { makeAutoObservable, runInAction } from 'mobx';
import { login, register, refreshToken } from '../api/authApi';
import { getMe, updateMe } from '../api/userApi';
import type { RegisterPayload } from '../types/auth';
import type { User } from '../types/user';

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
            const data = await login({ email, password });
            runInAction(() => {
                this.setToken(data.accessToken);
                this.setRefreshToken(data.refreshToken); // Store refresh token
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

    async register(data: RegisterPayload) {
        this.isLoading = true;
        try {
            // Register usually returns the user or just success. 
            // Based on controller it returns UserResponseDto.
            // We might want to auto-login or ask user to login. 
            // For now, let's just return the response.
            await register(data);
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
            const user = await getMe();
            runInAction(() => {
                this.user = user;
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
            const user = await updateMe(data);
            runInAction(() => {
                this.user = user;
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
            const data = await refreshToken(this.refreshToken);

            runInAction(() => {
                this.setToken(data.accessToken);
                // Currently backend doesn't return new refresh token, but if it did, update it here
            });

            return data.accessToken;
        } catch (error) {
            console.error('Refresh token failed', error);
            this.logout();
            throw error;
        }
    }
}
