"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const repository_1 = require("./repository");
const save = async (data) => {
    return (0, repository_1.saveAnswers)(data);
};
exports.save = save;
