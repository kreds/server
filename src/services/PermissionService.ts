import { Service, Inject } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import matcher from 'matcher';

import { Permission } from '../entities/Permission';
import { GroupService } from './GroupService';
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
  private permissionCache: string[] = [];

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

  async list() {
    if (this.permissionCache) {
      return this.permissionCache;
    }

    const permissions = await this.permissionRepository.find({
      relations: ['application'],
    });
    const list = permissions.map(
      permission =>
        (permission.application ? permission.application.name : 'kreds') +
        ':' +
        permission.name
    );

    this.permissionCache = list;
    return list;
  }

  async resolvePermissionString(str: string): Promise<string[]> {
    const list = await this.list();

    if (str === '*') {
      return list;
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

  flushPermissionCache() {
    this.permissionCache = [];
  }

  flushCache() {
    this.permissionCache = [];
    this.groupPermissionCache = {};
    this.userPermissionCache = {};
  }
}
