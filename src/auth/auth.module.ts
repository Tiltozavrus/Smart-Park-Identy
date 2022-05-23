import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Admin, BaseUser, User} from './entity'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSmsCode } from './entity/user_sms_code.entity';
import { RolesGuard } from './roles.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';


/**
 * Auth module
 *
 * @export
 * @class AuthModule
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([BaseUser, User, Admin, UserSmsCode]),
        ConfigModule,
    ],
    providers: [AuthService, RolesGuard],
    controllers: [AuthController]
})
export class AuthModule {}
