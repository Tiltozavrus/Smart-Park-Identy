import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { BaseUser } from "./baseuser.entity";

@Entity()
export class User {
    @OneToOne(() => BaseUser, {primary: true})
    @JoinColumn()
    baseUser: BaseUser;

    @Column({length: 18})
    phoneNumber: string;

    @Column()
    name: string;
}