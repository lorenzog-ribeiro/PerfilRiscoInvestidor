"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router_1 = __importDefault(require("./questions/router"));
const express_2 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const router_2 = __importDefault(require("./user/router"));
const router_3 = __importDefault(require("./answers/router"));
const router_4 = __importDefault(require("./calculations/router"));
const app = (0, express_2.default)();
const route = (0, express_1.Router)();
app.use((0, cors_1.default)());
app.use(express_2.default.json());
app.use('/', router_1.default);
app.use('/', router_2.default);
app.use('/', router_3.default);
app.use('/', router_4.default);
app.use(route);
route.get('/questions', (req, res) => {
    res.json({ message: 'hello world with Typescript' });
});
app.listen(3333, () => 'server running on port 3333');
