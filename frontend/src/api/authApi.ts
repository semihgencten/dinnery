import { axiosClient } from "./axiosClient";
import type { LoginPayload, LoginResponse, RegisterPayload } from "../types/auth";

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await axiosClient.post<LoginResponse>('/auth/login', payload);
    return response.data;
};

export const register = async (payload: RegisterPayload): Promise<void> => {
    await axiosClient.post('/auth/register', payload);
};

export const refreshToken = async (token: string): Promise<{ accessToken: string }> => {
    const response = await axiosClient.post<{ accessToken: string }>('/auth/refresh', {
        refreshToken: token,
    });
    return response.data;
};
