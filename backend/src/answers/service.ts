import { saveAnswers,searchLastAttempt } from './repository';

const getLastAttempt = async (userId: string, stage: number) => {
    const lastAttempt = await searchLastAttempt(userId, stage);
    return lastAttempt || 1;
}

export const save = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 1);
    const dataWithAttempt = { 
        ...data, 
        tentativa 
    };
    console.log(dataWithAttempt);
    return saveAnswers(dataWithAttempt);
};
