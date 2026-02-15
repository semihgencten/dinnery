import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';
import { OptionalAuthGuard } from './optional-auth.guard';

@Module({
    imports: [
        forwardRef(() => UsersModule),
        JwtModule.register({
            secret: 'secret', // TODO: Use environment variable
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, AuthGuard, OptionalAuthGuard],
    controllers: [AuthController],
    exports: [AuthService, AuthGuard, OptionalAuthGuard, JwtModule],
})
export class AuthModule { }
