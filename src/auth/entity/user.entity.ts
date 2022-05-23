import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUser } from "./baseuser.entity";
import { UserSmsCode } from "./user_sms_code.entity";

/**
 * user entity represantation
 *
 * @export
 * @class User
 */
@Entity({name: "User"})
export class User {
    /**
     * edge to base user
     *
     * @type {BaseUser}
     * @memberof User
     */
    @OneToOne(() => BaseUser, type => type, {primary: true, onDelete: "CASCADE", eager: true})
    @JoinColumn()
    baseUser: BaseUser;

    /**
     * id getter
     *
     * @readonly
     * @type {number}
     * @memberof User
     */
    get id(): number {
        return this.baseUser.id
    }

    /**
     * unique phone number
     *
     * @type {string}
     * @memberof User
     */
    @Column({length: 18, unique: true})
    phoneNumber: string;

    /**
     * name of user
     *
     * @type {string}
     * @memberof User
     */
    @Column()
    name: string;
}