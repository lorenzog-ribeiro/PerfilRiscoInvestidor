"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueQuestions = exports.getQuestionCount = void 0;
const repository_1 = require("./repository");
const getQuestionCount = async () => {
    return (0, repository_1.getCount)();
};
exports.getQuestionCount = getQuestionCount;
const getUniqueQuestions = async (data) => {
    return (0, repository_1.getUnique)(data);
};
exports.getUniqueQuestions = getUniqueQuestions;
