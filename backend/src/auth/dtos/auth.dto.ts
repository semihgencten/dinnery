import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UserRefreshTokenRequestDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}

export class UserLoginResponseDto {
    accessToken: string;
    refreshToken: string;
}

export class UserRefreshTokenResponseDto {
    accessToken: string;
}
