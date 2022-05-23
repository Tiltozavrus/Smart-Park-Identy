import { ApiProperty } from "@nestjs/swagger"


/**
 * get user responce
 *
 * @export
 * @class GetUsersResp
 */
export class GetUsersResp {
    /**
     * Creates an instance of GetUsersResp.
     * @param {{id: number, phoneNumber: string, name: string}} user
     * @memberof GetUsersResp
     */
    constructor(user: {id: number, phoneNumber: string, name: string}) {
        this.id = user.id
        this.phoneNumber = user.phoneNumber
        this.name = user.name
    }
    
    /**
     * user id
     *
     * @type {number}
     * @memberof GetUsersResp
     */
    @ApiProperty({
        example: 1,
    })
    id: number

    /**
     * user phoneNubmer
     *
     * @type {string}
     * @memberof GetUsersResp
     */
    @ApiProperty({
        example: "81375461323",
    })
    phoneNumber: string

    /**
     * user name
     *
     * @type {string}
     * @memberof GetUsersResp
     */
    @ApiProperty({
        example: "Some name"
    })
    name: string
}