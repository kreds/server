import 'reflect-metadata';
import { createExpressServer } from 'routing-controllers';

import { AuthenticationController } from './controllers/AuthenticationController';
import { ApplicationController } from './controllers/ApplicationController';
import { GroupController } from './controllers/GroupController';
import { OAuth2Controller } from './controllers/OAuth2Controller';
import { UserController } from './controllers/UserController';
import { ErrorHandler } from './middlewares/ErrorHandler';

export default function App() {
    const app = createExpressServer({
        cors: true,
        controllers: [
            AuthenticationController,
            ApplicationController,
            GroupController,
            OAuth2Controller,
            UserController,
        ],
        middlewares: [ ErrorHandler ],
        defaultErrorHandler: false,
    });
    
    app.listen(process.env.HTTP_PORT || 3000, process.env.HTTP_IP || '127.0.0.1');
}
