import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { GroupService } from '../services/GroupService';

@JsonController('/v1/groups')
export class GroupController {
  @Inject()
  private groupService: GroupService;

  @Authorized('kreds:groups.list')
  @Get('/')
  async index() {
    return await this.groupService.all();
  }

  @Authorized('kreds:groups.create')
  @Post('/')
  async create() {}

  @Authorized('kreds:groups.update')
  @Put('/:id')
  async update() {}

  @Authorized('kreds:groups.delete')
  @Delete('/:id')
  async delete() {}
}
