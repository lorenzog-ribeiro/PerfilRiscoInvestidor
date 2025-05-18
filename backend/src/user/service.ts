import { UserModel } from './model';
import { createUserProfile, getUnique, updateAttempt } from './repository';

export const createUser = async (data: UserModel): Promise<object | null> => {
    const existingUser = await getUnique(data.email as string);

    if (existingUser) {
        const userModel: UserModel = {
            id: existingUser.id,
            tentativa: (existingUser.tentativa ?? 0) + 1
        };
        const updatedUser = await updateAttempt(userModel);
        return updatedUser;
    }
    data.tentativa = 1;
    const newUser = await createUserProfile(data);
    return newUser;
};
