import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class CreateAdminDto {
    @ApiProperty({example: "user.name@example.com"})
    @IsEmail({},{message: "email is not valid"})
    email: string

    @ApiProperty({example: "qwerty"})
    @IsString({message: ""})
    password: string
}

export class CreateAdminResp {
    constructor(admin: {id: number, email: string}) {
        this.id = admin.id
        this.email = admin.email
    }   
    @ApiProperty({example: 1})
    id: number

    @ApiProperty({example: "user.name@example.com"})
    email: string
}