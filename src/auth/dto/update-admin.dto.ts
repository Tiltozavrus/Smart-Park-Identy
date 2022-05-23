import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, ValidateIf } from "class-validator"

/**
 * Update user body
 *
 * @export
 * @class UpdateAdminDto
 */
export class UpdateAdminDto {
    /**
     * email of user
     *
     * @type {string}
     * @memberof UpdateAdminDto
     */
    @ApiProperty({example: "user.name@example.com", required: false})
    @ValidateIf( o => o.email)
    @IsEmail({},{message: "email is not valid"})
    email?: string

    /**
     * user password
     *
     * @type {string}
     * @memberof UpdateAdminDto
     */
    @ApiProperty({example: "qwerty", required: false})
    @ValidateIf(o => o.name)
    @IsString({message: ""})
    password?: string
}