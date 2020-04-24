import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

import { User } from '../entities/User';
import { UserAuthenticationMethod } from '../entities/UserAuthenticationMethod';
import {
  AuthenticationRequestUnion,
  AuthenticationRequestType,
} from '../models/AuthenticationRequest';
import {
  AuthenticationResponse,
  AuthenticationResponseResult,
} from '../models/AuthenticationResponse';
import { JWTData } from '../models/JWTData';

@Service()
export class AuthenticationService {
  @OrmRepository(User)
  private userRepository: Repository<User>;

  @OrmRepository(UserAuthenticationMethod)
  private userAuthenticationMethodRepository: Repository<
    UserAuthenticationMethod
  >;

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

    if (result === AuthenticationResponseResult.SUCCESS) {
      const data: JWTData = {
        authenticated: true,
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
    };
  }
}
