"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const routerAnswers = (0, express_1.Router)();
routerAnswers.post("/save-answer", controller_1.saveAnswers);
exports.default = routerAnswers;
