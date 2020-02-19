import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, Index, Generated } from 'typeorm';

import { Application } from './Application';
import { Group } from './Group';
import { User } from './User';

@Index(['name', 'parent'], { unique: true })
@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Generated('uuid')
    @Column()
    uuid: string;

    @Column()
    name: string;
    
    @OneToMany(type => Permission, permission => permission.parent, { nullable: true })
    parent?: Permission;

    @OneToMany(type => Application, application => application.permissions, { nullable: true })
    application?: Application;

    @ManyToMany(type => Group, group => group.permissions)
    groups: Group[];

    @ManyToMany(type => User, user => user.permissions)
    users: User[];
}