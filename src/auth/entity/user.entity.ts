import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUser } from "./baseuser.entity";

@Entity({name: "User"})
export class User {
    @OneToOne(() => BaseUser, {primary: true, onDelete: "CASCADE", eager: true})
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