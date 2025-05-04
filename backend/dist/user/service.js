"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const repository_1 = require("./repository");
const createUser = async (data) => {
    const existingUser = await (0, repository_1.getUnique)(data.email);
    if (existingUser) {
        return existingUser.id;
    }
    const newUser = await (0, repository_1.createUserProfile)(data);
    return newUser.id;
};
exports.createUser = createUser;
