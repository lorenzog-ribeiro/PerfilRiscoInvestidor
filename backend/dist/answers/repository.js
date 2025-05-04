"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLastAttempt = exports.saveAnswers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saveAnswers = async (data) => {
    return prisma.respostas_usuarios.create({
        data: {
            usuario_id: data.usuario_id,
            resposta: data.resposta,
            pergunta_id: data.pergunta_id,
            respondido_em: new Date(),
            tentativa: data.tentativa
        }
    });
};
exports.saveAnswers = saveAnswers;
const searchLastAttempt = async (usuario_id, stage) => {
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
};
exports.searchLastAttempt = searchLastAttempt;
