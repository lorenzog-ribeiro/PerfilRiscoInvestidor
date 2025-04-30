"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const service_1 = require("./service");
const create = async (req, res) => {
    try {
        const user = await (0, service_1.createUser)(req.body);
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Erro ao buscar informações:", error);
        res.status(500).json({ error: "Erro ao buscar informações", details: error.message });
    }
};
exports.create = create;
