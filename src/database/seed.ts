import { createConnection, getConnectionManager } from 'typeorm';

import ormconfig from '../../ormconfig';
import { User } from '../entities/User';
import { UserAuthenticationMethod } from '../entities/UserAuthenticationMethod';
import {
  AuthenticationRequestType,
  AuthenticationRequestPasswordSubtype,
} from '../models/AuthenticationRequest';
import { hashSync } from 'bcrypt';

async function seed() {
  const connection = await createConnection(ormconfig as any);

  const authenticationMethod = new UserAuthenticationMethod();
  authenticationMethod.type = AuthenticationRequestType.PASSWORD;
  authenticationMethod.subtype = AuthenticationRequestPasswordSubtype.BCRYPT;
  authenticationMethod.data = hashSync('admin', 12);

  const userRepository = connection.getRepository(User);
  const user = new User();
  user.name = 'admin';
  user.authenticationMethods = [authenticationMethod];
  userRepository.save(user);
}

seed();
