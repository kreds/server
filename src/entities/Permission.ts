import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';

import { Application } from './Application';

@Entity()
@Unique(['application', 'name'])
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(type => Application, application => application.permissions, {
    nullable: true,
  })
  application?: Application;
}
