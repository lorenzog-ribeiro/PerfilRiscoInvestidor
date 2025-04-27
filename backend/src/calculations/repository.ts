import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchValueFirstStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta
            }
        });
        return result;
    } catch (error) {
        console.error('Erro ao buscar na primeira etapa:', error);
        throw error;
    }
}

export const searchValueSecondStage = async (data: any) => {
    try {
        const result = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta
            }
        });
        return result;
    } catch (error) {
        console.error('Erro ao buscar na primeira etapa:', error);
        throw error;
    }
}

export const saveScenarioSelectedFirstStage = async (data: any) => {
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
    } catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
}

export const saveScenarioSelectedSecondStage = async (data: any) => {
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
    } catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
}

export const saveScenarioSelectedThirdStage = async (data: any) => {
    try {
        const result = await prisma.terceira_etapa.create({
            data: {
                usuario_id: data.usuario_id,
                valor_selecionado: data.valor_selecionado,
                lado_selecionado: data.lado_selecionado,
                mediana: data.mediana,
            }
        });
        return result;
    } catch (error) {
        console.error('Error saving scenario selected first stage:', error);
        throw error;
    }
}