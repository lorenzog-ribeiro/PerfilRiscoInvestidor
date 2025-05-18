import { saveAnswers } from './repository';

export const save = async (data: any) => {
    return saveAnswers(data); 
};
