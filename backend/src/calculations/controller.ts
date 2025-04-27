import { Request, Response } from "express";
import { getFirstStageValues, getSecondStageValues, saveFirstStage, saveSecondStage, saveThirdStage } from "./service";

// const sessionAnswers: Record<string, any[]> = {};

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

export const onlyLossScenario = async (req: Request, res: Response) => {
    try {
        const { aOption, bOption, scenario, optionSelected, usuario_id } = req.body;
        const forecast: number[] = [0];

        const base = (((aOption * 1 / 2) + (bOption * 1 / 2)) - (0 * 0) / 100);
        var aggregate = base;
        forecast.push(parseFloat(aggregate.toFixed(2)));

        switch (optionSelected) {
            case ("A"):
                for (var i = 1; i < scenario; i++) {
                    aggregate = aggregate + (base / 2 ** i);
                    forecast.push(parseFloat(aggregate.toFixed(2)));
                }
                break;
            case ("B"):
                for (var i = 1; i < scenario; i++) {
                    aggregate = aggregate - (base / 2 ** i);
                    forecast.push(parseFloat(aggregate.toFixed(2)));
                }
                break;
        }

        res.status(200).json({ forecast });
    } catch (error: any) {

    }
}

// tentando simplificar o codigo dentro das funcoes.
function calculateForecast(aOption: number, bOption: number, scenario: number, optionSelected: string) {
    const forecast: number[] = [0];

    const base = (((aOption * 1 / 2) + (bOption * 1 / 2)) - (0 * 0) / 100);
    var aggregate = base;
    forecast.push(parseFloat(aggregate.toFixed(2)));

    switch (optionSelected) {
        case ("A"):
            for (var i = 1; i < scenario; i++) {
                aggregate = aggregate + (base / 2 ** i);
                forecast.push(parseFloat(aggregate.toFixed(2)));
            }
            break;
        case ("B"):
            for (var i = 1; i < scenario; i++) {
                aggregate = aggregate - (base / 2 ** i);
                forecast.push(parseFloat(aggregate.toFixed(2)));
            }
            break;
    }

    return forecast;
}