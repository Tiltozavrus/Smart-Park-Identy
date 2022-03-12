import { ArgumentsHost, BadRequestException, Body, CallHandler, Catch, Controller, Delete, ExceptionFilter, ExecutionContext, Get, HttpCode, NestInterceptor, NotFoundException, Param, Post, Put, UseFilters, UseInterceptors,  UnauthorizedException} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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

class AuthControllerEdrrorInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        return next.handle()
            .pipe(
                catchError(
                    (err: any) => {
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

                            default:
                                throw err
                        }
                    }
                )
            )
    }

}

@UseInterceptors(AuthControllerEdrrorInterceptor)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/user')
    @ApiOperation({summary: "Create user"})
    @ApiResponse({status: 400, description: "User exist"})
    @ApiResponse({status: 403, description: "You are not admin"})
    @ApiResponse({status: 201, description: "User created", type: UserCreateResp})
    @ApiBody({type: CreateUserDto})
    async createUser(@Body() createUserDto: CreateUserDto): Promise<UserCreateResp> {
        return new UserCreateResp(await this.authService.createUser(createUserDto))
    }

    @Delete('/user/:id')
    @ApiOperation({summary: "Delete user"})
    @ApiResponse({status: 404, description: "User not found"})
    @ApiResponse({status: 200, description: "User deleted"})
    @ApiParam({type: Number, description: "id of user", name: "id"})
    async deleteUser(@Param('id') id: number) {
        const isDeleted = await this.authService.deleteUser(id)
        if(!isDeleted) {
            throw new NotFoundException("User not found")
        }
    }

    @Get('/user')
    @ApiOperation({summary: "get users"})
    @ApiResponse({status: 200, description: "", type: [GetUsersResp]})
    async getUser(): Promise<GetUsersResp[]> {
        return (await this.authService.getUsers()).map(
            (user) => {
                return new GetUsersResp(user)
            }
        )
    }

    @Put("/user/:id")
    @ApiOperation({summary: "update user"})
    @ApiParam({type: Number, name: "id", description: "id of user"})
    @ApiBody({type: UpdateUserDto, description: "body"})
    @ApiResponse({status: 200, description: "user updatet", type: GetUsersResp})
    @ApiResponse({status: 404, description: "User not found"})
    @ApiResponse({status: 400, description: "User with this phone number exist"})
    async updateUser(@Param("id") id: number, @Body() req: UpdateUserDto): Promise<GetUsersResp> {
        return new GetUsersResp(await this.authService.updateUser(id, req))
    }

    @Post("/admin")
    @ApiOperation({summary: "create admin"})
    @ApiResponse({status: 400, description: "admin exist"})
    @ApiResponse({status: 403, description: "You are not admin"})
    @ApiResponse({status: 201, description: "Admin created", type: CreateAdminResp})
    @ApiBody({type: CreateAdminDto})
    async createAdmin(@Body() req: CreateAdminDto): Promise<CreateAdminResp> {
        return new CreateAdminResp(await this.authService.createAdmin(req))
    }

    @Put("/admin/:id")
    @ApiOperation({summary: "update admin"})
    @ApiParam({type: Number, name: "id", description: "id of admin"})
    @ApiBody({type: UpdateAdminDto, description: "body"})
    @ApiResponse({status: 200, description: "admin updated", type: GetAdminResp})
    @ApiResponse({status: 404, description: "Admin not found"})
    @ApiResponse({status: 400, description: "Admin with this email bad request"})
    async updateAdmin(@Param("id") id: number, @Body() req: UpdateAdminDto) {
        return new GetAdminResp(await this.authService.updateAdmin(id, req))
    }

    @Delete("/admin/:id")
    @ApiOperation({summary: "delete admin"})
    @ApiResponse({status: 404, description: "Admin not found"})
    @ApiResponse({status: 200, description: "Admin deleted"})
    @ApiParam({type: Number, description: "id of admin", name: 'id'})
    async deleteAdmin(@Param('id') id: number) {
        const isDeleted = await this.authService.deleteAdmin(id)
        if(!isDeleted) {
            throw new NotFoundException("Admin not found")
        }
    }

    @Get("/admin")
    @ApiOperation({summary: "Get admins"})
    @ApiResponse({status: 200, description: "", type: [GetAdminResp]})
    async getAdmins(): Promise<GetAdminResp[]> {
        return (await this.authService.getAdmins()).map(
            (admin) => {
                return new GetAdminResp(admin)
            }
        )
    }

    @Post("/testSms/:phone")
    @ApiParam({name: "phone", type: String})
    async createSms(@Param("phone") phone) {
        return await this.authService.createSmsCode(phone)
    }

    @Post("/admin/login")
    @ApiResponse({type: CreateTokenResp, status: 201})
    @ApiResponse({status: 400, description: "failed auth"})
    @ApiBody({type: LoginAdminDto, description: "body"})
    async loginAdmin(@Body() req: LoginAdminDto): Promise<CreateTokenResp> {
        const tokens = await this.authService.loginAdmin(req.email, req.password)

        return tokens
    }
    
    @Post("/user/login")
    @ApiBody({type: LoginUserDto})
    @ApiResponse({status: 201, type: CreateTokenResp})
    @ApiResponse({status: 400, description: "failed to auth"})
    async loginUser(@Body() req: LoginUserDto): Promise<CreateTokenResp> {
        const tokens = await this.authService.loginUser(req.phoneNumber, req.code)

        return tokens
    }

    @Post("/checkToken")
    @ApiBody({type: CheckTokenDto})
    @ApiResponse({status: 200})
    @ApiResponse({status: 401, description: "Not Authorizated"})
    @HttpCode(200)
    async checkToken(@Body() req: CheckTokenDto) {
        this.authService.decodeToken(req.token)
    }

    @Post("/refreshToken")
    @ApiBody({type: RefreshTokenDto})
    @ApiResponse({status: 201, type: CreateTokenResp})
    @ApiResponse({status: 401, description: "Not Authorizated"})
    async refreshToken(@Body() req: RefreshTokenDto): Promise<CreateTokenResp> {
        return this.authService.refreshToken(req.refreshToken)
    }
}
