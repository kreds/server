import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { PermissionService } from '../services/PermissionService';

@JsonController('/v1/permissions')
export class PermissionController {
  @Inject()
  private permissionService: PermissionService;

  @Get('/')
  @Authorized('kreds:permissions.list')
  async index() {
    return await this.permissionService.all();
  }

  @Post('/')
  @Authorized('kreds:permissions.create')
  async create() {}

  @Put('/:id')
  @Authorized('kreds:permissions.update')
  async update() {}

  @Delete('/:id')
  @Authorized('kreds:permissions.delete')
  async delete() {}
}
