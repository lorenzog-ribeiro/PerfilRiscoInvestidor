import { Request, Response } from "express";
import { getQuestionCount, getUniqueQuestions } from "./service";

export const getQuestionsCount = async (req: Request, res: Response) => {
    try {
        const questions = await getQuestionCount();
        res.status(200).json(questions);
    } catch (error: any) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
}

export const getUnique = async (req: Request, res: Response) => {
    try {
        const query = Number(req.query.question);
        const questions = await getUniqueQuestions(query);
        res.status(200).json(questions);
    } catch (error: any) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
}