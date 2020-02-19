import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';

import { Application } from './Application';
import { Group } from './Group';
import { User } from './User';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(type => Permission, permission => permission.parent, { nullable: true })
    parent?: Permission;

    @OneToMany(type => Application, application => application.permissions, { nullable: true })
    application?: Application;

    @ManyToMany(type => Group, group => group.permissions)
    groups: Group[];

    @ManyToMany(type => User, user => user.permissions)
    users: User[];
}