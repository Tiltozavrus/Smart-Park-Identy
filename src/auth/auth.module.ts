import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Admin, BaseUser, User} from './entity'
import { AuthService } from './auth.service';


@Module({
    imports: [TypeOrmModule.forFeature([BaseUser, User, Admin])],
    providers: [AuthService]
})
export class AuthModule {}
