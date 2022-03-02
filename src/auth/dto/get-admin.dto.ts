import { ApiProperty } from "@nestjs/swagger";


export class GetAdminResp {
    constructor(admin: {id: number, email: string}) {
        this.id = admin.id
        this.email = admin.email
    }
    @ApiProperty({
        example: 1,
    })
    id: number

    @ApiProperty({
        example: "user@example.com",
    })
    email: string
}