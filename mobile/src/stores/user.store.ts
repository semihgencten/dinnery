import { makeAutoObservable, runInAction } from 'mobx';
import { getMe } from '../api/userApi';
import type { UserGetProfileResponseDto } from '../../../shared/api-types';

export class UserStore {
    profile: UserGetProfileResponseDto | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchProfile() {
        this.isLoading = true;
        this.error = null;
        try {
            const data = await getMe();
            runInAction(() => {
                this.profile = data;
                this.isLoading = false;
            });
        } catch (e: any) {
            runInAction(() => {
                this.error = e.response?.data?.message || 'Failed to fetch profile';
                this.isLoading = false;
            });
        }
    }
}

export const userStore = new UserStore();
