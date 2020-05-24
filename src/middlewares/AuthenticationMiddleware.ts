import { KoaMiddlewareInterface } from 'routing-controllers';
import { verify } from 'jsonwebtoken';
import { Inject, Container } from 'typedi';
import { Context } from 'koa';

import { JWTData } from '../models/JWTData';
import { UserService } from '../services/UserService';
import { PermissionService } from '../services/PermissionService';

export class Authentication {
  private userService = Container.get(UserService);

  private permissionService = Container.get(PermissionService);

  constructor(private jwtData?: JWTData) {}

  async user() {
    return await this.userService.byUuid(this.jwtData.uuid);
  }

  async hasPermission(permission: string) {
    const list = await this.permissionService.getUserPermissions(
      this.jwtData.uuid
    );

    return list.includes(permission);
  }
}

export interface CustomContext extends Context {
  jwtData?: JWTData;
  auth?: Authentication;
}

export class AuthenticationMiddleware implements KoaMiddlewareInterface {
  async use(context: CustomContext, next: (err?: any) => Promise<any>) {
    if (context.headers['authorization']) {
      const split = context.headers['authorization'].split(' ');
      const token = split[split.length - 1];

      try {
        const data = verify(token, process.env.JWT_SECRET);
        if (typeof data === 'object') {
          const token = data as JWTData;
          if (token.authenticated) {
            context.auth = new Authentication(token);
            context.jwtData = token;
          }
        }
      } catch {}
    }

    await next();
  }
}
