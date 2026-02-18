import { axiosClient } from "./axiosClient";
import type { User } from "../types/user";

export const getMe = async (): Promise<User> => {
    const response = await axiosClient.get<User>('/users/me');
    return response.data;
};

export const updateMe = async (data: { language?: string }): Promise<User> => {
    const response = await axiosClient.patch<User>('/users/me', data);
    return response.data;
};
