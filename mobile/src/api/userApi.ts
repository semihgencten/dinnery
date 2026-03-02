import { axiosClient } from "./axiosClient";
import type { UserGetProfileResponseDto, UserUpdateProfileRequestDto, UserUpdateProfileResponseDto } from "../../../shared/api-types";

export const getMe = async (): Promise<UserGetProfileResponseDto> => {
    const response = await axiosClient.get<UserGetProfileResponseDto>('/users/me');
    return response.data;
};

export const updateMe = async (data: UserUpdateProfileRequestDto): Promise<UserUpdateProfileResponseDto> => {
    const response = await axiosClient.patch<UserUpdateProfileResponseDto>('/users/me', data);
    return response.data;
};
