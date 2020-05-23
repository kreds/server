import { Inject } from 'typedi';
import {
  Controller,
  Get,
  Post,
  Ctx,
  Body,
  UseBefore,
} from 'routing-controllers';

import {
  CustomContext,
  AuthenticationMiddleware,
} from '../middlewares/AuthenticationMiddleware';
import { UserService } from '../services/UserService';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuthenticationRequest } from '../models/AuthenticationRequest';

@UseBefore(AuthenticationMiddleware)
@Controller('/v1/authentication')
export class AuthenticationController {
  @Inject()
  private userService: UserService;

  @Inject()
  private authenticationService: AuthenticationService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    if (!context.jwtData || !context.jwtData.authenticated) {
      return {
        isAuthenticated: false,
      };
    }

    const user = await this.userService.byUuid(context.jwtData.uuid);
    return {
      isAuthenticated: !!user,
      user,
    };
  }

  @Post('/')
  async authenticate(@Body() authenticationRequest: AuthenticationRequest) {
    const authenticationResult = await this.authenticationService.authenticate(
      authenticationRequest
    );
    return authenticationResult;
  }
}
