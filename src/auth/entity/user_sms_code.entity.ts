import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name: "UserSMSCodes"})
export class UserSmsCode {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(() => User, user => user, {eager: true,})
    @JoinColumn({name: "userId"})
    user: User

    @Column({name:"smsCode"})
    smsCode: string
}