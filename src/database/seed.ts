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
import { Permission } from '../entities/Permission';

export async function seed(ormconfig: any) {
  const connection = await createConnection(ormconfig);

  const groupRepository = connection.getRepository(Group);

  const superuserGroup = new Group();
  superuserGroup.name = 'Superusers';
  superuserGroup.permissions = ['*'];
  await groupRepository.save(superuserGroup);

  const userGroup = new Group();
  userGroup.name = 'Users';
  userGroup.permissions = [];
  await groupRepository.save(userGroup);

  const authenticationMethod = new UserAuthenticationMethod();
  authenticationMethod.type = AuthenticationRequestType.PASSWORD;
  authenticationMethod.subtype = AuthenticationRequestPasswordSubtype.BCRYPT;
  authenticationMethod.data = hashSync('admin', 12);

  const systemPermissions = ['users.list'];

  const permissionRepository = connection.getRepository(Permission);
  for (let perm of systemPermissions) {
    const permission = new Permission();
    permission.name = perm;
    await permissionRepository.save(permission);
  }

  const userRepository = connection.getRepository(User);
  const user = new User();
  user.name = 'admin';
  user.authenticationMethods = [authenticationMethod];
  user.groups = [superuserGroup, userGroup];
  await userRepository.save(user);
}

if (require.main === module) {
  seed(ormconfig as any);
}
