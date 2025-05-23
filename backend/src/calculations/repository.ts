import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para buscar os valores da primeira etapa, considerando a pergunta e a tentativa
export const searchValueFirstStage = async (data: any) => {
    try {
        const result = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                pergunta: data.pergunta,
                tentativa: data.tentativa
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
                tentativa: data.tentativa
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
        const existing = await prisma.primeira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                tentativa: data.tentativa,
                pergunta: data.pergunta
            }
        });

        if (existing) {
            const updated = await prisma.primeira_etapa.update({
                where: { id: existing.id },
                data: {
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return updated;
        } else {
            const created = await prisma.primeira_etapa.create({
                data: {
                    usuario_id: data.usuario_id,
                    tentativa: data.tentativa,
                    pergunta: data.pergunta,
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return created;
        }
    } catch (error) {
        console.error('Erro ao salvar ou atualizar o cenário da primeira etapa:', error);
        throw error;
    }
};

// Função para salvar os dados na segunda etapa, considerando a pergunta e a tentativa
export const saveScenarioSelectedSecondStage = async (data: any) => {
    try {
        const existing = await prisma.segunda_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                tentativa: data.tentativa,
                pergunta: data.pergunta
            }
        });

        if (existing) {
            const updated = await prisma.segunda_etapa.update({
                where: { id: existing.id },
                data: {
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return updated;
        } else {
            const created = await prisma.segunda_etapa.create({
                data: {
                    usuario_id: data.usuario_id,
                    tentativa: data.tentativa,
                    pergunta: data.pergunta,
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return created;
        }
    } catch (error) {
        console.error('Erro ao salvar ou atualizar o cenário da primeira etapa:', error);
        throw error;
    }
}

// Função para salvar os dados na terceira etapa, considerando a pergunta e a tentativa
export const saveScenarioSelectedThirdStage = async (data: any) => {
    try {
        const existing = await prisma.terceira_etapa.findFirst({
            where: {
                usuario_id: data.usuario_id,
                tentativa: data.tentativa,
                pergunta: data.pergunta
            }
        });

        if (existing) {
            const updated = await prisma.terceira_etapa.update({
                where: { id: existing.id },
                data: {
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return updated;
        } else {
            const created = await prisma.terceira_etapa.create({
                data: {
                    usuario_id: data.usuario_id,
                    tentativa: data.tentativa,
                    pergunta: data.pergunta,
                    valor_selecionado: data.valor_selecionado,
                    lado_selecionado: data.lado_selecionado,
                    mediana: data.mediana,
                    valor_fixo: data.valor_fixo
                }
            });
            return created;
        }
    } catch (error) {
        console.error('Erro ao salvar ou atualizar o cenário da primeira etapa:', error);
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
    try {
        // Mapeamento com a tipagem correta para evitar erro de tipagem
        const stageMapping = {
            1: prisma.primeira_etapa,
            2: prisma.segunda_etapa,
            3: prisma.terceira_etapa,
        };

        // Garantir que o estágio é válido
        const selectedStage = stageMapping[stage as keyof typeof stageMapping];

        if (!selectedStage) {
            console.warn(`Estágio inválido fornecido: ${stage}`);
            return 1;
        }

        const lastAttempt = await (selectedStage as {
            findFirst: typeof prisma.primeira_etapa.findFirst
        }).findFirst({
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

    } catch (error) {
        return 1;
    }
}

export const searchLastValueSecondStage = async (data: any) => {
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
    } catch (error) {
        console.error('Erro ao buscar na segunda etapa:', error);
        throw error;
    }
}