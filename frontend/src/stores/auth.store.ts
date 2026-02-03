import { makeAutoObservable, runInAction } from 'mobx';
import { api } from '../lib/axios';

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    country: string;
    avatar: string | null;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export class AuthStore {
    user: User | null = null;
    token: string | null = localStorage.getItem('token');
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

    async login(email: string, password: string) {
        this.isLoading = true;
        try {
            const response = await api.post<LoginResponse>('/auth/login', { email, password });
            runInAction(() => {
                this.setToken(response.data.accessToken);
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
            this.logout();
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    logout() {
        this.setToken(null);
        this.user = null;
    }
}
