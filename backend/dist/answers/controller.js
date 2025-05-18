"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAnswers = saveAnswers;
const service_1 = require("./service");
function saveAnswers(req, res) {
    try {
        const { resposta, pergunta_id, usuario_id, tentativa } = req.body;
        const savedResponse = (0, service_1.save)({
            resposta,
            pergunta_id,
            usuario_id,
            tentativa: Number(tentativa)
        });
        res.status(200).json();
    }
    catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
}
