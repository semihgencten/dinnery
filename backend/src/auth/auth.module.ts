import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: 'secret', // TODO: Use environment variable
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, AuthGuard],
    controllers: [AuthController],
    exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule { }
