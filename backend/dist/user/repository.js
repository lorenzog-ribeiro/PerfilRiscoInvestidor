"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserProfile = exports.getbyId = exports.getUnique = void 0;
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
const getbyId = async (data) => {
    console.log(data);
    return prisma.usuarios.findFirst({
        where: {
            id: data
        }
    });
};
exports.getbyId = getbyId;
const createUserProfile = async (data) => {
    return prisma.usuarios.create({
        data: data
    });
};
exports.createUserProfile = createUserProfile;
