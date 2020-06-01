import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { ApplicationService } from '../services/ApplicationService';

@JsonController('/v1/applications')
export class ApplicationController {
  @Inject()
  private applicationService: ApplicationService;

  @Get('/')
  @Authorized('kreds:applications.list')
  async index() {
    return await this.applicationService.all();
  }

  @Post('/')
  @Authorized('kreds:applications.create')
  async create() {}

  @Put('/:id')
  @Authorized('kreds:applications.update')
  async update() {}

  @Delete('/:id')
  @Authorized('kreds:applications.delete')
  async delete() {}
}
