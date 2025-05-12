import {
    searchValueFirstStage,
    searchValueSecondStage,
    saveScenarioSelectedFirstStage,
    saveScenarioSelectedSecondStage,
    saveScenarioSelectedThirdStage,
    searchValueThirdStage,
    searchResultCalc,
    searchLastAttempt
} from "./repository";
import { getbyId } from '../user/repository';

// Função para obter a última tentativa de um usuário em uma determinada fase
const getLastAttempt = async (userId: string, stage: number, scenario: number) => {
    const lastAttempt = await searchLastAttempt(userId, stage, scenario);
    return lastAttempt;
}

function roundToNearest10(value: number) {
    const precisionValue = parseFloat(value.toFixed(2));  // Ajusta para 2 casas decimais
    return Math.round(precisionValue / 10) * 10;
}

// Função para buscar os valores da primeira fase
export const getFirstStageValues = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 1, data.scenario);
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa
            });
            if (scenario) {
                return scenario;
            }

            const Safe = 1000;
            const Risk = 0;
            const baseValue = base(Safe, Risk, 1);
            return await saveScenarioSelectedFirstStage({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue as number),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
                tentativa
            });
            break;
        default:
            return await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
}

// Função para salvar os dados da primeira fase
export const saveFirstStage = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 1, data.scenario);
    const Safe = 1000;
    const Risk = 0;
    let aggregate: any;

    const baseValue = base(Safe, Risk, 1) ?? 0;

    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected - (baseValue / (2 ** data.scenario));
            break;
    }

    // Verificar a diferença mínima
    const Scenario = await saveScenarioSelectedFirstStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe,
        tentativa
    });

    const difference = Math.abs(aggregate - Safe);
    const minimumDifference = 10;

    if (difference < minimumDifference) {
        return { Scenario, continue: false };
    }

    return { Scenario, continue: true };
}


// Função para buscar os valores da segunda fase
export const getSecondStageValues = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 2, data.scenario);

    switch (data.scenario) {
        case 0:
            const scenario = await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa
            });
            if (scenario) {
                return scenario;
            }

            const Safe = 0;
            const Risk = 1000;
            const baseValue = base(Safe, Risk, 2);
            return await saveScenarioSelectedSecondStage({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue as number),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
                tentativa
            });
            break;
        default:
            return await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
}

// Função para salvar os dados da segunda fase
export const saveSecondStage = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 2, data.scenario);
    const Safe = 0;
    const Risk = 1000;
    let aggregate: any;

    const baseValue = base(Safe, Risk, 2) ?? 0;

    switch (data.optionSelected) {
        case ("B"):
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
        case ("A"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
    }

    const Scenario = await saveScenarioSelectedSecondStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk,
        tentativa
    });

    const difference = Math.abs(aggregate - Risk);
    const minimumDifference = 10;

    if (difference < minimumDifference) {
        return { Scenario, continue: false };
    }

    return { Scenario, continue: true };
}

// Função para buscar os valores da terceira fase
export const getThirdStageValues = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 3, data.scenario);

    switch (data.scenario) {
        case 0:
            const scenario = await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa
            });
            if (scenario) {
                return scenario;
            }

            const Safe = 0;
            const Risk = await getSecondForThird(data);
            const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
            return await saveScenarioSelectedThirdStage({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue as number),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Number(Risk?.valor_selecionado),
                tentativa
            });
            break;
        default:
            return await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
}

// Função para salvar os dados da terceira fase
export const saveThirdStage = async (data: any) => {
    const tentativa = await getLastAttempt(data.userId, 3, data.scenario);
    const Safe = 0;
    const Risk = await getSecondForThird(data);
    let aggregate: any;

    const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - ((baseValue ?? 0) / (2 ** data.scenario));
            break;
        case ("B"):
            const adjustedBaseValue = baseValue! * -1;
            aggregate = data.valueSelected + ((adjustedBaseValue ?? 0) / (2 ** data.scenario));
            break;
    }

    const Scenario = await saveScenarioSelectedThirdStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.valor_selecionado,
        tentativa
    });

    const difference = Math.abs(aggregate - (Risk?.valor_selecionado ?? 0));
    const minimumDifference = 10;

    if (difference < minimumDifference) {
        return { Scenario, continue: false };
    }

    return { Scenario, continue: true };
}


export const result = async (data: any) => {
    const firstFirstStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 1 });
    const lastFirstStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 1 });

    const firstThirdStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 3 });
    const lastThirdStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 3 });

    const result = ((Number(firstThirdStage?.mediana)) / (Number(lastThirdStage?.mediana))) /
        ((Number(firstFirstStage?.mediana)) / (Number(lastFirstStage?.mediana)));

    return getProfile({ indice: result, usuario: await getbyId(data) });
}

function getProfile(data: any) {
    if (data.indice < 1) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Tolerante à perda",
            descricao: "Você valoriza segurança e prefere evitar riscos.",
        };
    } else if (data.indice = 1) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Neutro à perda",
            descricao: "Você aceita algum risco em troca de retorno moderado.",
        };
    } else {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Avesso à perda",
            descricao: "Você busca maiores retornos mesmo com maior risco.",
        };
    }
}

function base(Safe: number, Risk: number, type: number) {
    switch (type) {
        case 1:
            return (((Safe * 1 / 2) + (Risk * 1 / 2)) - (0 * 0) / 100);
            break;
        case 2:
            return (((0 * 1) + (0 * 0)) - (Risk * 1 / 2) / (1 / 2));
            break;
        case 3:
            return (((Risk * 1 / 2) + (Safe * 1 / 2)) - (0 * 0) / 100);
            break;
    }
}

async function getSecondForThird(data: any) {
    return await searchValueSecondStage({
        usuario_id: data.userId,
        pergunta: 5
    });
}