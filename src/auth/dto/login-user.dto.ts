import { IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Login user body
 *
 * @export
 * @class LoginUserDto
 */
export class LoginUserDto {
    /**
     * phoneNumber
     *
     * @type {string}
     * @memberof LoginUserDto
     */
    @ApiProperty({example: "+7 (936) 134 14 24"})
    @IsPhoneNumber("RU")
    phoneNumber: string

    /**
     * sms code
     *
     * @type {string}
     * @memberof LoginUserDto
     */
    @ApiProperty({example: "0000"})
    @IsString()
    code: string
}