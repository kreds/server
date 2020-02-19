import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Generated } from 'typeorm';

import { Application } from './Application';
import { ApplicationEnvironmentUser } from './ApplicationEnvironmentUser';

@Entity()
export class ApplicationEnvironment {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated('uuid')
    @Column()
    uuid: string;

    @Column()
    secret: string;

    @ManyToOne(type => Application, application => application.environments, { nullable: false })
    application: Application;

    @OneToMany(type => ApplicationEnvironmentUser, environmentUser => environmentUser.environment, { cascade: true })
    environmentUsers: ApplicationEnvironmentUser[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}