import { ApiProperty } from "@nestjs/swagger"


export class GetUsersResp {
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
    phoneNumber: string

    @ApiProperty({
        example: "Some name"
    })
    name: string
}