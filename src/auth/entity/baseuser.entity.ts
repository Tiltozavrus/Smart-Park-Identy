import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: "BaseUser"})
export class BaseUser {
    @PrimaryGeneratedColumn()
    id: number;
}
