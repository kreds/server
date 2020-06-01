import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { UserService } from '../services/UserService';

@JsonController('/v1/users')
export class UserController {
  @Inject()
  private userService: UserService;

  @Get('/')
  @Authorized('kreds:users.list')
  async index() {
    return await this.userService.all();
  }

  @Post('/')
  @Authorized('kreds:users.create')
  async create() {}

  @Put('/:id')
  @Authorized('kreds:users.update')
  async update() {}

  @Delete('/:id')
  @Authorized('kreds:users.delete')
  async delete() {}
}
