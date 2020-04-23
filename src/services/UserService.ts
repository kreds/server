import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';

import { User } from '../entities/User';

@Service()
export class UserService {
  @OrmRepository(User)
  private userRepository: Repository<User>;

  async findUserById(id: number) {
    return await this.userRepository.findOne(id);
  }
}
