import { Request, Response } from "express";
import { getFirstStageValues, getSecondStageValues, getThirdStageValues, saveFirstStage, saveSecondStage, saveThirdStage } from "./service";

// const sessionAnswers: Record<string, any[]> = {};
//1
export const getWinScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId } = req.query;

        const forecast = await getFirstStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId
        });
        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const winScenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId } = req.body;

        const forecast = await saveFirstStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
//2
export const getLossScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId } = req.query;

        const forecast = await getSecondStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId
        });
        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const lossSCenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId } = req.body;

        const forecast = await saveSecondStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
//3
export const getOnlyLossScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId } = req.query;

        const forecast = await getThirdStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId
        });
        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const onlyLossScenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId } = req.body;

        const forecast = await saveThirdStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}

export const calcResult = async (req: Request, res: Response) =>{
    try {
        const { userId } = req.body;

        const forecast = await result(userId);

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}