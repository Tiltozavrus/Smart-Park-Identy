import { IsPhoneNumber, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({example: "+7 (936) 134 14 24"})
    @IsPhoneNumber("RU")
    phoneNumber: string

    @ApiProperty({example: "0000"})
    @IsString()
    code: string
}