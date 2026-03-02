import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class UserRegisterRequestDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    language: string;
}

export class UserUpdateProfileRequestDto {
    @IsString()
    @IsOptional()
    language?: string;
}

export class UserBaseResponseDto {
    id: number;
    email: string;
    language: string;
}

export class UserRegisterResponseDto extends UserBaseResponseDto { }
export class UserGetResponseDto extends UserBaseResponseDto { }
export class UserGetAllResponseDto extends UserBaseResponseDto { }
export class UserGetProfileResponseDto extends UserBaseResponseDto { }
export class UserUpdateProfileResponseDto extends UserBaseResponseDto { }

