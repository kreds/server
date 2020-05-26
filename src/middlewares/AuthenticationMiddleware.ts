import {
  KoaMiddlewareInterface,
  ForbiddenError,
  Middleware,
} from 'routing-controllers';
import { verify } from 'jsonwebtoken';
import { Container } from 'typedi';
import { Context } from 'koa';

import { JWTData, AuthenticationStatus } from '../models/JWTData';
import { UserService } from '../services/UserService';
import { PermissionService } from '../services/PermissionService';

export class Authentication {
  private userService = Container.get(UserService);

  private permissionService = Container.get(PermissionService);

  constructor(private jwtData?: JWTData) {}

  get authenticated() {
    return (
      this.jwtData &&
      this.jwtData.uuid &&
      this.jwtData.status === AuthenticationStatus.AUTHENTICATED
    );
  }

  async user() {
    if (!this.authenticated) {
      return undefined;
    }

    return await this.userService.byUuid(this.jwtData.uuid);
  }

  async hasPermission(permission: string) {
    if (!this.authenticated) {
      return false;
    }

    const list = await this.permissionService.getUserPermissions(
      this.jwtData.uuid
    );

    return list.includes(permission);
  }

  async requirePermission(permission: string) {
    if (!this.authenticated || !(await this.hasPermission(permission))) {
      throw new ForbiddenError('Access denied.');
    }
  }

  async requireAuthentication() {
    if (!this.authenticated) {
      throw new ForbiddenError('Access denied.');
    }
  }
}

export interface CustomContext extends Context {
  jwtData?: JWTData;
  auth: Authentication;
}

@Middleware({ type: 'before', priority: 500 })
export class AuthenticationMiddleware implements KoaMiddlewareInterface {
  async use(context: CustomContext, next: (err?: any) => Promise<any>) {
    if (context.headers['authorization']) {
      const split = context.headers['authorization'].split(' ');
      const token = split[split.length - 1];

      try {
        const data = verify(token, process.env.JWT_SECRET);

        if (typeof data === 'object') {
          const token = data as JWTData;
          context.auth = new Authentication(token);
          context.jwtData = token;
        }
      } catch {}
    }

    if (!context.auth) {
      context.auth = new Authentication();
    }

    await next();
  }
}
