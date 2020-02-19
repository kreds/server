import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';

import { Application } from './Application';
import { ApplicationEnvironment } from './ApplicationEnvironment';
import { User } from './User';

@Entity()
@Unique([ 'environment', 'user' ])
export class ApplicationEnvironmentUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    secret: string;

    @ManyToOne(type => Application, application => application.environmentUsers, { nullable: false })
    application: Application;

    @ManyToOne(type => ApplicationEnvironment, environment => environment.environmentUsers, { nullable: false })
    environment: ApplicationEnvironment;

    @ManyToOne(type => User, user => user.usedApplicationEnvironments, { nullable: false })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}