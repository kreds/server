import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import matcher from 'matcher';

import { Permission } from '../entities/Permission';
import { UserService } from './UserService';
import { GroupService } from './GroupService';
import { ApplicationService } from './ApplicationService';
import { Application } from '../entities/Application';

@Service()
export class PermissionService {
  @OrmRepository(Permission)
  private permissionRepository: Repository<Permission>;

  @Inject()
  private userService: UserService;

  @Inject()
  private groupService: GroupService;

  @Inject()
  private applicationService: ApplicationService;

  private systemNamespaces = ['kreds'];

  /**
   * Cache of permissions allowed for a given user uuid.
   */
  private userPermissionCache: Record<string, string[]>;

  /**
   * Cache of permissions allowed for a given group uuid.
   */
  private groupPermissionCache: Record<string, string[]>;

  /**
   * Cache of permissions by namespace.
   */
  private permissionCache: Record<string, string[]>;

  async byId(id: number) {
    return await this.permissionRepository.findOne(id);
  }

  async byUuid(uuid: string) {
    return await this.permissionRepository.findOne({ where: { uuid: uuid } });
  }

  async all() {
    return await this.permissionRepository.find();
  }

  async add(name: string, application?: Application, parent?: Permission) {
    const permission = new Permission();
    permission.name = name;
    permission.application = application;
    permission.parent = parent;
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
      relations: ['parent'],
    });

    const list = permissions.map(permission => {
      let str = permission.name;
      let parent = permission.parent;
      while (parent) {
        str = parent.name + '.' + str;
        parent = parent.parent;
      }
      return str;
    });

    this.permissionCache[namespace] = list;
    return list;
  }

  async resolvePermissionString(str: string): Promise<string[]> {
    const namespaceSplit = str.split(':');
    if (namespaceSplit.length !== 2) {
      return [];
    }

    const list = await this.list(namespaceSplit[0]);
    if (list.length === 0) {
      return [];
    }

    return list.filter(
      listStr => listStr === str || matcher.isMatch(listStr, str)
    );
  }

  async getGroupPermissions(uuid: string) {
    if (this.groupPermissionCache[uuid]) {
      return this.groupPermissionCache[uuid];
    }

    const group = await this.groupService.byUuid(uuid);
    let set = new Set<string>();
    for (let str of group.permissions) {
      const list = await this.resolvePermissionString(str);
      for (let item of list) {
        set.add(item);
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

    const user = await this.userService.byUuid(uuid);
    let set = new Set<string>();
    for (let str of user.permissions) {
      const list = await this.resolvePermissionString(str);
      for (let item of list) {
        set.add(item);
      }
    }

    for (let group of user.groups) {
      const list = await this.getGroupPermissions(group.uuid);
      for (let item of list) {
        set.add(item);
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
