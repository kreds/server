import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, Index, Generated, Unique } from 'typeorm';

import { Application } from './Application';
import { Group } from './Group';
import { User } from './User';

@Entity()
@Unique([ 'application', 'parent', 'name' ])
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Generated('uuid')
    @Column()
    uuid: string;

    @Column()
    name: string;
    
    @ManyToOne(type => Permission, permission => permission.parent, { nullable: true })
    parent?: Permission;

    @ManyToOne(type => Application, application => application.permissions, { nullable: true })
    application?: Application;

    @ManyToMany(type => Group, group => group.permissions)
    groups: Group[];

    @ManyToMany(type => User, user => user.permissions)
    users: User[];
}