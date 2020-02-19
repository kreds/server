import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Generated } from 'typeorm';

import { ApplicationEnvironment } from './ApplicationEnvironment';
import { ApplicationEnvironmentUser } from './ApplicationEnvironmentUser';
import { UserApplication } from './UserApplication';
import { Group } from './Group';
import { Permission } from './Permission';

@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    id: number;

    @Generated('uuid')
    @Column()
    uuid: string;

    @Column()
    name: string;

    @OneToMany(type => ApplicationEnvironment, applicationEnvironment => applicationEnvironment.application, { cascade: true })
    environments: ApplicationEnvironment[];

    @OneToMany(type => ApplicationEnvironmentUser, applicationEnvironmentUser => applicationEnvironmentUser.application, { cascade: true })
    environmentUsers: ApplicationEnvironmentUser[];

    @OneToMany(type => UserApplication, user => user.application, { cascade: true })
    users: UserApplication[];

    @OneToMany(type => Group, group => group.application, { cascade: true })
    groups: Group[];

    @OneToMany(type => Permission, permission => permission.application, { cascade: true })
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}