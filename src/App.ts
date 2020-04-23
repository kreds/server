import 'reflect-metadata';
import { createKoaServer } from 'routing-controllers';
import { createConnection, useContainer } from 'typeorm';
import { Container } from 'typedi';

import { AuthenticationController } from './controllers/AuthenticationController';
import { ApplicationController } from './controllers/ApplicationController';
import { GroupController } from './controllers/GroupController';
import { OAuth2Controller } from './controllers/OAuth2Controller';
import { UserController } from './controllers/UserController';

import { ErrorHandler } from './middlewares/ErrorHandler';
import { AuthenticationMiddleware } from './middlewares/AuthenticationMiddleware';

import ormconfig from '../ormconfig';

export default async function App() {
  useContainer(Container);
  try {
    await createConnection({
      ...(ormconfig as any),
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
      middlewares: [AuthenticationMiddleware, ErrorHandler],
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
