import { Request, Response } from "express";
import { save } from "./service";

export function saveAnswers(req: Request, res: Response) {
    try {
        const { resposta, pergunta_id, usuario_id } = req.body;
        const savedResponse = save({ resposta, pergunta_id, usuario_id });
        res.status(200).json();
    } catch (error: any) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
} 