import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  Param,
  NotFoundError,
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
  async delete(@Param('id') id: number) {
    const user = await this.userService.byId(id);
    if (!user) {
      throw new NotFoundError();
    }

    await this.userService.remove(user);
    return { success: true };
  }
}
