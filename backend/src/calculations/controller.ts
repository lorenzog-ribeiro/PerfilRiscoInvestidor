import { Request, Response } from "express";
import { getFirstStageValues, getSecondStageValues, getThirdStageValues, saveFirstStage, saveSecondStage, saveThirdStage, result } from "./service";

// const sessionAnswers: Record<string, any[]> = {};
//1
export const getWinScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId, attempt } = req.query;

        if (!scenario || !userId || !attempt) {
            res.status(500).json({ error: req.query });
        }

        const forecast = await getFirstStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const winScenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;

        const forecast = await saveFirstStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
//2
export const getLossScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId, attempt } = req.query;

        const forecast = await getSecondStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
        console.log(forecast)
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const lossSCenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;
        console.log(scenario, optionSelected, valueSelected, userId)

        const forecast = await saveSecondStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
//3
export const getOnlyLossScenario = async (req: Request, res: Response) => {

    try {
        const { scenario, userId, attempt } = req.query;

        const forecast = await getThirdStageValues({
            scenario: parseInt(scenario as string || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}
export const onlyLossScenario = async (req: Request, res: Response) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;

        const forecast = await saveThirdStage({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });

        res.status(200).json({ forecast });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
}

export const calcResult = async (req: Request, res: Response) => {
    try {
        const { userId, tentativa } = req.query;
        const profile = await result({userId, tentativa});

        res.status(200).json({ profile });
    }
    catch (error: any) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
} 