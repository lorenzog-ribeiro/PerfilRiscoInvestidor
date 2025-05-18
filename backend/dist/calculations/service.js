"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.saveThirdStage = exports.getThirdStageValues = exports.saveSecondStage = exports.getSecondStageValues = exports.saveFirstStage = exports.getFirstStageValues = void 0;
const repository_1 = require("./repository");
const repository_2 = require("../user/repository");
// Função para obter a última tentativa de um usuário em uma determinada fase
// const getLastattempt = async (userId: string, stage: number, scenario: number) => {
//     const lastattempt = await searchLastattempt(userId, stage, scenario);
//     return lastattempt;
// }
function roundToNearest10(value) {
    const precisionValue = parseFloat(value.toFixed(2));
    return Math.round(precisionValue / 10) * 10;
}
// Função para buscar os valores da primeira fase
const getFirstStageValues = async (data) => {
    // const tentativa = await getLastattempt(data.userId, 1, data.scenario);
    console.log(data);
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueFirstStage)({
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
            return await (0, repository_1.saveScenarioSelectedFirstStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
                tentativa: data.attempt
            });
            break;
        default:
            return await (0, repository_1.searchValueFirstStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
};
exports.getFirstStageValues = getFirstStageValues;
// Função para salvar os dados da primeira fase
const saveFirstStage = async (data) => {
    const Safe = 1000;
    const Risk = 0;
    let aggregate;
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
    return await (0, repository_1.saveScenarioSelectedFirstStage)({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe,
        tentativa: data.attempt
    });
};
exports.saveFirstStage = saveFirstStage;
// Função para buscar os valores da segunda fase
const getSecondStageValues = async (data) => {
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueSecondStage)({
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
            return await (0, repository_1.saveScenarioSelectedSecondStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
                tentativa: data.attempt
            });
            break;
        default:
            return await (0, repository_1.searchValueSecondStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
};
exports.getSecondStageValues = getSecondStageValues;
// Função para salvar os dados da segunda fase
const saveSecondStage = async (data) => {
    const Safe = 0;
    const Risk = 1000;
    let aggregate;
    const baseValue = base(Safe, Risk, 2) ?? 0;
    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - (baseValue / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
    }
    return await (0, repository_1.saveScenarioSelectedSecondStage)({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk,
        tentativa: data.attempt
    });
};
exports.saveSecondStage = saveSecondStage;
// Função para buscar os valores da terceira fase
const getThirdStageValues = async (data) => {
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueThirdStage)({
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
            return await (0, repository_1.saveScenarioSelectedThirdStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Number(Risk?.valor_selecionado),
                tentativa: data.attempt
            });
            break;
        default:
            return await (0, repository_1.searchValueThirdStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa: data.attempt
            });
            break;
    }
};
exports.getThirdStageValues = getThirdStageValues;
// Função para salvar os dados da terceira fase
const saveThirdStage = async (data) => {
    const Safe = 0;
    const Risk = await getSecondForThird(data);
    let aggregate;
    const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
    const adjustedBaseValue = baseValue * -1;
    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - ((adjustedBaseValue ?? 0) / (2 ** data.scenario));
            break;
        case ("B"):
            console.log(adjustedBaseValue, data.valueSelected);
            aggregate = data.valueSelected + ((adjustedBaseValue ?? 0) / (2 ** data.scenario));
            break;
    }
    return await (0, repository_1.saveScenarioSelectedThirdStage)({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.valor_selecionado,
        tentativa: data.attempt
    });
};
exports.saveThirdStage = saveThirdStage;
const result = async (data) => {
    const firstFirstStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'asc', stage: 1 });
    const lastFirstStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'desc', stage: 1 });
    const resultFirst = ((Number(firstFirstStage?.mediana)) / (Number(lastFirstStage?.mediana)));
    const firstThirdStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'asc', stage: 3 });
    const lastThirdStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'desc', stage: 3 });
    const resultThird = ((Number(firstThirdStage?.mediana)) / (Number(lastThirdStage?.mediana)));
    const result = resultThird / resultFirst;
    return getProfile({ indice: result, perda: resultThird, ganho: resultFirst, usuario: await (0, repository_2.getbyId)(data) });
};
exports.result = result;
function getProfile(data) {
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
    }
    else if (data.indice === 1.0) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Neutro à perda",
            curta: "Você valoriza ganhos e perdas de forma equilibrada.",
            descricao: "Ao tomar decisões, você considera igualmente o risco de perder e a chance de ganhar. Sua preferência indica um comportamento racional e ponderado frente ao risco.",
        };
    }
    else if (data.indice > 1.0 && data.indice <= 1.5) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perda: data.perda,
            ganho: data.ganho,
            perfil: "Averso à perda",
            curta: "Você sente mais o impacto das perdas do que o prazer pelos ganhos.",
            descricao: "Para aceitar correr um risco, é necessário que o ganho potencial seja maior que a possível perda. Isso demonstra cautela e preocupação em proteger seus recursos.",
        };
    }
    else {
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
function base(Safe, Risk, type) {
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
async function getSecondForThird(data) {
    return await (0, repository_1.searchLastValueSecondStage)({
        usuario_id: data.userId,
        tentativa: data.attempt
    });
}
