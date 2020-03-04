import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import { User } from '../entities/User';
import { UserAuthenticationMethod } from '../entities/UserAuthenticationMethod';
import { AuthenticationRequestUnion, AuthenticationRequestType } from '../models/AuthenticationRequest';
import { AuthenticationResponse } from '../models/AuthenticationResponse';

@Service()
export class AuthenticationService {
    @OrmRepository(User)
    private userRepository: Repository<User>;

    @OrmRepository(UserAuthenticationMethod)
    private userAuthenticationMethodRepository: Repository<UserAuthenticationMethod>;

    async authenticate(request: AuthenticationRequestUnion): Promise<AuthenticationResponse> {
        switch (request.type) {
            case AuthenticationRequestType.PASSWORD:
                break;
            case AuthenticationRequestType.OAUTH2:
                break;
            case AuthenticationRequestType.EXTENSION:
                break;
            default:
                throw new Error('Unsupported authentication request type.');
        }

        return {
            successful: false,
        };
    }
}
