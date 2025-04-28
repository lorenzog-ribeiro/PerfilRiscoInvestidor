import {
    searchValueFirstStage,
    searchValueSecondStage,
    saveScenarioSelectedFirstStage,
    saveScenarioSelectedSecondStage,
    saveScenarioSelectedThirdStage,
    searchValueThirdStage
} from "./repository";

export const getFirstStageValues = async (data: any) => {
    const Safe = 1000;
    const Risk = 0;

    switch (data.scenario) {
        case 0:
            const scenario = await searchValueFirstStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueFirstStage({
                    usuario_id: data.usuario_id,
                    pergunta: data.scenario
                });
            }
            const baseValue = base(Safe, Risk, 1);
            return await saveScenarioSelectedFirstStage({
                valor_selecionado: 0,
                mediana: baseValue,
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: Safe,
            });

            break;
        default:
            return await searchValueFirstStage({
                usuario_id: data.usuario_id,
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
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
    }

    return await saveScenarioSelectedFirstStage({
        valor_selecionado: data.valueSelected,
        mediana: aggregate,
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: Safe
    });
}

export const getSecondStageValues = async (data: any) => {
    const Safe = 0;
    const Risk = 1000;

    switch (data.scenario) {
        case 0:
            const scenario = await searchValueSecondStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueSecondStage({
                    usuario_id: data.usuario_id,
                    pergunta: data.scenario
                });
            }
            const baseValue = base(Safe, Risk, 2);
            return await saveScenarioSelectedFirstStage({
                valor_selecionado: 0,
                mediana: baseValue,
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: -Risk,
            });
            break;
        default:
            return await searchValueSecondStage({
                usuario_id: data.usuario_id,
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
        mediana: aggregate,
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: -Risk
    });
}

export const getThirdStageValues = async (data: any) => {
    let safeBase = 0;
    const initialRisk = await searchValueSecondStage({
        usuario_id: data.usuario_id,
        pergunta: 6
    });

    const Risk = initialRisk?.mediana ?? 0;

    safeBase = ((((Number(Risk) * 1) / 2) + (0 * 1 / 2)) - (0 * 0) / 100);

    switch (data.scenario) {
        case 0:
            const scenario = await searchValueThirdStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });
            if (scenario) {
                return await searchValueThirdStage({
                    usuario_id: data.usuario_id,
                    pergunta: data.scenario
                });
            }

            const baseValue = base(safeBase, Number(Risk), 1);
            return await saveScenarioSelectedThirdStage({
                valor_selecionado: 0,
                mediana: baseValue,
                lado_selecionado: null,
                usuario_id: data.userId,
                pergunta: 0,
                valor_fixo: 0,
            });

            break;
        default:
            return await searchValueThirdStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario - 1
            });
            break;
    }
}

export const saveThirdStage = async (data: any) => {
    const Safe = 1000;
    const Risk = 0;
    let aggregate: any;

    const baseValue = base(Safe, Risk, 1) ?? 0;

    switch (data.optionSelected) {
        case ("A"):
            aggregate = data.valueSelected + (baseValue / (2 ** data.scenario));
            break;
        case ("B"):
            aggregate = data.valueSelected - (baseValue / 2 ** data.scenario);
            break;
    }
    return saveScenarioSelectedThirdStage({
        valor_selecionado: data.valueSelected,
        mediana: data.valueSelected,
        lado_selecionado: data.optionSelected,
        usuario_id: data.userId,
        pergunta: data.scenario,
        valor_fixo: 0
    });
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
            return (((0 * 1) + (0 * 0)) - (Risk * 1 / 2) / (1 / 2));
            break;
    }
}