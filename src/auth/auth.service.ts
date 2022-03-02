import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityNotFoundError, MongoRepository, QueryFailedError, FindManyOptions } from 'typeorm';
import { CreateUserDto } from './dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import {User, BaseUser, Admin} from './entity'

export const AuthServiceExceptions = {
    UserExist: Error("user exist"),
    UserNotFound: Error("user not found"),
    AdminExist: Error("admin exist")
}

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

    private createBaseUser(): Promise<BaseUser> {
        return this.baseUserReposiotry.save(new BaseUser(), {})
    }

    private async userExistByPhoneNumber(phone: string): Promise<boolean> {
        return await this.userReposiotry.findOne({where: [{phoneNumber: phone}]}) === undefined ? false : true
    }

    private async adminExistByEmail(email: string): Promise<boolean>  {
        return await this.adminReposiotry.findOne({where: [{email: email}]}) === undefined ? false : true
    }

    async createUser(req: CreateUserDto): Promise<User> {
        if (await this.userExistByPhoneNumber(req.phoneNumber)) {
            throw AuthServiceExceptions.UserExist
        }

        const user = new User()
        user.name = req.name
        user.phoneNumber = req.phoneNumber
        user.baseUser = await this.createBaseUser()
        return this.userReposiotry.save(user)
    }

    private async deleteBaseUser(id: number) {
        const result = await this.baseUserReposiotry.delete({id: id})
        if (result.affected == 0) {
            return false
        }
        return true
    }

    async deleteUser(id: number) {
        return this.deleteBaseUser(id)
    }

    async createAdmin(req: CreateAdminDto): Promise<Admin> {
        if (await this.adminExistByEmail(req.email)) {
            throw AuthServiceExceptions.AdminExist
        }

        const admin = new Admin()
        admin.email = req.email
        admin.password = req.password
        admin.baseUser = await this.createBaseUser()
        return this.adminReposiotry.save(admin)

    }

    async getUsers(opts?: FindManyOptions<User>): Promise<User[]> {
        return this.userReposiotry.find(opts)
    }

    async deleteAdmin(id: number) {
        return this.deleteBaseUser(id)
    }

    async getAdmins(opts?: FindManyOptions<Admin>): Promise<Admin[]> {
        return this.adminReposiotry.find(opts)
    }
}
