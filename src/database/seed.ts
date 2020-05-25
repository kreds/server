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

  const developersGroup = new Group();
  developersGroup.name = 'Developers';
  developersGroup.permissions = [
    'applications.create',
    'applications.own.*',
    'authentication.authenticate',
  ];
  await groupRepository.save(developersGroup);

  const userGroup = new Group();
  userGroup.name = 'Users';
  userGroup.permissions = ['authentication.authenticate'];
  await groupRepository.save(userGroup);

  const authenticationMethod = new UserAuthenticationMethod();
  authenticationMethod.type = AuthenticationRequestType.PASSWORD;
  authenticationMethod.subtype = AuthenticationRequestPasswordSubtype.BCRYPT;
  authenticationMethod.data = hashSync('admin', 12);

  const systemPermissions: { name: string; description: string }[] = [
    { name: 'authentication.authenticate', description: 'Log in.' },
    { name: 'users.list', description: 'See a list of users.' },
    { name: 'users.create', description: 'Create a new user.' },
    { name: 'users.update', description: 'Update an existing user.' },
    { name: 'users.delete', description: 'Delete an existing user.' },
    { name: 'groups.list', description: 'See a list of groups.' },
    { name: 'groups.create', description: 'Create a new group.' },
    { name: 'groups.update', description: 'Update an existing group.' },
    { name: 'groups.delete', description: 'Delete an existing group.' },
    { name: 'permissions.list', description: 'See a list of permissions.' },
    { name: 'permissions.create', description: 'Create a new permission.' },
    {
      name: 'permissions.update',
      description: 'Update an existing permission.',
    },
    {
      name: 'permissions.delete',
      description: 'Delete an existing permission.',
    },
    { name: 'applications.list', description: 'See a list of applications.' },
    { name: 'applications.create', description: 'Create a new application.' },
    {
      name: 'applications.update',
      description: 'Update any existing application.',
    },
    {
      name: 'applications.delete',
      description: 'Delete any existing application.',
    },
    {
      name: 'applications.own.list',
      description: 'See owned applications.',
    },
    {
      name: 'applications.own.update',
      description: 'Update an owned application.',
    },
    {
      name: 'applications.own.delete',
      description: 'Delete an owned application.',
    },
  ];

  const permissionRepository = connection.getRepository(Permission);
  for (let perm of systemPermissions) {
    const permission = new Permission();
    permission.name = perm.name;
    permission.description = perm.description;
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
