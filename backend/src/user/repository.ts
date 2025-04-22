import { PrismaClient } from '@prisma/client';
import { UserModel } from './model';

const prisma = new PrismaClient();

export const createUserProfile = async (data: UserModel) => {
    return prisma.usuarios.create({
        data: {
            email: data.email,
            nome: data.name,
            criado_em: new Date(),
        }
    });
}