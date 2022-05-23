import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseUser } from "./baseuser.entity";

/**
 * Admin entity represantation
 *
 * @export
 * @class Admin
 */
@Entity({name: "Admin"})
export class Admin {
    /**
     * edge to base user
     *
     * @type {BaseUser}
     * @memberof Admin
     */
    @OneToOne(() => BaseUser, {primary: true, eager: true, onDelete: "CASCADE", onUpdate: "CASCADE", })
    @JoinColumn()
    baseUser: BaseUser;

    /**
     * id getter
     *
     * @readonly
     * @type {number}
     * @memberof Admin
     */
    get id(): number {
        return this.baseUser.id
    }

    /**
     * unique email
     *
     * @type {string}
     * @memberof Admin
     */
    @Column({unique: true})
    email: string;

    /**
     * admin password
     *
     * @type {string}
     * @memberof Admin
     */
    @Column()
    password: string;
}