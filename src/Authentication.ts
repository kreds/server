import { Context } from 'koa';
import { verify } from 'jsonwebtoken';

import { JWTData, AuthenticationStatus } from './models/JWTData';

export function getJWTData(context: Context): JWTData | undefined {
  if (!context.headers['authorization']) {
    return;
  }

  const split = context.headers['authorization'].split(' ');
  const token = split[split.length - 1];

  try {
    const data = verify(token, process.env.JWT_SECRET);

    if (typeof data === 'object') {
      const token = data as JWTData;
      return token;
    }
  } catch {}
}

export function isAuthenticated(jwtData: JWTData) {
  return (
    jwtData &&
    jwtData.uuid &&
    jwtData.status === AuthenticationStatus.AUTHENTICATED
  );
}
