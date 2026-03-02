import { axiosClient } from "./axiosClient";
import type {
    UserLoginRequestDto, UserLoginResponseDto,
    UserRegisterRequestDto, UserRefreshTokenResponseDto
} from "../../../shared/api-types";

export const login = async (payload: UserLoginRequestDto): Promise<UserLoginResponseDto> => {
    const response = await axiosClient.post<UserLoginResponseDto>('/auth/login', payload);
    return response.data;
};

export const register = async (payload: UserRegisterRequestDto): Promise<void> => {
    await axiosClient.post('/auth/register', payload);
};

export const refreshToken = async (token: string): Promise<UserRefreshTokenResponseDto> => {
    const response = await axiosClient.post<UserRefreshTokenResponseDto>('/auth/refresh', {
        refreshToken: token,
    });
    return response.data;
};
