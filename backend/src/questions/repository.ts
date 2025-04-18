import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCount = () => {
    return prisma.perguntas.count();
};


export const getUnique = (data: number) => {
    console.log(data);
    return prisma.perguntas.findFirstOrThrow({
        where:{
            ordem: data
        },
        include:{
            respostas:true
        }
    });
};