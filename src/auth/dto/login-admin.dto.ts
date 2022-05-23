import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

/**
 * Login admin body
 *
 * @export
 * @class LoginAdminDto
 */
export class LoginAdminDto {
    /**
     * admin email
     *
     * @type {string}
     * @memberof LoginAdminDto
     */
    @ApiProperty({example: "user@example.com"})
    @IsEmail()
    email: string

    /**
     * admin password
     *
     * @type {string}
     * @memberof LoginAdminDto
     */
    @ApiProperty({example:"qwerty"})
    @IsString()
    password: string
}