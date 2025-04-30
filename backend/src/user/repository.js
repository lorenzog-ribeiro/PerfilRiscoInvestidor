"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfile = exports.getUnique = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUnique = async (data) => {
    return prisma.usuarios.findFirst({
        where: {
            email: data
        }
    });
};
exports.getUnique = getUnique;
const createUserProfile = async (data) => {
    return prisma.usuarios.create({
        data: data
    });
};
exports.createUserProfile = createUserProfile;
