"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnique = exports.getCount = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getCount = () => {
    return prisma.perguntas.count();
};
exports.getCount = getCount;
const getUnique = (data) => {
    return prisma.perguntas.findFirstOrThrow({
        where: {
            ordem: data
        },
        include: {
            respostas: true
        }
    });
};
exports.getUnique = getUnique;
