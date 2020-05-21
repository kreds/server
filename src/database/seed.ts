import { createConnection } from 'typeorm';
import { hashSync } from 'bcrypt';

import ormconfig from '../../ormconfig';
import { User } from '../entities/User';
import { UserAuthenticationMethod } from '../entities/UserAuthenticationMethod';
import {
  AuthenticationRequestType,
  AuthenticationRequestPasswordSubtype,
} from '../models/AuthenticationRequest';
import { Group } from '../entities/Group';

async function seed() {
  const connection = await createConnection(ormconfig as any);

  const groupRepository = connection.getRepository(Group);

  const superuserGroup = new Group();
  superuserGroup.name = 'Superusers';
  superuserGroup.permissions = ['*'];
  groupRepository.save(superuserGroup);

  const userGroup = new Group();
  userGroup.name = 'Users';
  userGroup.permissions = [];
  groupRepository.save(userGroup);

  const authenticationMethod = new UserAuthenticationMethod();
  authenticationMethod.type = AuthenticationRequestType.PASSWORD;
  authenticationMethod.subtype = AuthenticationRequestPasswordSubtype.BCRYPT;
  authenticationMethod.data = hashSync('admin', 12);

  const userRepository = connection.getRepository(User);
  const user = new User();
  user.name = 'admin';
  user.authenticationMethods = [authenticationMethod];
  user.groups = [superuserGroup, userGroup];
  userRepository.save(user);
}

seed();
