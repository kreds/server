import { KoaMiddlewareInterface } from 'routing-controllers';
import { verify } from 'jsonwebtoken';
import { Inject } from 'typedi';
import { Context } from 'koa';

import { JWTData } from '../models/JWTData';

export interface CustomContext extends Context {
  jwtData?: JWTData;
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
            context.jwtData = token;
          }
        }
      } catch {}
    }

    await next();
  }
}
