import { Column, Entity, JoinColumn, OneToOne, Unique } from "typeorm";
import { BaseUser } from "./baseuser.entity";

@Entity({name: "Admin"})
export class Admin {
    @OneToOne(() => BaseUser, {primary: true, eager: true, onDelete: "CASCADE"})
    @JoinColumn()
    baseUser: BaseUser;

    get id(): number {
        return this.baseUser.id
    }

    @Column({unique: true})
    email: string;

    @Column()
    password: string;
}