import {
    searchValueFirstStage,
    searchValueSecondStage,
    saveScenarioSelectedFirstStage,
    saveScenarioSelectedSecondStage,
    saveScenarioSelectedThirdStage,
    searchValueThirdStage,
    searchResultCalc,
    searchLastValueSecondStage
} from "./repository";
import { getbyId } from '../user/repository';

// Função para obter a última tentativa de um usuário em uma determinada fase
// const getLastattempt = async (userId: string, stage: number, scenario: number) => {
//     const lastattempt = await searchLastattempt(userId, stage, scenario);
//     return lastattempt;
// }

function roundToNearest10(value: number) {
    const precisionValue = parseFloat(value.toFixed(2));
    return Math.round(precisionValue / 10) * 10;
}

// Função para buscar os valores da primeira fase
export const getFirstStageValues = async (data: any) => {
    // const tentativa = await getLastattempt(data.userId, 1, data.scenario);
    console.log(data)
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa: data.attempt
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
                tentativa: data.attempt
            });
            break;
        default:
            return await searchValueFirstStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
}

// Função para salvar os dados da primeira fase
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

    // Verificar a diferença mínima
    return await saveScenarioSelectedFirstStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe,
        tentativa: data.attempt
    });
}


// Função para buscar os valores da segunda fase
export const getSecondStageValues = async (data: any) => {
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa: data.attempt
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
                tentativa: data.attempt
            });
            break;
        default:
            return await searchValueSecondStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
}

// Função para salvar os dados da segunda fase
export const saveSecondStage = async (data: any) => {
    const Safe = 0;
    const Risk = 1000;
    let aggregate: any;

    const baseValue = base(Safe, Risk, 2) ?? 0;

    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - (baseValue / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
    }
    console.log(data.valueSelected,baseValue/(2 ** data.scenario))
    return await saveScenarioSelectedSecondStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk,
        tentativa: data.attempt
    });

}

// Função para buscar os valores da terceira fase
export const getThirdStageValues = async (data: any) => {
    switch (data.scenario) {
        case 0:
            const scenario = await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario,
                tentativa: data.attempt
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
                tentativa: data.attempt
            });
            break;
        default:
            return await searchValueThirdStage({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
}

// Função para salvar os dados da terceira fase
export const saveThirdStage = async (data: any) => {
    const Safe = 0;
    const Risk = await getSecondForThird(data);
    let aggregate: any;

    const baseValue = base(Safe, Number(Risk?.mediana), 3);

    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - ((baseValue ?? 0) / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected + ((baseValue ?? 0) / (2 ** data.scenario));
            break;
    }

    return await saveScenarioSelectedThirdStage({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.mediana,
        tentativa: data.attempt
    });
}


export const result = async (data: any) => {
    const firstFirstStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 1 });
    const lastFirstStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 1 });

    const resultFirst = ((Number(firstFirstStage?.mediana)) / (Number(lastFirstStage?.mediana)));

    const firstThirdStage = await searchResultCalc({ usuario_id: data, order: 'asc', stage: 3 });
    const lastThirdStage = await searchResultCalc({ usuario_id: data, order: 'desc', stage: 3 });
    const resultThird = ((Number(firstThirdStage?.mediana)) / (Number(lastThirdStage?.mediana)));

    const result = resultThird / resultFirst;

    return getProfile({ indice: result, perda: resultThird, ganho: resultFirst, usuario: await getbyId(data) });
}

function getProfile(data: any) {
    if (data.indice < 1.0) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Tolerante à perda",
            curta: "Você tende a aceitar riscos com mais facilidade.",
            descricao: "Para você, a possibilidade de ganhar é mais atrativa do que o medo de perder. Sua tomada de decisão é orientada por oportunidades, mesmo que exista alguma chance de prejuízo.",
        };
    } else if (data.indice === 1.0) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Neutro à perda",
            curta: "Você valoriza ganhos e perdas de forma equilibrada.",
            descricao: "Ao tomar decisões, você considera igualmente o risco de perder e a chance de ganhar. Sua preferência indica um comportamento racional e ponderado frente ao risco.",
        };
    } else if (data.indice > 1.0 && data.indice <= 1.5) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Averso à perda",
            curta: "Você sente mais o impacto das perdas do que o prazer pelos ganhos.",
            descricao: "Para aceitar correr um risco, é necessário que o ganho potencial seja maior que a possível perda. Isso demonstra cautela e preocupação em proteger seus recursos.",
        };
    } else {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Fortemente averso à perda",
            curta: "Você evita perdas a qualquer custo.",
            descricao: "Seu comportamento indica forte sensibilidade a prejuízos. Você só aceita correr riscos quando o retorno é muito alto em relação à possível perda. Essa postura reflete um perfil cauteloso e protetor.",
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
    return await searchLastValueSecondStage({
        usuario_id: data.userId,
        tentativa: data.attempt
    });
}