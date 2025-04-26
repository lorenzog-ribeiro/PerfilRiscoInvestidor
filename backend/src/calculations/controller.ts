import { Request, Response } from "express";

export const winScenario = async (req: Request, res: Response) => {
    try {
        const { aOption, bOption, scenario } = req.body;
        const forecast: number[] = [0];

        const base = (((aOption * 1 / 2) + (bOption * 1 / 2)) - (0 * 0) / 100);
        var aggregate = base;
        forecast.push(parseFloat(aggregate.toFixed(2)));

        for (var i = 1; i < scenario; i++) {
            aggregate = aggregate + (base / 2 ** i);
            forecast.push(parseFloat(aggregate.toFixed(2)));
        }
        res.status(200).json({ forecast });
    } catch (error: any) {

    }
}

export const lossSCenario = async (req: Request, res: Response) => {
    try {
        const { aOption, bOption, scenario } = req.body;
        const forecast: number[] = [0];

        const base = (((aOption * 100) + (aOption * 0)) - (bOption * 1 / 2) / (1 / 2)) * -1;
        var aggregate = base;

        for (var i = 1; i < scenario; i++) {
            aggregate = aggregate + (base / 2 ** i);
            console.log(aggregate);
            forecast.push(parseFloat(aggregate.toFixed(2)));
        }
        res.status(200).json({ forecast });
    } catch (error: any) {
    }
}

export const onlyLossScenario = async (req: Request, res: Response) => {
    try {
        const { aOption, bOption, scenario } = req.body;
        const forecast: number[] = [0];

        const base = (((aOption * 1 / 2) + (bOption * 1 / 2)) - (0 * 0) / 100);
        var aggregate = base;

        for (var i = 1; i < scenario; i++) {
            aggregate = aggregate + (base / 2 ** i);
            forecast.push(parseFloat(aggregate.toFixed(2)));
        }
        res.status(200).json({ forecast });
    } catch (error: any) {

    }
}