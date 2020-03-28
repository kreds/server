import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Generated,
  Index,
  Unique,
} from 'typeorm';

import { Application } from './Application';
import { ApplicationEnvironmentUser } from './ApplicationEnvironmentUser';

@Entity()
@Unique(['application', 'name'])
export class ApplicationEnvironment {
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

  @Column()
  secret: string;

  @ManyToOne(type => Application, application => application.environments, {
    nullable: false,
  })
  application: Application;

  @OneToMany(
    type => ApplicationEnvironmentUser,
    environmentUser => environmentUser.environment,
    { cascade: true }
  )
  environmentUsers: ApplicationEnvironmentUser[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
