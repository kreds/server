import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Generated,
  Index,
  Unique,
} from 'typeorm';

import { Application } from './Application';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
@Unique(['application', 'name'])
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column()
  uuid: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(type => Group, group => group.parent, { nullable: true })
  parent?: Group;

  @ManyToOne(type => Application, application => application.groups, {
    nullable: true,
  })
  application?: Application;

  @ManyToMany(type => User, user => user.groups)
  @JoinTable()
  users: User[];

  @Column('simple-json', { nullable: true })
  permissions: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
