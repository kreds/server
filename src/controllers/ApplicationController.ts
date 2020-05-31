import {
  JsonController,
  Get,
  Ctx,
  Post,
  Put,
  Delete,
} from 'routing-controllers';
import { Inject } from 'typedi';

import { ApplicationService } from '../services/ApplicationService';
import { CustomContext } from '../middlewares/AuthenticationMiddleware';

@JsonController('/v1/applications')
export class ApplicationController {
  @Inject()
  private applicationService: ApplicationService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:applications.list');
    return await this.applicationService.all();
  }

  @Post('/')
  async create(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:applications.create');
  }

  @Put('/:id')
  async update(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:applications.update');
  }

  @Delete('/:id')
  async delete(@Ctx() context: CustomContext) {
    await context.auth.requirePermission('kreds:applications.delete');
  }
}
