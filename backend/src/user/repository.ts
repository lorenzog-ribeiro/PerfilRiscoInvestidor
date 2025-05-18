import { PrismaClient } from '@prisma/client';
import { UserModel } from './model';

const prisma = new PrismaClient();

export const getUnique = async (data: string) => {
    return prisma.usuarios.findFirst({
        where: {
            email: data
        }
    });
};

export const getbyId = async (data: string) => {
    return prisma.usuarios.findFirst({
        where: {
            id: data
        }
    });
};

export const createUserProfile = async (data: UserModel) => {
    return prisma.usuarios.create({
        data: data
    });
}

export const updateAttempt = async (data: UserModel) => {
    return prisma.usuarios.update({
        where: {
            id: data.id
        },
        data: {
            tentativa: data.tentativa,
        }
    });
}