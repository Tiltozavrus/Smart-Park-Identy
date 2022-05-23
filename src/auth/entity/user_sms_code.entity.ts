import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

/**
 * user sms code entity represantation
 *
 * @export
 * @class UserSmsCode
 */
@Entity({name: "UserSMSCodes"})
export class UserSmsCode {
    /**
     * identifier of entity
     *
     * @type {number}
     * @memberof UserSmsCode
     */
    @PrimaryGeneratedColumn()
    id: number

    /**
     * edge to user
     *
     * @type {User}
     * @memberof UserSmsCode
     */
    @OneToOne(() => User, user => user, {eager: true,})
    @JoinColumn({name: "userId"})
    user: User

    /**
     * sms code
     *
     * @type {string}
     * @memberof UserSmsCode
     */
    @Column({name:"smsCode"})
    smsCode: string
}