import { Inject } from 'typedi';
import { Controller, Get, Post, Ctx, Body } from 'routing-controllers';

import { CustomContext } from '../middlewares/AuthenticationMiddleware';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuthenticationRequest } from '../models/AuthenticationRequest';
import { TwoFactorRequest } from '../models/TwoFactorRequest';

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
    return await this.authenticationService.authenticate(authenticationRequest);
  }

  @Post('/2fa/verify')
  async twoFactor(
    @Ctx() context: CustomContext,
    @Body() twoFactorRequest: TwoFactorRequest
  ) {
    return await this.authenticationService.twoFactorVerify(
      twoFactorRequest,
      context.jwtData
    );
  }
}
