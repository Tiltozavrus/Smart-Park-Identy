import { ApiProperty } from "@nestjs/swagger";
import { IsPhoneNumber, IsString, ValidateIf } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({required: false, example: "+7 (936) 134 14 24"})
    @ValidateIf(o => o.phoneNumber)
    @IsPhoneNumber("RU", {})
    phoneNumber?: string

    @ApiProperty({required: false})
    @ValidateIf(o => o.name)
    @IsString({message: "should be a string"})
    name?: string
}