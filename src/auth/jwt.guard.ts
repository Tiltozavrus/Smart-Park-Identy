import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";


/**
 * jwt guard
 *
 * @export
 * @class JwtGuard
 * @extends {AuthGuard('jwt')}
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    
}