"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.saveThirdStage = exports.getThirdStageValues = exports.saveSecondStage = exports.getSecondStageValues = exports.saveFirstStage = exports.getFirstStageValues = void 0;
const repository_1 = require("./repository");
const repository_2 = require("../user/repository");
// Função para obter a última tentativa de um usuário em uma determinada fase
const getLastAttempt = async (userId, stage, scenario) => {
    const lastAttempt = await (0, repository_1.searchLastAttempt)(userId, stage, scenario);
    return lastAttempt;
};
function roundToNearest10(value) {
    const precisionValue = parseFloat(value.toFixed(2)); // Ajusta para 2 casas decimais
    return Math.round(precisionValue / 10) * 10;
}
// Função para buscar os valores da primeira fase
const getFirstStageValues = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 1, data.scenario);
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueFirstStage)({
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
            return await (0, repository_1.saveScenarioSelectedFirstStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
                tentativa
            });
            break;
        default:
            return await (0, repository_1.searchValueFirstStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
};
exports.getFirstStageValues = getFirstStageValues;
// Função para salvar os dados da primeira fase
const saveFirstStage = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 1, data.scenario);
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
        tentativa
    });
};
exports.saveFirstStage = saveFirstStage;
// Função para buscar os valores da segunda fase
const getSecondStageValues = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 2, data.scenario);
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueSecondStage)({
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
            return await (0, repository_1.saveScenarioSelectedSecondStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
                tentativa
            });
            break;
        default:
            return await (0, repository_1.searchValueSecondStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
};
exports.getSecondStageValues = getSecondStageValues;
// Função para salvar os dados da segunda fase
const saveSecondStage = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 2, data.scenario);
    const Safe = 0;
    const Risk = 1000;
    let aggregate;
    const baseValue = base(Safe, Risk, 2) ?? 0;
    switch (data.optionSelected) {
        case ("B"):
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
        case ("A"):
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
        tentativa
    });
};
exports.saveSecondStage = saveSecondStage;
// Função para buscar os valores da terceira fase
const getThirdStageValues = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 3, data.scenario);
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueThirdStage)({
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
            return await (0, repository_1.saveScenarioSelectedThirdStage)({
                valor_selecionado: 0,
                mediana: roundToNearest10(baseValue),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Number(Risk?.valor_selecionado),
                tentativa
            });
            break;
        default:
            return await (0, repository_1.searchValueThirdStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1,
                tentativa
            });
            break;
    }
};
exports.getThirdStageValues = getThirdStageValues;
// Função para salvar os dados da terceira fase
const saveThirdStage = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 3, data.scenario);
    const Safe = 0;
    const Risk = await getSecondForThird(data);
    let aggregate;
    const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected - ((baseValue ?? 0) / (2 ** data.scenario));
            break;
        case ("B"):
            //const adjustedBaseValue = baseValue! * -1;
            aggregate = data.valueSelected + ((baseValue ?? 0) / (2 ** data.scenario));
            break;
    }
    return await (0, repository_1.saveScenarioSelectedThirdStage)({
        valor_selecionado: data.valueSelected,
        mediana: roundToNearest10(aggregate),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.valor_selecionado,
        tentativa
    });
};
exports.saveThirdStage = saveThirdStage;
const result = async (data) => {
    const firstFirstStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'asc', stage: 1 });
    const lastFirstStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'desc', stage: 1 });
    const firstThirdStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'asc', stage: 3 });
    const lastThirdStage = await (0, repository_1.searchResultCalc)({ usuario_id: data, order: 'desc', stage: 3 });
    const result = ((Number(firstThirdStage?.mediana)) / (Number(lastThirdStage?.mediana))) /
        ((Number(firstFirstStage?.mediana)) / (Number(lastFirstStage?.mediana)));
    return getProfile({ indice: result, usuario: await (0, repository_2.getbyId)(data) });
};
exports.result = result;
function getProfile(data) {
    if (data.indice < 1) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Tolerante à perda",
            descricao: "Você valoriza segurança e prefere evitar riscos.",
        };
    }
    else if (data.indice = 1) {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Neutro à perda",
            descricao: "Você aceita algum risco em troca de retorno moderado.",
        };
    }
    else {
        return {
            usuario: data.usuario,
            valor: data.indice,
            perfil: "Avesso à perda",
            descricao: "Você busca maiores retornos mesmo com maior risco.",
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
    return await (0, repository_1.searchValueSecondStage)({
        usuario_id: data.userId,
        pergunta: 5
    });
}
