import { ApiProperty } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty()
    phoneNumber: string

    @ApiProperty()
    name: string
}