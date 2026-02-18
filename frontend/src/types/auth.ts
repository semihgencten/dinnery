export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    password: string;
    language?: string;
}
