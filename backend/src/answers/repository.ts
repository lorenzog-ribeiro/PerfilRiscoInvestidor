import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveAnswers = async (data: any) => {
    return prisma.respostas_usuarios.create({
        data: {
            usuario_id: data.usuario_id,
            resposta: data.resposta,
            pergunta_id: data.pergunta_id,
            respondido_em: new Date(),
            tentativa: data.tentativa
        }
    });
}
export const searchLastAttempt = async (usuario_id: string, stage: number) => {
    const lastAttempt = await prisma.respostas_usuarios.findFirst({
        where: {
            usuario_id: usuario_id,
            perguntas: {
                ordem: stage
            }
        },
        orderBy: {
            tentativa: 'desc',
        },
        take: 1,
    });

    return lastAttempt && lastAttempt.tentativa !== null ? lastAttempt.tentativa + 1 : 1; // Caso não haja tentativas, começa com a tentativa 1
} 