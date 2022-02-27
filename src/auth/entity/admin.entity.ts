import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUser } from "./baseuser.entity";

@Entity()
export class Admin {
    @OneToOne(() => BaseUser, {primary: true})
    @JoinColumn()
    baseUser: BaseUser;

    @Column()
    email: string;

    @Column()
    password: string;
}