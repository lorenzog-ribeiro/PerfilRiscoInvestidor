import { saveScenarioSelectedFirstStage, saveScenarioSelectedSecondStage, saveScenarioSelectedThirdStage } from "./repository";

export const saveFirstStage = async (data: any) => {
    return saveScenarioSelectedFirstStage(data);
}

export const saveSecondStage = async (data: any) => {
    return saveScenarioSelectedSecondStage(data);
}

export const saveThirdStage = async (data: any) => {
    return saveScenarioSelectedThirdStage(data);
}