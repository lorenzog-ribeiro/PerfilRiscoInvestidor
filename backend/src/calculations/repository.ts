import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para buscar os valores da primeira etapa, considerando a pergunta e a tentativa
export const searchValueFirstStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa // Considerando tanto a pergunta quanto a tentativa
            }
        });
        return result;
    } catch (error) {
        console.error('Erro ao buscar na primeira etapa:', error);
        throw error;
    }
}

// Função para buscar os valores da segunda etapa, considerando a pergunta e a tentativa
export const searchValueSecondStage = async (data: any) => {
    try {
        const result = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa // Considerando tanto a pergunta quanto a tentativa
            }
        });
        return result;
    } catch (error) {
        console.error('Erro ao buscar na segunda etapa:', error);
        throw error;
    }
}

// Função para buscar os valores da terceira etapa, considerando a pergunta e a tentativa
export const searchValueThirdStage = async (data: any) => {
    try {
        const result = await prisma.terceira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa // Considerando tanto a pergunta quanto a tentativa
            }
        });
        return result;
    } catch (error) {
        console.error('Erro ao buscar na terceira etapa:', error);
        throw error;
    }
}

// Função para salvar os dados na primeira etapa, considerando a pergunta e a tentativa
export const saveScenarioSelectedFirstStage = async (data: any) => {
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
    } catch (error) {
        console.error('Erro ao salvar o cenário da primeira etapa:', error);
        throw error;
    }
}

// Função para salvar os dados na segunda etapa, considerando a pergunta e a tentativa
export const saveScenarioSelectedSecondStage = async (data: any) => {
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
    } catch (error) {
        console.error('Erro ao salvar o cenário da segunda etapa:', error);
        throw error;
    }
}

// Função para salvar os dados na terceira etapa, considerando a pergunta e a tentativa
export const saveScenarioSelectedThirdStage = async (data: any) => {
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
    } catch (error) {
        console.error('Erro ao salvar o cenário da terceira etapa:', error);
        throw error;
    }
}

// Função para buscar o resultado do cálculo, considerando a pergunta e a tentativa
export const searchResultCalc = async (data: any) => {
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
    } catch (error) {
        console.error('Erro ao buscar o resultado do cálculo:', error);
        throw error;
    }
}

export const searchLastAttempt = async (usuario_id: string, stage: number, pergunta: number) => {
    let lastAttempt = null;
    switch (stage) {
        case 1:
            lastAttempt = await prisma.primeira_etapa.findFirst({
                where: {
                    usuario_id: usuario_id,
                    pergunta: pergunta
                },
                orderBy: {
                    tentativa: 'desc',
                },
                take: 1,
            });
            break;
        case 2:
            lastAttempt = await prisma.segunda_etapa.findFirst({
                where: {
                    usuario_id: usuario_id,
                    pergunta: pergunta
                },
                orderBy: {
                    tentativa: 'desc',
                },
                take: 1,
            });
            break;
        case 3:
            lastAttempt = await prisma.terceira_etapa.findFirst({
                where: {
                    usuario_id: usuario_id,
                    pergunta: pergunta
                },
                orderBy: {
                    tentativa: 'desc',
                },
                take: 1,
            });
            break;
    }

    return lastAttempt && lastAttempt.tentativa !== null ? lastAttempt.tentativa + 1 : 1; // Caso não haja tentativas, começa com a tentativa 1
}
 