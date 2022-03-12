import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUser } from "./baseuser.entity";
import { UserSmsCode } from "./user_sms_code.entity";

@Entity({name: "User"})
export class User {
    @OneToOne(() => BaseUser, type => type, {primary: true, onDelete: "CASCADE", eager: true})
    @JoinColumn()
    baseUser: BaseUser;

    get id(): number {
        return this.baseUser.id
    }

    @Column({length: 18, unique: true})
    phoneNumber: string;

    @Column()
    name: string;
}