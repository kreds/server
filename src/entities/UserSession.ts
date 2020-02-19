import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

import { User } from './User';

@Entity()
export class UserSession {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.sessions, { nullable: false })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column('timestamp', { nullable: true })
    expiresAt?: Date;
}