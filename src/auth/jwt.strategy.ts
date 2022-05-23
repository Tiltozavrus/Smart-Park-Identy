import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from '@nestjs/config';

/**
 * jwt strategy
 *
 * @export
 * @class JwtStrategy
 * @extends {PassportStrategy(Strategy)}
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Creates an instance of JwtStrategy.
     * @param {ConfigService} configService
     * @memberof JwtStrategy
     */
    constructor(
        private readonly configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("IDENTY_SECRET")
        });
    }

    /**
     * validate pyalaod
     *
     * @param {*} payload
     * @return {*} 
     * @memberof JwtStrategy
     */
    async validate(payload: any) {
        return { ...payload.role };
    }
}