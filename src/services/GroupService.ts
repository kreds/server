import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Group } from '../entities/Group';

@Service()
export class GroupService {
  @OrmRepository(Group)
  private groupRepository: Repository<Group>;

  async byId(id: number) {
    return await this.groupRepository.findOne(id);
  }

  async byUuid(uuid: string) {
    return await this.groupRepository.findOne({ where: { uuid: uuid } });
  }

  async all() {
    return await this.groupRepository.find();
  }

  async add(name: string, fullName?: string) {
    const group = new Group();
    group.name = name;
    group.fullName = fullName;
    await this.groupRepository.save(group);
  }

  async remove(group: Group) {
    await this.groupRepository.remove(group);
  }

  async save(group: Group) {
    await this.groupRepository.save(group);
  }
}
