import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, ValidateIf } from "class-validator";

/**
 * update user
 *
 * @export
 * @class UpdateUserDto
 */
export class UpdateUserDto {
    /**
     * phone number
     *
     * @type {string}
     * @memberof UpdateUserDto
     */
    @ApiProperty({required: false, example: "+7 (936) 134 14 24"})
    @ValidateIf(o => o.phoneNumber)
    @IsPhoneNumber("RU", {})
    phoneNumber?: string

    /**
     * name of user
     *
     * @type {string}
     * @memberof UpdateUserDto
     */
    @ApiProperty({required: false})
    @ValidateIf(o => o.name)
    @IsString({message: "should be a string"})
    name?: string
}