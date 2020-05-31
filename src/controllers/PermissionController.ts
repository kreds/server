import {
  JsonController,
  Get,
  Ctx,
  Post,
  Put,
  Delete,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { CustomContext } from '../middlewares/AuthenticationMiddleware';
import { PermissionService } from '../services/PermissionService';

@JsonController('/v1/permissions')
export class PermissionController {
  @Inject()
  private permissionService: PermissionService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:permissions.list');
    return await this.permissionService.all();
  }

  @Post('/')
  async create(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:permissions.create');
  }

  @Put('/:id')
  async update(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:permissions.update');
  }

  @Delete('/:id')
  async delete(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:permissions.delete');
  }
}
