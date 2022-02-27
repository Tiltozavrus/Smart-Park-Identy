import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import {User, BaseUser, Admin} from './entity'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userReposiotry: Repository<User>,

        @InjectRepository(BaseUser)
        private readonly baseUserReposiotry: Repository<BaseUser>,

        @InjectRepository(Admin)
        private readonly adminReposiotry: Repository<Admin>,
    ) {}

    private createBaseUser(): BaseUser {
        return new BaseUser()
    }

    createUser(req: CreateUserDto): Promise<User> {
        const user = new User()
        user.baseUser = this.createBaseUser()
        user.name = req.name
        user.phoneNumber = req.phoneNumber

        return this.userReposiotry.save(user)
    }
}
