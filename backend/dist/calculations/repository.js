"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLastValueSecondStage = exports.searchLastAttempt = exports.searchResultCalc = exports.saveScenarioSelectedThirdStage = exports.saveScenarioSelectedSecondStage = exports.saveScenarioSelectedFirstStage = exports.searchValueThirdStage = exports.searchValueSecondStage = exports.searchValueFirstStage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Função para buscar os valores da primeira etapa, considerando a pergunta e a tentativa
const searchValueFirstStage = async (data) => {
    try {
        const result = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa
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
// Função para buscar os valores da segunda etapa, considerando a pergunta e a tentativa
const searchValueSecondStage = async (data) => {
    try {
        const result = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa
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
// Função para buscar os valores da terceira etapa, considerando a pergunta e a tentativa
const searchValueThirdStage = async (data) => {
    try {
        const result = await prisma.terceira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa // Considerando tanto a pergunta quanto a tentativa
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
// Função para salvar os dados na primeira etapa, considerando a pergunta e a tentativa
const saveScenarioSelectedFirstStage = async (data) => {
    try {
        const result = await prisma.primeira_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo,
                tentativa: data.tentativa // Adicionando a tentativa ao salvar
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao salvar o cenário da primeira etapa:', error);
        throw error;
    }
};
exports.saveScenarioSelectedFirstStage = saveScenarioSelectedFirstStage;
// Função para salvar os dados na segunda etapa, considerando a pergunta e a tentativa
const saveScenarioSelectedSecondStage = async (data) => {
    try {
        const result = await prisma.segunda_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo,
                tentativa: data.tentativa // Adicionando a tentativa ao salvar
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao salvar o cenário da segunda etapa:', error);
        throw error;
    }
};
exports.saveScenarioSelectedSecondStage = saveScenarioSelectedSecondStage;
// Função para salvar os dados na terceira etapa, considerando a pergunta e a tentativa
const saveScenarioSelectedThirdStage = async (data) => {
    try {
        const result = await prisma.terceira_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
                pergunta: data.pergunta,
                valor_fixo: data.valor_fixo,
                tentativa: data.tentativa // Adicionando a tentativa ao salvar
            }
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao salvar o cenário da terceira etapa:', error);
        throw error;
    }
};
exports.saveScenarioSelectedThirdStage = saveScenarioSelectedThirdStage;
// Função para buscar o resultado do cálculo, considerando a pergunta e a tentativa
const searchResultCalc = async (data) => {
    try {
        let result;
        switch (data.stage) {
            case 1:
                result = await prisma.primeira_etapa.findFirstOrThrow({
                    where: {
                        usuario_id: data.usuario_id,
                        pergunta: data.pergunta, // Considerando a pergunta
                        tentativa: data.tentativa // Considerando a tentativa
                    },
                    orderBy: {
                        pergunta: data.order,
                    }
                });
                break;
            case 2:
                result = await prisma.segunda_etapa.findFirstOrThrow({
                    where: {
                        usuario_id: data.usuario_id,
                        pergunta: data.pergunta, // Considerando a pergunta
                        tentativa: data.tentativa // Considerando a tentativa
                    },
                    orderBy: {
                        pergunta: data.order,
                    }
                });
                break;
            case 3:
                result = await prisma.terceira_etapa.findFirstOrThrow({
                    where: {
                        usuario_id: data.usuario_id,
                        pergunta: data.pergunta, // Considerando a pergunta
                        tentativa: data.tentativa // Considerando a tentativa
                    },
                    orderBy: {
                        pergunta: data.order,
                    }
                });
                break;
        }
        return result;
    }
    catch (error) {
        console.error('Erro ao buscar o resultado do cálculo:', error);
        throw error;
    }
};
exports.searchResultCalc = searchResultCalc;
const searchLastAttempt = async (usuario_id, stage, pergunta) => {
    try {
        // Mapeamento com a tipagem correta para evitar erro de tipagem
        const stageMapping = {
            1: prisma.primeira_etapa,
            2: prisma.segunda_etapa,
            3: prisma.terceira_etapa,
        };
        // Garantir que o estágio é válido
        const selectedStage = stageMapping[stage];
        if (!selectedStage) {
            console.warn(`Estágio inválido fornecido: ${stage}`);
            return 1;
        }
        const lastAttempt = await selectedStage.findFirst({
            where: {
                usuario_id: usuario_id,
                pergunta: pergunta,
            },
            orderBy: {
                tentativa: 'desc',
            },
            take: 1,
        });
        // Retorna tentativa + 1 ou 1 se não houver tentativa
        return lastAttempt && lastAttempt.tentativa !== null ? lastAttempt.tentativa + 1 : 1;
    }
    catch (error) {
        return 1;
    }
};
exports.searchLastAttempt = searchLastAttempt;
const searchLastValueSecondStage = async (data) => {
    try {
        const result = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                tentativa: data.tentativa
            },
            orderBy: [
                { pergunta: 'desc' },
            ],
        });
        return result;
    }
    catch (error) {
        console.error('Erro ao buscar na segunda etapa:', error);
        throw error;
    }
};
exports.searchLastValueSecondStage = searchLastValueSecondStage;
