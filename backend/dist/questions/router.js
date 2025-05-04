"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/questions/count', controller_1.getQuestionsCount);
router.get('/questions', controller_1.getUnique);
exports.default = router;
