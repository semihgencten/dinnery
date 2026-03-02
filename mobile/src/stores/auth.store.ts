import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, refreshToken } from '../api/authApi';
import type { UserLoginRequestDto, UserRegisterRequestDto } from '../../../shared/api-types';

export class AuthStore {
    isAuthenticated = false;
    accessToken: string | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.loadToken();
    }

    async loadToken() {
        try {
            const token = await AsyncStorage.getItem('token');
            runInAction(() => {
                this.accessToken = token;
                this.isAuthenticated = !!token;
            });
        } catch (e) {
            console.error("Failed to load token", e);
        }
    }

    async login(payload: UserLoginRequestDto) {
        this.isLoading = true;
        this.error = null;
        try {
            const response = await login(payload);
            await AsyncStorage.setItem('token', response.accessToken);
            await AsyncStorage.setItem('refreshToken', response.refreshToken);

            runInAction(() => {
                this.accessToken = response.accessToken;
                this.isAuthenticated = true;
                this.isLoading = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Login failed';
                this.isLoading = false;
            });
            throw e;
        }
    }

    async logout() {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        runInAction(() => {
            this.accessToken = null;
            this.isAuthenticated = false;
        });
    }

    async register(payload: UserRegisterRequestDto) {
        this.isLoading = true;
        this.error = null;
        try {
            await register(payload);
            runInAction(() => {
                this.isLoading = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Registration failed';
                this.isLoading = false;
            });
            throw e;
        }
    }

    async refreshAccessToken() {
        try {
            const token = await AsyncStorage.getItem('refreshToken');
            if (!token) throw new Error('No refresh token available');

            const response = await refreshToken(token);
            await AsyncStorage.setItem('token', response.accessToken);
            runInAction(() => {
                this.accessToken = response.accessToken;
            });
            return response.accessToken;
        } catch (e) {
            await this.logout();
            throw e;
        }
    }
}

export const authStore = new AuthStore();
