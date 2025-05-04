"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const routerUser = (0, express_1.Router)();
routerUser.post("/create-user", controller_1.create);
exports.default = routerUser;
