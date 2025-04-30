"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.result = exports.saveThirdStage = exports.getThirdStageValues = exports.saveSecondStage = exports.getSecondStageValues = exports.saveFirstStage = exports.getFirstStageValues = void 0;
const repository_1 = require("./repository");
const getFirstStageValues = async (data) => {
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueFirstStage)({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await (0, repository_1.searchValueFirstStage)({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }
            const Safe = 1000;
            const Risk = 0;
            const baseValue = base(Safe, Risk, 1);
            return await (0, repository_1.saveScenarioSelectedFirstStage)({
                valor_selecionado: 0,
                mediana: baseValue?.toFixed(0),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
            });
            break;
        default:
            return await (0, repository_1.searchValueFirstStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
};
exports.getFirstStageValues = getFirstStageValues;
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
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
    }
    return await (0, repository_1.saveScenarioSelectedFirstStage)({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe
    });
};
exports.saveFirstStage = saveFirstStage;
const getSecondStageValues = async (data) => {
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueSecondStage)({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await (0, repository_1.searchValueSecondStage)({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }
            const Safe = 0;
            const Risk = 1000;
            const baseValue = base(Safe, Risk, 2);
            return await (0, repository_1.saveScenarioSelectedSecondStage)({
                valor_selecionado: 0,
                mediana: baseValue?.toFixed(0),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
            });
            break;
        default:
            return await (0, repository_1.searchValueSecondStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
};
exports.getSecondStageValues = getSecondStageValues;
const saveSecondStage = async (data) => {
    const Safe = 0;
    const Risk = 1000;
    let aggregate;
    const baseValue = base(Safe, Risk, 2) ?? 0;
    switch (data.optionSelected) {
        case ("B"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
        case ("A"):
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
    }
    return await (0, repository_1.saveScenarioSelectedSecondStage)({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk
    });
};
exports.saveSecondStage = saveSecondStage;
const getThirdStageValues = async (data) => {
    switch (data.scenario) {
        case 0:
            const scenario = await (0, repository_1.searchValueThirdStage)({
                usuario_id: data.userId,
                pergunta: data.scenario
            });
            if (scenario) {
                return await (0, repository_1.searchValueThirdStage)({
                    usuario_id: data.userId,
                    pergunta: data.scenario
                });
            }
            const Safe = 0;
            const Risk = await getSecondForThird(data);
            const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
            return await (0, repository_1.saveScenarioSelectedThirdStage)({
                valor_selecionado: 0,
                mediana: Number(baseValue?.toFixed(0)),
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Number(Risk?.valor_selecionado),
            });
            break;
        default:
            return await (0, repository_1.searchValueThirdStage)({
                usuario_id: data.userId,
                pergunta: data.scenario - 1
            });
            break;
    }
};
exports.getThirdStageValues = getThirdStageValues;
const saveThirdStage = async (data) => {
    const Safe = 0;
    const Risk = await getSecondForThird(data);
    let aggregate;
    const baseValue = base(Safe, Number(Risk?.valor_selecionado), 3);
    switch (data.optionSelected) {
        case ("A"):
            const adjustedBaseValue = baseValue * -1;
            aggregate = data.valueSelected + ((adjustedBaseValue ?? 0) / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected - ((baseValue ?? 0) / (2 ** data.scenario));
            break;
    }
    return (0, repository_1.saveScenarioSelectedThirdStage)({
        valor_selecionado: data.valueSelected,
        mediana: aggregate.toFixed(0),
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Risk?.valor_selecionado
    });
};
exports.saveThirdStage = saveThirdStage;
const result = async (data) => {
    const firstFirstStage = await (0, repository_1.searchValueFirstStage)({ usuario_id: data.usuario_id, pergunta: 0 });
    const lastFirstStage = await (0, repository_1.searchValueFirstStage)({ usuario_id: data.usuario_id, pergunta: 6 });
    const firstThirdStage = await (0, repository_1.searchValueFirstStage)({ usuario_id: data.usuario_id, pergunta: 0 });
    const lastThirdStage = await (0, repository_1.searchValueFirstStage)({ usuario_id: data.usuario_id, pergunta: 5 });
    const result = ((Number(firstFirstStage?.mediana) ?? 0) / (Number(lastFirstStage?.mediana) ?? 1)) /
        ((Number(firstThirdStage?.mediana) ?? 0) / (Number(lastThirdStage?.mediana) ?? 1));
    console.log(result);
};
exports.result = result;
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
        pergunta: 6
    });
}
