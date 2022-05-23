import { ApiProperty } from "@nestjs/swagger";


/**
 * admin responce
 *
 * @export
 * @class GetAdminResp
 */
export class GetAdminResp {
    /**
     * Creates an instance of GetAdminResp.
     * @param {{id: number, email: string}} admin
     * @memberof GetAdminResp
     */
    constructor(admin: {id: number, email: string}) {
        this.id = admin.id
        this.email = admin.email
    }
    /**
     * admin id
     *
     * @type {number}
     * @memberof GetAdminResp
     */
    @ApiProperty({
        example: 1,
    })
    id: number

    /**
     * user email
     *
     * @type {string}
     * @memberof GetAdminResp
     */
    @ApiProperty({
        example: "user@example.com",
    })
    email: string
}