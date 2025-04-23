import { UserModel } from './model';
import { createUserProfile, getUnique } from './repository';

export const createUser = async (data: UserModel): Promise<string | null> => {
    const existingUser = await getUnique(data.email);

    if (existingUser) {
        return existingUser.id;
    }

    const newUser = await createUserProfile(data);
    return newUser.id;
};
