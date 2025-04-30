"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAnswers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saveAnswers = async (data) => {
    return prisma.respostas_usuarios.create({
        data: {
            usuario_id: data.usuario_id,
            resposta: data.resposta,
            pergunta_id: data.pergunta_id,
            respondido_em: new Date()
        }
    });
};
exports.saveAnswers = saveAnswers;
