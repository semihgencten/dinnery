import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    country: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}

export class UserResponseDto {
    id: number;
    name: string;
    username: string;
    email: string;
    country: string;
    avatar: string | null;
}
