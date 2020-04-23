import { Inject } from 'typedi';
import {
  Controller,
  QueryParam,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  BodyParam,
  Ctx,
  Body,
} from 'routing-controllers';

import { CustomContext } from '../middlewares/AuthenticationMiddleware';
import { UserService } from '../services/UserService';
import { AuthenticationService } from '../services/AuthenticationService';
import { AuthenticationRequest } from '../models/AuthenticationRequest';

@Controller('/v1/authentication')
export class AuthenticationController {
  @Inject()
  private userService: UserService;

  @Inject()
  private authenticationService: AuthenticationService;

  @Get('/')
  index(@Ctx() context: CustomContext) {
    if (!context.authentication) {
      return {
        isAuthenticated: false,
      };
    }

    const user = this.userService.findUserById(context.authentication.token.id);
    return {
      isAuthenticated: true,
      user,
    };
  }

  @Post('/')
  authenticate(@Body() authenticationRequest: AuthenticationRequest) {
    const authenticationResult = this.authenticationService.authenticate(
      authenticationRequest
    );
    return authenticationResult;
  }
}
