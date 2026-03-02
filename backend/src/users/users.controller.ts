import { Controller, Get, Patch, Param, UseGuards, Req, Body } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import {
    UserBaseResponseDto,
    UserUpdateProfileRequestDto,
    UserGetAllResponseDto,
    UserGetProfileResponseDto,
    UserUpdateProfileResponseDto,
    UserGetResponseDto
} from './dtos/user.dto';
import { User } from './domain/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll(): Promise<UserGetAllResponseDto[]> {
        const users = await this.usersService.findAll();
        return users.map(user => this.toResponse(user));
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: any): Promise<UserGetProfileResponseDto> {
        const user = await this.usersService.findOne(req.user.sub);
        return this.toResponse(user);
    }

    @Patch('me')
    @UseGuards(AuthGuard)
    async updateProfile(@Req() req: any, @Body() updateDto: UserUpdateProfileRequestDto): Promise<UserUpdateProfileResponseDto> {
        const user = await this.usersService.update(req.user.sub, updateDto);
        return this.toResponse(user);
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserGetResponseDto> {
        const user = await this.usersService.findOne(id);
        return this.toResponse(user);
    }

    private toResponse(user: User): UserBaseResponseDto {
        return {
            id: user.id,
            email: user.email,
            language: user.language,
        };
    }
}

