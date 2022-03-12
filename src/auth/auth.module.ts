import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Admin, BaseUser, User} from './entity'
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { UserSmsCode } from './entity/user_sms_code.entity';


@Module({
    imports: [
        TypeOrmModule.forFeature([BaseUser, User, Admin, UserSmsCode]),
        ConfigModule,
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}
