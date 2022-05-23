import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Observable } from "rxjs";
import { AuthService, AuthServiceExceptions } from "./auth.service";
import { Role } from "./roles";
import { ROLES_KEY } from "./roles.decorator";

/**
 * class to validate role to access to method
 *
 * @export
 * @class RolesGuard
 * @implements {CanActivate}
 */
@Injectable()
export class RolesGuard implements CanActivate {
    /**
     * Creates an instance of RolesGuard.
     * @param {Reflector} reflector
     * @param {AuthService} authService
     * @memberof RolesGuard
     */
    constructor (private reflector: Reflector, private readonly authService: AuthService) {}

    /**
     * check role of user to decide can they launch method
     *
     * @param {ExecutionContext} context
     * @return {*}  {(boolean | Promise<boolean> | Observable<boolean>)}
     * @memberof RolesGuard
     */
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        )

        const req = context.switchToHttp().getRequest<Request>()
        const authHeader = req.headers.authorization
        try {
            if(authHeader === undefined) {
                throw AuthServiceExceptions.TokenNotFound
            }
            const token = authHeader.split(" ")[1]
            const decoded = this.authService.decodeToken(token)

            if(!requiredRoles) {
                return true
            }


            return requiredRoles.some((role) => decoded.payload.payload.role.includes(role))
        } catch(e) {
            switch(e) {
                case AuthServiceExceptions.InvalidToken, AuthServiceExceptions.TokenExpired, AuthServiceExceptions.TokenNotFound:
                    throw e
            }
            return false
        }
    }

}