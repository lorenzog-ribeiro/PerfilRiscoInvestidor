"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveScenarioSelectedThirdStage = exports.saveScenarioSelectedSecondStage = exports.saveScenarioSelectedFirstStage = exports.searchValueThirdStage = exports.searchValueSecondStage = exports.searchValueFirstStage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const searchValueFirstStage = async (data) => {
    try {
        const result = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao buscar na primeira etapa:', error);
        throw error;
    }
};
exports.searchValueFirstStage = searchValueFirstStage;
const searchValueSecondStage = async (data) => {
    try {
        const result = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao buscar na segunda etapa:', error);
        throw error;
    }
};
exports.searchValueSecondStage = searchValueSecondStage;
const searchValueThirdStage = async (data) => {
    try {
        const result = await prisma.terceira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao buscar na terceira etapa:', error);
        throw error;
    }
};
exports.searchValueThirdStage = searchValueThirdStage;
const saveScenarioSelectedFirstStage = async (data) => {
    try {
        const result = await prisma.primeira_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo
            }
        });
        return result;
    }
    catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
};
exports.saveScenarioSelectedFirstStage = saveScenarioSelectedFirstStage;
const saveScenarioSelectedSecondStage = async (data) => {
    try {
        const result = await prisma.segunda_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo
            }
        });
        return result;
    }
    catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
};
exports.saveScenarioSelectedSecondStage = saveScenarioSelectedSecondStage;
const saveScenarioSelectedThirdStage = async (data) => {
    try {
        const result = await prisma.terceira_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo
            }
        });
        return result;
    }
    catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
};
exports.saveScenarioSelectedThirdStage = saveScenarioSelectedThirdStage;
