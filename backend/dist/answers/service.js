"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = void 0;
const repository_1 = require("./repository");
const getLastAttempt = async (userId, stage) => {
    const lastAttempt = await (0, repository_1.searchLastAttempt)(userId, stage);
    return lastAttempt || 1;
};
const save = async (data) => {
    const tentativa = await getLastAttempt(data.userId, 1);
    const dataWithAttempt = {
        ...data,
        tentativa
    };
    console.log(dataWithAttempt);
    return (0, repository_1.saveAnswers)(dataWithAttempt);
};
exports.save = save;
