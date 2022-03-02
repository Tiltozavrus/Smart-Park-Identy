import { ApiProperty } from "@nestjs/swagger"
import { IsPhoneNumber, IsString, Length } from "class-validator"

export class CreateUserDto {
    @ApiProperty({
            example: "+7 (936) 134 14 24",
    })
    @IsPhoneNumber("RU")
    phoneNumber: string

    @ApiProperty()
    @IsString({message: "should be a string"})
    name: string
}


export class UserCreateResp {
    constructor(user: {id: number, phoneNumber: string, name: string}) {
        this.id = user.id
        this.phoneNumber = user.phoneNumber
        this.name = user.name
    }

    @ApiProperty({
        example: 1,
    })
    id: number

    @ApiProperty({
        example: "81375461323",
    })
    phoneNumber: string;

    @ApiProperty({
        example: "Some name"
    })
    name: string;
}