import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
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

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    language?: string;
}

export class UserResponseDto {
    id: number;
    email: string;
    language: string;
}
