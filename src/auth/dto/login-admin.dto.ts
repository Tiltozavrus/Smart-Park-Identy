import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class LoginAdminDto {
    @ApiProperty({example: "user@example.com"})
    @IsEmail()
    email: string

    @ApiProperty({example:"qwerty"})
    @IsString()
    password: string
}