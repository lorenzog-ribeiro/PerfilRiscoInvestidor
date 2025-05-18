"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const repository_1 = require("./repository");
const createUser = async (data) => {
    const existingUser = await (0, repository_1.getUnique)(data.email);
    if (existingUser) {
        const userModel = {
            id: existingUser.id,
            tentativa: (existingUser.tentativa ?? 0) + 1
        };
        const updatedUser = await (0, repository_1.updateAttempt)(userModel);
        return updatedUser;
    }
    data.tentativa = 1;
    const newUser = await (0, repository_1.createUserProfile)(data);
    return newUser;
};
exports.createUser = createUser;
