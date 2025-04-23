import { createUserProfile } from './repository';

export const save = async (data: any) => {
    return createUserProfile(data);
};
