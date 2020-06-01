import 'reflect-metadata';
import {
  createKoaServer,
  useContainer as useContainerRC,
  Action,
} from 'routing-controllers';
import { createConnection, useContainer as useContainerTO } from 'typeorm';
import { Container } from 'typedi';

import { AuthenticationController } from './controllers/AuthenticationController';
import { ApplicationController } from './controllers/ApplicationController';
import { GroupController } from './controllers/GroupController';
import { OAuth2Controller } from './controllers/OAuth2Controller';
import { UserController } from './controllers/UserController';

import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { getJWTData, isAuthenticated } from './Authentication';
import { UserService } from './services/UserService';
import { PermissionService } from './services/PermissionService';

export default async function App(ormconfig: any) {
  useContainerTO(Container);
  useContainerRC(Container);

  try {
    await createConnection({
      ...ormconfig,
    });

    const app = createKoaServer({
      cors: true,
      controllers: [
        AuthenticationController,
        ApplicationController,
        GroupController,
        OAuth2Controller,
        UserController,
      ],
      middlewares: [ErrorMiddleware],
      defaultErrorHandler: false,
      authorizationChecker: async (action: Action, roles: string[]) => {
        const jwtData = getJWTData(action.context);

        if (isAuthenticated(jwtData)) {
          const permissionService = Container.get(PermissionService);
          const list = await permissionService.getUserPermissions(jwtData.uuid);

          for (let role of roles) {
            if (!list.includes(role)) {
              return false;
            }
          }

          return true;
        }

        return false;
      },
      currentUserChecker: async (action: Action) => {
        const jwtData = getJWTData(action.context);

        if (isAuthenticated(jwtData)) {
          const userService = Container.get(UserService);
          return await userService.byUuid(jwtData.uuid);
        }
      },
    });

    const port = process.env.HTTP_PORT || 8080;
    const ip = process.env.HTTP_IP || '127.0.0.1';
    app.listen(port, ip);

    console.log('kreds/server listening on: ' + ip + ':' + port);
  } catch (e) {
    console.error(e);
  }
}
