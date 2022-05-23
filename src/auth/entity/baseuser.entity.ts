import {Entity, PrimaryGeneratedColumn} from 'typeorm';

/**
 * base user entity representaion
 *
 * @export
 * @class BaseUser
 */
@Entity({name: "BaseUser"})
export class BaseUser {
    /**
     * id of user
     *
     * @type {number}
     * @memberof BaseUser
     */
    @PrimaryGeneratedColumn()
    id: number;
}
