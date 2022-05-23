import { ArgumentsHost, BadRequestException, Body, CallHandler, Catch, Controller, Delete, ExceptionFilter, ExecutionContext, Get, HttpCode, NestInterceptor, NotFoundException, Param, Post, Put, UseFilters, UseInterceptors,  UnauthorizedException, UseGuards, HttpException, HttpStatus} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import e = require('express');
import { catchError, Observable } from 'rxjs';
import { AuthService, AuthServiceExceptions } from './auth.service';
import { CreateUserDto, UserCreateResp } from './dto';
import { CheckTokenDto } from './dto/check-token.dto';
import { CreateAdminDto, CreateAdminResp } from './dto/create-admin.dto';
import { CreateTokenResp } from './dto/create-token.dto';
import { GetAdminResp } from './dto/get-admin.dto';
import { GetUsersResp } from './dto/get-user.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entity';
import { Role } from './roles';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

/**
 * Interceptor to catch auth errors
 *
 * @class AuthControllerEdrrorInterceptor
 * @implements {NestInterceptor}
 */
class AuthControllerEdrrorInterceptor implements NestInterceptor {
    /**
     * interceptor to transorm error to exception
     *
     * @param {ExecutionContext} context
     * @param {CallHandler<any>} next
     * @return {*}  {(Observable<any> | Promise<Observable<any>>)}
     * @memberof AuthControllerEdrrorInterceptor
     */
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
            .pipe(
                catchError(
                    (err: any) => {
                        console.log("Interceptor")
                        switch(err) {
                            case AuthServiceExceptions.UserExist:
                                throw new BadRequestException("User Exist")

                            case AuthServiceExceptions.UserNotFound:
                                throw new NotFoundException("User not found")

                            case AuthServiceExceptions.AdminExist:
                                throw new BadRequestException("Admin Exist")

                            case AuthServiceExceptions.AdminFailedAuth:
                                throw new BadRequestException("Failed to auth")

                            case AuthServiceExceptions.UserFailedAuth:
                                throw new BadRequestException("Failed to auth")

                            case AuthServiceExceptions.InvalidToken:
                                throw new UnauthorizedException("Invalid token")

                            case AuthServiceExceptions.TokenExpired:
                                throw new UnauthorizedException("Token expired")
                            
                            case AuthServiceExceptions.TokenNotFound:
                                throw new UnauthorizedException("Token not found")

                            default:
                                throw err
                        }
                    }
                )
            )
    }
}

/**
 * exception filter for auth controller
 *
 * @export
 * @class AllAuthServiceExceptionsFilter
 * @implements {ExceptionFilter}
 */
@Catch()
export class AllAuthServiceExceptionsFilter implements ExceptionFilter {
    /**
     * Creates an instance of AllAuthServiceExceptionsFilter.
     * @param {HttpAdapterHost} httpAdapterHost
     * @memberof AllAuthServiceExceptionsFilter
     */
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

    /**
     * catch exception and return http exception status code
     *
     * @param {*} exception
     * @param {ArgumentsHost} host
     * @memberof AllAuthServiceExceptionsFilter
     */
    catch(exception: any, host: ArgumentsHost) {
        const {httpAdapter} = this.httpAdapterHost
        const ctx = host.switchToHttp()

        let resp: string | object
        let statusCode: number

        if(exception instanceof HttpException) {
            resp = exception.getResponse()
            statusCode = exception.getStatus()
        } else {
            const newExpection = this.switchError(exception)
            resp = newExpection.getResponse()
            statusCode = newExpection.getStatus()
        }

        httpAdapter.reply(ctx.getResponse(), resp, statusCode)
    }

    /**
     * switch error to decode it to http exception
     *
     * @private
     * @param {*} e
     * @return {*}  {HttpException}
     * @memberof AllAuthServiceExceptionsFilter
     */
    private switchError(e: any): HttpException {
        switch(e) {
            case AuthServiceExceptions.UserExist:
                return new BadRequestException("User Exist")

            case AuthServiceExceptions.UserNotFound:
                return new NotFoundException("User not found")

            case AuthServiceExceptions.AdminExist:
                return new BadRequestException("Admin Exist")

            case AuthServiceExceptions.AdminFailedAuth:
                return new BadRequestException("Failed to auth")

            case AuthServiceExceptions.UserFailedAuth:
                return new BadRequestException("Failed to auth")

            case AuthServiceExceptions.InvalidToken:
                return new UnauthorizedException("Invalid token")

            case AuthServiceExceptions.TokenExpired:
                return new UnauthorizedException("Token expired")
            
            case AuthServiceExceptions.TokenNotFound:
                return new UnauthorizedException("Token not found")
        }
    }
}

/**
 *
 * class responce for http controller of working with auth
 * @export
 * @class AuthController
 */
@UseInterceptors(AuthControllerEdrrorInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    /**
     * Creates an instance of AuthController.
     * @param {AuthService} authService
     * @memberof AuthController
     */
    constructor(private readonly authService: AuthService) {}

    /**
     * create user
     *
     * @param {CreateUserDto} createUserDto
     * @return {*}  {Promise<UserCreateResp>}
     * @memberof AuthController
     */
    @Post('/user')
    @ApiOperation({summary: "Create user",})
    @ApiResponse({status: 400, description: "User exist"})
    @ApiResponse({status: 403, description: "You are not admin"})
    @ApiResponse({status: 201, description: "User created", type: UserCreateResp})
    @ApiBody({type: CreateUserDto})
    @ApiBearerAuth()
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserCreateResp> {
        return new UserCreateResp(await this.authService.createUser(createUserDto))
    }

    /**
     * delete user
     *
     * @param {number} id
     * @memberof AuthController
     */
    @Delete('/user/:id')
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "Delete user"})
    @ApiResponse({status: 404, description: "User not found"})
    @ApiResponse({status: 200, description: "User deleted"})
    @ApiParam({type: Number, description: "id of user", name: "id"})
    @ApiBearerAuth()
    async deleteUser(@Param('id') id: number) {
        const isDeleted = await this.authService.deleteUser(id)
        if(!isDeleted) {
            throw new NotFoundException("User not found")
        }
    }

    /**
     * return list of users
     *
     * @return {*}  {Promise<GetUsersResp[]>}
     * @memberof AuthController
     */
    @Get('/user')
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "get users"})
    @ApiResponse({status: 200, description: "", type: [GetUsersResp]})
    @ApiBearerAuth()
    async getUsers(): Promise<GetUsersResp[]> {
        return (await this.authService.getUsers()).map(
            (user) => {
                return new GetUsersResp(user)
            }
        )
    }

    /**
     * return user by id
     *
     * @param {number} id
     * @return {*} 
     * @memberof AuthController
     */
    @Get('/user/:id')
    @ApiOperation({summary: "get user"})
    @ApiResponse({status: 200, description: "", type: GetUsersResp})
    @ApiParam({name: 'id', type: () => Number, required: true})
    @ApiBearerAuth()
    async getUser(
        @Param('id') id: number
    ) {
        const user = await this.authService.getUser(id)
        if(!user) {
            throw new NotFoundException('User not found')
        }
        return new GetUsersResp(user)
    }

    /**
     * update user by id
     *
     * @param {number} id
     * @param {UpdateUserDto} req
     * @return {*}  {Promise<GetUsersResp>}
     * @memberof AuthController
     */
    @Put("/user/:id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "update user"})
    @ApiParam({type: Number, name: "id", description: "id of user"})
    @ApiBody({type: UpdateUserDto, description: "body"})
    @ApiResponse({status: 200, description: "user updatet", type: GetUsersResp})
    @ApiResponse({status: 404, description: "User not found"})
    @ApiResponse({status: 400, description: "User with this phone number exist"})
    @ApiBearerAuth()
    async updateUser(@Param("id") id: number, @Body() req: UpdateUserDto): Promise<GetUsersResp> {
        return new GetUsersResp(await this.authService.updateUser(id, req))
    }

    /**
     * create admin
     *
     * @param {CreateAdminDto} req
     * @return {*}  {Promise<CreateAdminResp>}
     * @memberof AuthController
     */
    @Post("/admin")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "create admin"})
    @ApiResponse({status: 400, description: "admin exist"})
    @ApiResponse({status: 403, description: "You are not admin"})
    @ApiResponse({status: 201, description: "Admin created", type: CreateAdminResp})
    @ApiBody({type: CreateAdminDto})
    @ApiBearerAuth()
    async createAdmin(@Body() req: CreateAdminDto): Promise<CreateAdminResp> {
        return new CreateAdminResp(await this.authService.createAdmin(req))
    }

    /**
     * update admin by id
     *
     * @param {number} id
     * @param {UpdateAdminDto} req
     * @return {*} 
     * @memberof AuthController
     */
    @Put("/admin/:id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "update admin"})
    @ApiParam({type: Number, name: "id", description: "id of admin"})
    @ApiBody({type: UpdateAdminDto, description: "body"})
    @ApiResponse({status: 200, description: "admin updated", type: GetAdminResp})
    @ApiResponse({status: 404, description: "Admin not found"})
    @ApiResponse({status: 400, description: "Admin with this email bad request"})
    @ApiBearerAuth()
    async updateAdmin(@Param("id") id: number, @Body() req: UpdateAdminDto) {
        return new GetAdminResp(await this.authService.updateAdmin(id, req))
    }

    /**
     * delete admin by id
     *
     * @param {number} id
     * @memberof AuthController
     */
    @Delete("/admin/:id")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "delete admin"})
    @ApiResponse({status: 404, description: "Admin not found"})
    @ApiResponse({status: 200, description: "Admin deleted"})
    @ApiParam({type: Number, description: "id of admin", name: 'id'})
    @ApiBearerAuth()
    async deleteAdmin(@Param('id') id: number) {
        const isDeleted = await this.authService.deleteAdmin(id)
        if(!isDeleted) {
            throw new NotFoundException("Admin not found")
        }
    }

    /**
     *
     * return list of admins
     * @return {*}  {Promise<GetAdminResp[]>}
     * @memberof AuthController
     */
    @Get("/admin")
    @Roles(Role.Admin)
    @UseGuards(RolesGuard)
    @ApiOperation({summary: "Get admins"})
    @ApiResponse({status: 200, description: "", type: [GetAdminResp]})
    @ApiBearerAuth()
    async getAdmins(): Promise<GetAdminResp[]> {
        return (await this.authService.getAdmins()).map(
            (admin) => {
                return new GetAdminResp(admin)
            }
        )
    }

    /**
     * test method to get sms code
     *
     * @param {*} phone
     * @return {*} 
     * @memberof AuthController
     */
    @Post("/testSms/:phone")
    @ApiParam({name: "phone", type: String})
    @ApiProduces('text/plain')
    @ApiResponse({type: String})
    async createSms(@Param("phone") phone) {
        return await this.authService.createSmsCode(phone)
    }

    /**
     * login admin
     *
     * @param {LoginAdminDto} req
     * @return {*}  {Promise<CreateTokenResp>}
     * @memberof AuthController
     */
    @Post("/admin/login")
    @ApiResponse({type: CreateTokenResp, status: 201})
    @ApiResponse({status: 400, description: "failed auth"})
    @ApiBody({type: LoginAdminDto, description: "body"})
    async loginAdmin(@Body() req: LoginAdminDto): Promise<CreateTokenResp> {
        const tokens = await this.authService.loginAdmin(req.email, req.password)

        return tokens
    }
    
    /**
     * login user
     *
     * @param {LoginUserDto} req
     * @return {*}  {Promise<CreateTokenResp>}
     * @memberof AuthController
     */
    @Post("/user/login")
    @ApiBody({type: LoginUserDto})
    @ApiResponse({status: 201, type: CreateTokenResp})
    @ApiResponse({status: 400, description: "failed to auth"})
    async loginUser(@Body() req: LoginUserDto): Promise<CreateTokenResp> {
        const tokens = await this.authService.loginUser(req.phoneNumber, req.code)

        return tokens
    }

    /**
     * check token 
     *
     * @param {CheckTokenDto} req
     * @memberof AuthController
     */
    @Post("/checkToken")
    @ApiBody({type: CheckTokenDto})
    @ApiResponse({status: 200})
    @ApiResponse({status: 401, description: "Not Authorizated"})
    @HttpCode(200)
    async checkToken(@Body() req: CheckTokenDto) {
        this.authService.decodeToken(req.token)
    }

    /**
     * refresh token
     *
     * @param {RefreshTokenDto} req
     * @return {*}  {Promise<CreateTokenResp>}
     * @memberof AuthController
     */
    @Post("/refreshToken")
    @ApiBody({type: RefreshTokenDto})
    @ApiResponse({status: 201, type: CreateTokenResp})
    @ApiResponse({status: 401, description: "Not Authorizated"})
    async refreshToken(@Body() req: RefreshTokenDto): Promise<CreateTokenResp> {
        return this.authService.refreshToken(req.refreshToken)
    }
}
