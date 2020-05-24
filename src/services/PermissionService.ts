import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import matcher from 'matcher';

import { Permission } from '../entities/Permission';
import { GroupService } from './GroupService';
import { ApplicationService } from './ApplicationService';
import { Application } from '../entities/Application';
import { User } from '../entities/User';

@Service()
export class PermissionService {
  @OrmRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @OrmRepository(User)
  private userRepository: Repository<User>;

  @Inject()
  private groupService: GroupService;

  @Inject()
  private applicationService: ApplicationService;

  private systemNamespaces = ['kreds'];

  /**
   * Cache of permissions allowed for a given user uuid.
   */
  private userPermissionCache: Record<string, string[]> = {};

  /**
   * Cache of permissions allowed for a given group uuid.
   */
  private groupPermissionCache: Record<string, string[]> = {};

  /**
   * Cache of permissions by namespace.
   */
  private permissionCache: Record<string, string[]> = {};

  async byId(id: number) {
    return await this.permissionRepository.findOne(id);
  }

  async byUuid(uuid: string) {
    return await this.permissionRepository.findOne({ where: { uuid: uuid } });
  }

  async all() {
    return await this.permissionRepository.find();
  }

  async add(name: string, application?: Application) {
    const permission = new Permission();
    permission.name = name;
    permission.application = application;
    await this.permissionRepository.save(permission);
  }

  async remove(permission: Permission) {
    await this.permissionRepository.remove(permission);
  }

  async save(permission: Permission) {
    await this.permissionRepository.save(permission);
  }

  async list(namespace: string = 'kreds') {
    if (this.permissionCache[namespace]) {
      return this.permissionCache[namespace];
    }

    let applicationId: number = null;

    if (!this.systemNamespaces.includes(namespace)) {
      const application = await this.applicationService.byName(namespace);
      applicationId = application.id;
    }

    const permissions = await this.permissionRepository.find({
      where: { applicationId },
    });

    const list = permissions.map(permission => permission.name);

    this.permissionCache[namespace] = list;
    return list;
  }

  async resolvePermissionString(str: string): Promise<string[]> {
    const namespaceSplit = str.split(':');
    if (namespaceSplit.length !== 2) {
      // TODO: Cache the result of this.
      if (str === '*') {
        const permissions = await this.permissionRepository.find({
          relations: ['application'],
        });
        return permissions.map(
          permission =>
            (permission.application ? permission.application.name : 'kreds') +
            ':' +
            permission.name
        );
      }
      return [];
    }

    const list = await this.list(namespaceSplit[0]);
    if (list.length === 0) {
      return [];
    }

    return list
      .filter(listStr => listStr === str || matcher.isMatch(listStr, str))
      .map(str => namespaceSplit[0] + ':' + str);
  }

  async getGroupPermissions(uuid: string) {
    if (this.groupPermissionCache[uuid]) {
      return this.groupPermissionCache[uuid];
    }

    const group = await this.groupService.byUuid(uuid);

    let set = new Set<string>();

    if (group.permissions) {
      for (let str of group.permissions) {
        const list = await this.resolvePermissionString(str);
        for (let item of list) {
          set.add(item);
        }
      }
    }

    const list = Array.from(set);
    this.groupPermissionCache[uuid] = list;
    return list;
  }

  async getUserPermissions(uuid: string) {
    if (this.userPermissionCache[uuid]) {
      return this.userPermissionCache[uuid];
    }

    const user = await this.userRepository.findOne({
      where: { uuid },
      relations: ['groups'],
    });

    let set = new Set<string>();

    if (user.permissions) {
      for (let str of user.permissions) {
        const list = await this.resolvePermissionString(str);
        for (let item of list) {
          set.add(item);
        }
      }
    }

    if (user.groups) {
      for (let group of user.groups) {
        const list = await this.getGroupPermissions(group.uuid);
        for (let item of list) {
          set.add(item);
        }
      }
    }

    const list = Array.from(set);
    this.userPermissionCache[uuid] = list;
    return list;
  }

  flushUserPermissionCache(uuid?: string) {
    if (!uuid) {
      this.userPermissionCache = {};
    } else {
      delete this.userPermissionCache[uuid];
    }
  }

  flushGroupPermissionCache(uuid?: string) {
    if (!uuid) {
      this.groupPermissionCache = {};
    } else {
      delete this.groupPermissionCache[uuid];
    }
  }

  flushPermissionCache(namespace?: string) {
    if (!namespace) {
      this.permissionCache = {};
    } else {
      delete this.permissionCache[namespace];
    }
  }

  flushCache() {
    this.permissionCache = {};
    this.groupPermissionCache = {};
    this.userPermissionCache = {};
  }
}
