"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnique = exports.getQuestionsCount = void 0;
const service_1 = require("./service");
const getQuestionsCount = async (req, res) => {
    try {
        const questions = await (0, service_1.getQuestionCount)();
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
};
exports.getQuestionsCount = getQuestionsCount;
const getUnique = async (req, res) => {
    try {
        const query = Number(req.query.question);
        const questions = await (0, service_1.getUniqueQuestions)(query);
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
};
exports.getUnique = getUnique;
