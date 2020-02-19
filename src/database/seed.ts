import { createConnection, getConnectionManager } from 'typeorm';

import ormconfig from '../../ormconfig';
import { User } from '../entities/User';

async function seed() {
    const connection = await createConnection(
        ormconfig as any
    );

    const userRepository = connection.getRepository(User);
    const user = new User();
    user.name = 'admin';
    userRepository.save(user);
}

seed();