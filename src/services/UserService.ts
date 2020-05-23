import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';

import { User } from '../entities/User';

@Service()
export class UserService {
  @OrmRepository(User)
  private userRepository: Repository<User>;

  async byId(id: number) {
    return await this.userRepository.findOne(id);
  }

  async byUuid(uuid: string) {
    return await this.userRepository.findOne({ where: { uuid: uuid } });
  }

  async all() {
    return await this.userRepository.find();
  }

  async add(username: string, fullName?: string, email?: string) {
    const user = new User();
    user.name = username;
    user.fullName = fullName;
    user.email = email;
    await this.userRepository.save(user);
  }

  async remove(user: User) {
    await this.userRepository.remove(user);
  }

  async save(user: User) {
    await this.userRepository.save(user);
  }
}
