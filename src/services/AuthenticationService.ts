import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { authenticator } from 'otplib';
import { randomBytes } from 'crypto';

import { User } from '../entities/User';
import {
  AuthenticationRequestUnion,
  AuthenticationRequestType,
} from '../models/AuthenticationRequest';
import {
  AuthenticationResponse,
  AuthenticationResponseResult,
} from '../models/AuthenticationResponse';
import { TwoFactorResponse } from '../models/TwoFactorResponse';
import { JWTData, AuthenticationStatus } from '../models/JWTData';
import { TwoFactorRequest } from '../models/TwoFactorRequest';
import { RefreshTokenRequest } from '../models/RefreshTokenRequest';
import { RefreshTokenResponse } from '../models/RefreshTokenResponse';
import { Session } from '../entities/Session';

@Service()
export class AuthenticationService {
  @OrmRepository(User)
  private userRepository: Repository<User>;

  @OrmRepository(Session)
  private sessionRepository: Repository<Session>;

  async authenticate(
    request: AuthenticationRequestUnion
  ): Promise<AuthenticationResponse> {
    const user = await this.userRepository.findOne({
      where: { name: request.username },
      relations: ['authenticationMethods'],
    });

    if (!user) {
      return {
        result: AuthenticationResponseResult.FAILURE,
      };
    }

    const method = user.authenticationMethods.find(
      method =>
        method.subtype === request.subtype && method.type === request.type
    );

    let result = AuthenticationResponseResult.FAILURE;
    let token: string | undefined = undefined;
    let refreshToken: string | undefined = undefined;

    switch (request.type) {
      case AuthenticationRequestType.PASSWORD:
        if (await compare(request.data, method.data)) {
          result = AuthenticationResponseResult.SUCCESS;
        }
        break;
      case AuthenticationRequestType.OAUTH2:
        break;
      case AuthenticationRequestType.EXTENSION:
        break;
      default:
        throw new Error('Unsupported authentication request type.');
    }

    if (
      result === AuthenticationResponseResult.SUCCESS &&
      user.twoFactorSecret
    ) {
      result = AuthenticationResponseResult.REQUIRE_2FA;
    }

    if (result === AuthenticationResponseResult.SUCCESS) {
      const data: JWTData = {
        status: AuthenticationStatus.AUTHENTICATED,
        uuid: user.uuid,
        name: user.name,
      };
      token = sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      const session = new Session();
      session.refreshToken = randomBytes(128).toString('base64');
      session.user = user;
      await this.sessionRepository.save(session);
      refreshToken = session.refreshToken;
    } else if (result === AuthenticationResponseResult.REQUIRE_2FA) {
      const data: JWTData = {
        status: AuthenticationStatus.REQUIRE_2FA,
        uuid: user.uuid,
        name: user.name,
      };
      token = sign(data, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });
    }

    return {
      result,
      token,
      refreshToken,
    };
  }

  async refreshToken(
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken: request.refreshToken },
      relations: ['user'],
    });

    if (!session) {
      return {
        success: false,
      };
    }

    const data: JWTData = {
      status: AuthenticationStatus.AUTHENTICATED,
      uuid: session.user.uuid,
      name: session.user.name,
    };
    const token = sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return {
      success: true,
      token,
    };
  }

  async twoFactorVerify(
    request: TwoFactorRequest,
    jwtData: JWTData
  ): Promise<TwoFactorResponse> {
    if (
      !jwtData ||
      !jwtData.uuid ||
      jwtData.status !== AuthenticationStatus.REQUIRE_2FA
    ) {
      return {
        success: false,
      };
    }

    const user = await this.userRepository.findOne({
      where: { uuid: jwtData.uuid },
    });

    if (
      !user?.twoFactorSecret ||
      !request.token ||
      !authenticator.check(request.token, user.twoFactorSecret)
    ) {
      return {
        success: false,
      };
    }

    const data: JWTData = {
      status: AuthenticationStatus.AUTHENTICATED,
      uuid: user.uuid,
      name: user.name,
    };
    const token = sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    return {
      success: true,
      token,
    };
  }

  async twoFactorEnable(user: User) {
    if (user.twoFactorSecret) {
      throw new Error('2FA is already enabled for this user.');
    }

    user.twoFactorSecret = authenticator.generateSecret();
    this.userRepository.save(user);

    return {
      uri: authenticator.keyuri(user.name, 'kreds', user.twoFactorSecret),
    };
  }

  async twoFactorDisable(user: User, token: string) {
    if (!user.twoFactorSecret) {
      throw new Error('2FA is not enabled for this user.');
    }

    if (!authenticator.check(token, user.twoFactorSecret)) {
      throw new Error('Invalid token.');
    }
  }
}
