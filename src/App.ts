import 'reflect-metadata';
import {
  createKoaServer,
  useContainer as useContainerRC,
} from 'routing-controllers';
import { createConnection, useContainer as useContainerTO } from 'typeorm';
import { Container } from 'typedi';

import { AuthenticationController } from './controllers/AuthenticationController';
import { ApplicationController } from './controllers/ApplicationController';
import { GroupController } from './controllers/GroupController';
import { OAuth2Controller } from './controllers/OAuth2Controller';
import { UserController } from './controllers/UserController';

import { ErrorMiddleware } from './middlewares/ErrorMiddleware';
import { AuthenticationMiddleware } from './middlewares/AuthenticationMiddleware';

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
      middlewares: [ErrorMiddleware, AuthenticationMiddleware],
      defaultErrorHandler: false,
    });

    const port = process.env.HTTP_PORT || 8080;
    const ip = process.env.HTTP_IP || '127.0.0.1';
    app.listen(port, ip);

    console.log('kreds/server listening on: ' + ip + ':' + port);
  } catch (e) {
    console.error(e);
  }
}
