import { PrismaClient } from '@prisma/client';
import { UserModel } from './model';
import { createUserProfile } from './repository';

export const createUser = async (data: UserModel) => {
    return createUserProfile(data);
}