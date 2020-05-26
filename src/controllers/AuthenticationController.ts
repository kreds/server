import { Inject } from 'typedi';
import { Controller, Get, Post, Ctx, Body } from 'routing-controllers';

import { CustomContext } from '../middlewares/AuthenticationMiddleware';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuthenticationRequest } from '../models/AuthenticationRequest';

@Controller('/v1/authentication')
export class AuthenticationController {
  @Inject()
  private authenticationService: AuthenticationService;

  @Get('/')
  async index(@Ctx() context: CustomContext) {
    const user = await context.auth.user();
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

  @Post('/2fa')
  async twoFactor(
    @Ctx() context: CustomContext,
    @Body() authenticationRequest: AuthenticationRequest
  ) {
    const authenticationResult = await this.authenticationService.authenticate(
      authenticationRequest
    );
    return authenticationResult;
  }
}
