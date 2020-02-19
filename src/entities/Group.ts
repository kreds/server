import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany, Generated, Index } from 'typeorm';

import { Application } from './Application';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Group {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Generated('uuid')
    @Column()
    uuid: string;

    @Index({ unique: true })
    @Column()
    name: string;
    
    @OneToMany(type => Group, group => group.parent, { nullable: true })
    parent?: Group;

    @OneToMany(type => Application, application => application.groups, { nullable: true })
    application?: Application;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable()
    users: User[];

    @ManyToMany(type => Permission, permission => permission.groups)
    @JoinTable()
    permissions: Permission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}