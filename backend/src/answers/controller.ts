import { Request, Response } from "express";
import { save } from "./service";

export function saveAnswers(req: Request, res: Response) {
    try {
        const answers = save(req.body);
        res.status(200).json();
    } catch (error: any) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
}