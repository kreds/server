import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Generated,
  Index,
} from 'typeorm';

import { ApplicationEnvironmentUser } from './ApplicationEnvironmentUser';
import { Group } from './Group';
import { UserApplication } from './UserApplication';
import { UserAuthenticationMethod } from './UserAuthenticationMethod';
import { Session } from './Session';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Index({ unique: true })
  @Generated('uuid')
  @Column()
  uuid: string;

  @Index({ unique: true })
  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  fullName?: string;

  @ManyToMany(type => Group, group => group.users)
  groups: Group[];

  @Column('simple-json', { nullable: true })
  permissions: string[];

  @Column({ nullable: true })
  twoFactorSecret?: string;

  @OneToMany(
    type => UserAuthenticationMethod,
    authenticationMethod => authenticationMethod.user,
    { cascade: true }
  )
  authenticationMethods: UserAuthenticationMethod[];

  @OneToMany(type => UserApplication, application => application.user, {
    cascade: true,
  })
  applications: UserApplication[];

  @OneToMany(
    type => ApplicationEnvironmentUser,
    environmentUser => environmentUser.user,
    { cascade: true }
  )
  usedApplicationEnvironments: ApplicationEnvironmentUser[];

  @OneToMany(type => Session, session => session.user, { cascade: true })
  sessions: Session[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
