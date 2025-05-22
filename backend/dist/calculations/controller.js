"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcResult = exports.onlyLossScenario = exports.getOnlyLossScenario = exports.lossSCenario = exports.getLossScenario = exports.winScenario = exports.getWinScenario = void 0;
const service_1 = require("./service");
// const sessionAnswers: Record<string, any[]> = {};
//1
const getWinScenario = async (req, res) => {
    try {
        const { scenario, userId, attempt } = req.query;
        if (!scenario || !userId || !attempt) {
            res.status(500).json({ error: req.query });
        }
        const forecast = await (0, service_1.getFirstStageValues)({
            scenario: parseInt(scenario || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.getWinScenario = getWinScenario;
const winScenario = async (req, res) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;
        const forecast = await (0, service_1.saveFirstStage)({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });
        res.status(200).json({ forecast });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.winScenario = winScenario;
//2
const getLossScenario = async (req, res) => {
    try {
        const { scenario, userId, attempt } = req.query;
        const forecast = await (0, service_1.getSecondStageValues)({
            scenario: parseInt(scenario || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
        console.log(forecast);
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.getLossScenario = getLossScenario;
const lossSCenario = async (req, res) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;
        console.log(scenario, optionSelected, valueSelected, userId);
        const forecast = await (0, service_1.saveSecondStage)({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });
        res.status(200).json({ forecast });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.lossSCenario = lossSCenario;
//3
const getOnlyLossScenario = async (req, res) => {
    try {
        const { scenario, userId, attempt } = req.query;
        const forecast = await (0, service_1.getThirdStageValues)({
            scenario: parseInt(scenario || "0"),
            userId: userId,
            attempt: Number(attempt)
        });
        res.status(200).json({ forecast });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.getOnlyLossScenario = getOnlyLossScenario;
const onlyLossScenario = async (req, res) => {
    try {
        const { scenario, optionSelected, valueSelected, userId, attempt } = req.body;
        const forecast = await (0, service_1.saveThirdStage)({ scenario, optionSelected, valueSelected: parseFloat(valueSelected), userId, attempt: Number(attempt) });
        res.status(200).json({ forecast });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.onlyLossScenario = onlyLossScenario;
const calcResult = async (req, res) => {
    try {
        const { userId } = req.query;
        const profile = await (0, service_1.result)(userId);
        res.status(200).json({ profile });
    }
    catch (error) {
        res.status(500).json({ error: "Erro no cálculo" });
    }
};
exports.calcResult = calcResult;
