import { KoaMiddlewareInterface } from 'routing-controllers';
import jwt from 'jsonwebtoken';
import { Context } from 'koa';

export class Authentication {
  constructor(public token: JWT) {}
}

export interface CustomContext extends Context {
  authentication?: Authentication;
}

export interface JWT {
  id: number;
  name: string;
  authenticated: boolean;
}

export class AuthenticationMiddleware implements KoaMiddlewareInterface {
  async use(context: CustomContext, next: (err?: any) => Promise<any>) {
    if (context.headers['authorization']) {
      const split = context.headers['authorization'].split(' ');
      const token = split[split.length - 1];

      try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        if (typeof data === 'object') {
          const token = data as JWT;
          if (token.authenticated) {
            context.authentication = new Authentication(token);
          }
        }
      } catch {}
    }

    next();
  }
}
