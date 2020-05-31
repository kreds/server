import {
  JsonController,
  Get,
  Ctx,
  Post,
  Put,
  Delete,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { GroupService } from '../services/GroupService';
import { CustomContext } from '../middlewares/AuthenticationMiddleware';

@JsonController('/v1/groups')
export class GroupController {
  @Inject()
  private groupService: GroupService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:groups.list');
    return await this.groupService.all();
  }

  @Post('/')
  async create(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:groups.create');
  }

  @Put('/:id')
  async update(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:groups.update');
  }

  @Delete('/:id')
  async delete(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:groups.delete');
  }
}
