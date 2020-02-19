import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class UserAuthenticationMethod {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    data: string;

    @ManyToOne(type => User, user => user.authenticationMethods, { nullable: false })
    user: User;
}