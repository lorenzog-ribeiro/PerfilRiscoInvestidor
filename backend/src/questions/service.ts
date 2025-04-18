import { PrismaClient } from '@prisma/client';
import { getCount,getUnique } from "./repository";

const prisma = new PrismaClient();

export const getQuestionCount = async () => {
    return getCount();
}

export const getUniqueQuestions = async (data: number) => {
    return getUnique(data);
}