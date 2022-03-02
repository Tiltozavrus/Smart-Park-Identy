import { ArgumentsHost, BadRequestException, Body, CallHandler, Catch, Controller, Delete, ExceptionFilter, ExecutionContext, Get, HttpCode, NestInterceptor, NotFoundException, Param, Post, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { catchError, Observable } from 'rxjs';
import { AuthService, AuthServiceExceptions } from './auth.service';
import { CreateUserDto, UserCreateResp } from './dto';
import { CreateAdminDto, CreateAdminResp } from './dto/create-admin.dto';
import { GetAdminResp } from './dto/get-admin.dto';
import { GetUsersResp } from './dto/get-user.dto';
import { User } from './entity';

class AuthControllerErrorInterceptor implements NestInterceptor {
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
                            default:
                                throw err
                        }
                    }
                )
            )
    }

}

@UseInterceptors(AuthControllerErrorInterceptor)
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

    @Post("/admin")
    @ApiOperation({summary: "create admin"})
    @ApiResponse({status: 400, description: "admin exist"})
    @ApiResponse({status: 403, description: "You are not admin"})
    @ApiResponse({status: 201, description: "Admin created", type: CreateAdminResp})
    @ApiBody({type: CreateAdminDto})
    async createAdmin(@Body() req: CreateAdminDto): Promise<CreateAdminResp> {
        return new CreateAdminResp(await this.authService.createAdmin(req))
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
    
}
