import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Index, Unique } from 'typeorm';

import { Application } from './Application';
import { User } from './User';

@Entity()
@Unique([ 'user', 'application' ])
export class UserApplication {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Application, application => application.users, { nullable: false })
    application: Application;

    @ManyToOne(type => User, user => user.applications, { nullable: false })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}