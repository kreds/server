import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { Application } from '../entities/Application';

@Service()
export class ApplicationService {
  @OrmRepository(Application)
  private applicationRepository: Repository<Application>;

  async byId(id: number) {
    return await this.applicationRepository.findOne(id);
  }

  async byUuid(uuid: string) {
    return await this.applicationRepository.findOne({ where: { uuid: uuid } });
  }

  async all() {
    return await this.applicationRepository.find();
  }

  async add(name: string, fullName?: string) {
    const application = new Application();
    application.name = name;
    application.fullName = fullName;
    await this.applicationRepository.save(application);
  }

  async remove(application: Application) {
    await this.applicationRepository.remove(application);
  }

  async save(application: Application) {
    await this.applicationRepository.save(application);
  }
}
