import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

/**
 * create admin req body
 *
 * @export
 * @class CreateAdminDto
 */
export class CreateAdminDto {
    /**
     * email
     *
     * @type {string}
     * @memberof CreateAdminDto
     */
    @ApiProperty({example: "user.name@example.com"})
    @IsEmail({},{message: "email is not valid"})
    email: string

    /**
     * password
     *
     * @type {string}
     * @memberof CreateAdminDto
     */
    @ApiProperty({example: "qwerty"})
    @IsString({message: ""})
    password: string
}

/**
 * create admin responce
 *
 * @export
 * @class CreateAdminResp
 */
export class CreateAdminResp {
    /**
     * Creates an instance of CreateAdminResp.
     * @param {{id: number, email: string}} admin
     * @memberof CreateAdminResp
     */
    constructor(admin: {id: number, email: string}) {
        this.id = admin.id
        this.email = admin.email
    }   
    /**
     * admin id
     *
     * @type {number}
     * @memberof CreateAdminResp
     */
    @ApiProperty({example: 1})
    id: number

    /**
     * admin email
     *
     * @type {string}
     * @memberof CreateAdminResp
     */
    @ApiProperty({example: "user.name@example.com"})
    email: string
}