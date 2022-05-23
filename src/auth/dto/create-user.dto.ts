import { ApiProperty } from "@nestjs/swagger"
import { IsPhoneNumber, IsString, Length } from "class-validator"

/**
 * Create user body
 *
 * @export
 * @class CreateUserDto
 */
export class CreateUserDto {
    /**
     * phoneNumber
     *
     * @type {string}
     * @memberof CreateUserDto
     */
    @ApiProperty({
            example: "+7 (936) 134 14 24",
    })
    @IsPhoneNumber("RU")
    phoneNumber: string

    /**
     * name of user
     *
     * @type {string}
     * @memberof CreateUserDto
     */
    @ApiProperty()
    @IsString({message: "should be a string"})
    name: string
}


/**
 * create user responce
 *
 * @export
 * @class UserCreateResp
 */
export class UserCreateResp {
    /**
     * Creates an instance of UserCreateResp.
     * @param {{id: number, phoneNumber: string, name: string}} user
     * @memberof UserCreateResp
     */
    constructor(user: {id: number, phoneNumber: string, name: string}) {
        this.id = user.id
        this.phoneNumber = user.phoneNumber
        this.name = user.name
    }

    /**
     * user id
     *
     * @type {number}
     * @memberof UserCreateResp
     */
    @ApiProperty({
        example: 1,
    })
    id: number

    /**
     * user phone nubmer
     *
     * @type {string}
     * @memberof UserCreateResp
     */
    @ApiProperty({
        example: "81375461323",
    })
    phoneNumber: string;

    /**
     * user name
     *
     * @type {string}
     * @memberof UserCreateResp
     */
    @ApiProperty({
        example: "Some name"
    })
    name: string;
}