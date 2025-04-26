import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveScenarioSelectedFirstStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.create({
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

export const saveScenarioSelectedSecondStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.create({
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

export const saveScenarioSelectedThirdStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.create({
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