import { Router } from "express";
import { ganho,perda } from "./controller";

const routerGanho = Router();

routerGanho.post("/ganho", ganho);
routerGanho.post("/perda", perda);

export default routerGanho;