import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUserProfile = async (data: any) => {
    return prisma.respostas_usuarios.create({
        data: data
    });
}