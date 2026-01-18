import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './dtos/user.dto';
import { User } from './domain/user.model';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    async create(@Body() createDto: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.usersService.create(createDto);
        return this.toResponse(user);
    }

    @Get()
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.usersService.findAll();
        return users.map(user => this.toResponse(user));
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<UserResponseDto> {
        const user = await this.usersService.findOne(id);
        return this.toResponse(user);
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
