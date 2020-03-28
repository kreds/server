import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Unique,
} from 'typeorm';
import { User } from './User';

@Entity()
@Unique(['user', 'type', 'subtype'])
export class UserAuthenticationMethod {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  subtype: string;

  @Column()
  data: string;

  @ManyToOne(type => User, user => user.authenticationMethods, {
    nullable: false,
  })
  user: User;
}
