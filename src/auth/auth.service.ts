import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/user.dto';
import bcrypt from "bcrypt";

// auth.service.ts
@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) { }



    async register(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.usersService.create({ ...createUserDto, password: hashedPassword });
    }

    async login(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException();

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new UnauthorizedException();

        const accessToken = this.jwtService.sign(
            { sub: user.id, email: user.email },
            { expiresIn: '15m' }
        );

        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { secret: process.env.REFRESH_SECRET, expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }

    async refresh(refreshToken: string) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_SECRET,
            });

            const accessToken = this.jwtService.sign(
                { sub: payload.sub, email: payload.email },
                { expiresIn: '15m' }
            );

            return { accessToken };
        } catch {
            throw new UnauthorizedException();
        }
    }
}
