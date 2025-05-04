"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const routerScenario = (0, express_1.Router)();
//1
routerScenario.post("/win", controller_1.winScenario);
routerScenario.get("/getwin", controller_1.getWinScenario);
//2
routerScenario.post("/loss", controller_1.lossSCenario);
routerScenario.get("/getloss", controller_1.getLossScenario);
//3
routerScenario.post("/onlyloss", controller_1.onlyLossScenario);
routerScenario.get("/getonlyloss", controller_1.getOnlyLossScenario);
routerScenario.get("/result", controller_1.calcResult);
exports.default = routerScenario;
