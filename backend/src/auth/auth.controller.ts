import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UserResponseDto } from '../users/dtos/user.dto';
import { LoginDto } from './dtos/auth.dto';
import { User } from '../users/domain/user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.authService.register(createUserDto);
        return this.toResponse(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    private toResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            country: user.country,
            avatar: user.avatar || null
        };
    }
}
