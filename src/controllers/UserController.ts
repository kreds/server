import { Controller, Get, Post, Put, Delete } from 'routing-controllers';
import { Inject } from 'typedi';

import { UserService } from '../services/UserService';

@Controller('/v1/users')
export class UserController {
  @Inject()
  private userService: UserService;

  @Get('/')
  async index() {
    // TODO: Check if authenticated and allowed to do that.
    return await this.userService.getAllUsers();
  }

  @Post('/')
  async create() {
    // TODO: Check if authenticated and allowed to do that.
  }

  @Put('/:id')
  async update() {
    // TODO: Check if authenticated and allowed to do that.
  }

  @Delete('/:id')
  async delete() {
    // TODO: Check if authenticated and allowed to do that.
  }
}
