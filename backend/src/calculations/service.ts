import {
    searchValueFirstStage,
    saveScenarioSelectedFirstStage,
    saveScenarioSelectedSecondStage,
    saveScenarioSelectedThirdStage
} from "./repository";

export const getFirstStageValues = async (data: any) => {
    const Safe = 1000;
    const Risk = 0;

    switch (data.scenario) {
        case 1:
            const scenario = await searchValueFirstStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });
            if (!scenario) {
                const baseValue = base(Safe, Risk);

                return await saveScenarioSelectedFirstStage({
                    valor_selecionado: data.valueSelected,
                    mediana: baseValue,
                    lado_selecionado: data.optionSelected,
                    usuario_id: data.userId,
                    pergunta: 0
                });
            }
            return await searchValueFirstStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });

            break;
        default:
            return await searchValueFirstStage({
                usuario_id: data.usuario_id,
                pergunta: data.scenario
            });
            break;
    }
}

export const saveFirstStage = async (data: any) => {
    const Safe = 1000;
    const Risk = 0;
    let aggregate: any;

    const baseValue = base(Safe, Risk);

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

export const saveSecondStage = async (data: any) => {
    return saveScenarioSelectedSecondStage(data);
}

export const saveThirdStage = async (data: any) => {
    return saveScenarioSelectedThirdStage(data);
}

function base(Safe: number, Risk: number) {
    return (((Safe * 1 / 2) + (Risk * 1 / 2)) - (0 * 0) / 100);
}