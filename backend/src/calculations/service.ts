import {
    searchValueFirstStage,
    searchValueSecondStage,
    saveScenarioSelectedFirstStage,
    saveScenarioSelectedSecondStage,
    saveScenarioSelectedThirdStage,
    searchValueThirdStage,
    searchResultCalc
} from "./repository";
import { getbyId } from '../user/repository';

export const getFirstStageValues = async (data: any) => {
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueFirstStage({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }

            const Safe = 1000;
            const Risk = 0;
            const baseValue = base(Safe, Risk, 1);
            return await saveScenarioSelectedFirstStage({
                valor_selecionado: 0,
                mediana: baseValue?.toFixed(0),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
            });

            break;
        default:
            return await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
}

export const saveFirstStage = async (data: any) => {
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
    console.log(baseValue, aggregate, data.valueSelected)

    return await saveScenarioSelectedFirstStage({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe
    });
}

export const getSecondStageValues = async (data: any) => {
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueSecondStage({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }

            const Safe = 0;
            const Risk = 1000;
            const baseValue = base(Safe, Risk, 2);
            return await saveScenarioSelectedSecondStage({
                valor_selecionado: 0,
                mediana: baseValue?.toFixed(0),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
            });
            break;
        default:
            return await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
}

export const saveSecondStage = async (data: any) => {
    const Safe = 0;
    const Risk = 1000;
    let aggregate: any;

    const baseValue = base(Safe, Risk, 2) ?? 0;

    switch (data.optionSelected) {
        case ("B"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
        case ("A"):
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
    }
    return await saveScenarioSelectedSecondStage({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk
    });
}

export const getThirdStageValues = async (data: any) => {
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueThirdStage({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }

            const Safe = 0;
            const Risk = await getSecondForThird(data);
            const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
            return await saveScenarioSelectedThirdStage({
                valor_selecionado: 0,
                mediana: Number(baseValue!.toFixed(0)), // Updated to use toFixed(0)
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Number(Risk?.valor_selecionado),
            });
            break;
        default:
            return await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
}

export const saveThirdStage = async (data: any) => {
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
    return saveScenarioSelectedThirdStage({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.valor_selecionado
    });
}


export const result = async (data: any) => {
    console.log(data);
    const firstFirstStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 1 });
    const lastFirstStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 1 });

    const firstThirdStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 3 });
    const lastThirdStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 3 });

    const result = ((Number(firstFirstStage?.mediana) ?? 0) / (Number(lastFirstStage?.mediana) ?? 1)) /
        ((Number(firstThirdStage?.mediana) ?? 0) / (Number(lastThirdStage?.mediana) ?? 1));

    return getProfile({ indice: result, usuario: await getbyId(data)});
}

function getProfile(data: any) {
    if (data.indice < 1) {
        return {
            usuario:data.usuario,
            valor: data.indice,
            perfil: "Tolerante à perda",
            descricao: "Você valoriza segurança e prefere evitar riscos.",
        };
    } else if (data.indice = 1) {
        return {
            usuario:data.usuario,
            valor: data.indice,
            perfil: "Neutro à perda",
            descricao: "Você aceita algum risco em troca de retorno moderado.",
        };
    } else {
        return {
            usuario:data.usuario,
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