import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { randomUUID } from 'crypto';
import { Repository, EntityNotFoundError, MongoRepository, QueryFailedError, FindManyOptions } from 'typeorm';
import { CreateUserDto } from './dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {User, BaseUser, Admin} from './entity'
import { UserSmsCode } from './entity/user_sms_code.entity';
import { Role } from './roles';
import { CreateExpiresFunc, DecodedToken, DecodeType, ExpirationStatus, TokenFactory } from './token';

export const AuthServiceExceptions = {
    UserExist: Error("user exist with this phone number"),
    UserNotFound: Error("user not found"),
    AdminExist: Error("admin exist"),
    AdminNotFoud: Error("admin not found"),
    AdminFailedAuth: Error("admin failed auth"),
    UserFailedAuth: Error("User failed auth"),
    InvalidToken: Error("Invalid token"),
    TokenExpired: Error("Token expired")
}

export interface CreatedTokens {
    token: string
    refreshToken: string
}

export interface Payload {
    role: Role, 
    userId: number
}

@Injectable()
export class AuthService {
    private readonly tokenFactory: TokenFactory

    constructor(
        @InjectRepository(User)
        private readonly userReposiotry: Repository<User>,

        @InjectRepository(BaseUser)
        private readonly baseUserReposiotry: Repository<BaseUser>,

        @InjectRepository(Admin)
        private readonly adminReposiotry: Repository<Admin>,

        private readonly configService: ConfigService,

        @InjectRepository(UserSmsCode)
        private readonly smsRepository: Repository<UserSmsCode>
    ) {
        this.tokenFactory = new TokenFactory(
            configService.get<string>("IDENTY_SECRET"),
            configService.get<string>("IDENTY_REFRESH_SECRET"),
            "HS512"
        )
    }

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

    async getUser(id: number): Promise<User> {
        return this.userReposiotry.findOne(id)
    }

    async getAdmin(id: number): Promise<Admin> {
        return this.adminReposiotry.findOne(id)
    }

    async updateUser(id:number, req: UpdateUserDto): Promise<User> {
        const getUser = await this.getUser(id)
        if(getUser === undefined) {
            throw AuthServiceExceptions.UserNotFound
        }
        
        if(req.phoneNumber && getUser.phoneNumber != req.phoneNumber && await this.userExistByPhoneNumber(req.phoneNumber)) {
            throw AuthServiceExceptions.UserExist
        }

        return this.userReposiotry.save(
            this.userReposiotry.merge(getUser, req),
        )
    }

    async updateAdmin(id: number, req: UpdateAdminDto): Promise<Admin> {
        const getAdmin = await this.getAdmin(id)
        if(getAdmin === undefined) {
            throw AuthServiceExceptions.AdminNotFoud
        }

        if(req.email && getAdmin.email != req.email && await this.adminExistByEmail(req.email)) {
            throw AuthServiceExceptions.AdminExist
        }

        return this.adminReposiotry.save(
            this.adminReposiotry.merge(
                getAdmin, 
                req
            )
        )
    }

    private expiresFunc: CreateExpiresFunc = (issued: number) => {
        const minuteInMs = 60000
        const hourInMs = minuteInMs * 60
        return issued + 24 * hourInMs
    }

    async loginAdmin(email: string, password: string): Promise<CreatedTokens> {
        const getAdmin = await this.adminReposiotry.findOne(
            {
                where: [
                    {
                        email: email
                    }
                ]
            }
        )
        if (getAdmin === undefined || getAdmin.password != password) {
            throw AuthServiceExceptions.AdminFailedAuth
        }

        return this.createTokens({userId: getAdmin.id, role: Role.Admin})
    }

    async loginUser(phoneNumber: string, code: string): Promise<CreatedTokens> {
        const getUserWithCode = await this.smsRepository.findOne(
            {
                relations: ["user"],
                where: [
                    {
                        user: {
                            phoneNumber: phoneNumber
                        }
                    }
                ],
            }
        )
        if(getUserWithCode === undefined || getUserWithCode.smsCode !== code) {
            throw AuthServiceExceptions.UserFailedAuth
        }

        return this.createTokens({userId: getUserWithCode.id, role: Role.User})
    }

    private createTokens(payload: Payload): CreatedTokens {
        const token = this.tokenFactory.createToken(payload)(this.expiresFunc)

        const refreshToken = this.tokenFactory.createRefreshToken(payload)(this.expiresFunc)

        return {
            token: token.token,
            refreshToken: refreshToken.token
        }
    }


    async createSmsCode(phoneNumber: string): Promise<string> {
        const user = await this.userReposiotry.findOne({where: [{phoneNumber: phoneNumber}]})
        if(user === undefined) {
            throw AuthServiceExceptions.UserNotFound
        }


        const randomNubmer = () => Math.floor(Math.random()*9 + 1);

        const userWithSms = await this.smsRepository.findOne({where: {user: {baseUser: {id: user.id}}}})
        if(userWithSms === undefined) {
            const userSmsCode = new UserSmsCode()
            userSmsCode.user = user
            userSmsCode.smsCode = `${randomNubmer()}${randomNubmer()}${randomNubmer()}${randomNubmer()}`

            const created = await this.smsRepository.save(userSmsCode)

            return created.smsCode
        } else {
            userWithSms.smsCode = `${randomNubmer()}${randomNubmer()}${randomNubmer()}${randomNubmer()}`
            const created = await this.smsRepository.save(userWithSms)

            return created.smsCode
        }
    }

    decodeToken(token: string): DecodedToken<Payload> {
        const decoded = this.tokenFactory.decodeToken<Payload>(token)

        this.checkToken(decoded)

        return decoded
    }

    decodeRefreshToken(refresh: string): DecodedToken<Payload> {
        const decoded = this.tokenFactory.decodeRefreshToken<Payload>(refresh)

        this.checkToken(decoded)

        return decoded
    }

    private checkToken(decoded: DecodedToken<Payload>) {
        switch(decoded.type) {
            case DecodeType.InvalidToken, DecodeType.IntegtiryError:
                throw AuthServiceExceptions.InvalidToken
        }
        switch(decoded.expirationStatus) {
            case ExpirationStatus.Expired:
                throw AuthServiceExceptions.TokenExpired
        }
    }

    async refreshToken(token: string): Promise<CreatedTokens> {
        const decoded = this.decodeRefreshToken(token)

        return this.createTokens(decoded.payload.payload)
    }
}
