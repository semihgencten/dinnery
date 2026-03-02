import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRegisterRequestDto, UserRegisterResponseDto } from '../users/dtos/user.dto';
import { UserLoginRequestDto, UserRefreshTokenRequestDto, UserLoginResponseDto, UserRefreshTokenResponseDto } from './dtos/auth.dto';
import { User } from '../users/domain/user.model';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() createUserDto: UserRegisterRequestDto): Promise<UserRegisterResponseDto> {
        const user = await this.authService.register(createUserDto);
        return this.toResponse(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: UserLoginRequestDto): Promise<UserLoginResponseDto> {
        return this.authService.login(loginDto.email, loginDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    async refresh(@Body() refreshDto: UserRefreshTokenRequestDto): Promise<UserRefreshTokenResponseDto> {
        return this.authService.refresh(refreshDto.refreshToken);
    }

    private toResponse(user: User): UserRegisterResponseDto {
        return {
            id: user.id,
            email: user.email,
            language: user.language,
        };
    }
}

