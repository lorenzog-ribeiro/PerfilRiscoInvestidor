import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveAnswers = async (data: any) => {
    return prisma.respostas_usuarios.create({
        data: {
            usuario_id: data.usuario_id,
            resposta: data.resposta,
            pergunta_id: data.pergunta_id,
            respondido_em: new Date()
        }
    });
}