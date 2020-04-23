import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { compare } from 'bcrypt';

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

    return {
      result,
    };
  }
}
