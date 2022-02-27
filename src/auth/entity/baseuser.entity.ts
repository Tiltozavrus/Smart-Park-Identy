import {Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class BaseUser {
    @PrimaryGeneratedColumn()
    id: number;
}
