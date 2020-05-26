import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Ctx,
  UseBefore,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { UserService } from '../services/UserService';
import {
  CustomContext,
  AuthenticationMiddleware,
} from '../middlewares/AuthenticationMiddleware';

@UseBefore(AuthenticationMiddleware)
@Controller('/v1/users')
export class UserController {
  @Inject()
  private userService: UserService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:users.list');
    return await this.userService.all();
  }

  @Post('/')
  async create(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:users.create');
  }

  @Put('/:id')
  async update(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:users.update');
  }

  @Delete('/:id')
  async delete(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:users.delete');
  }
}
