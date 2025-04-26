import { Router } from "express";
import { winScenario, lossSCenario, onlyLossScenario } from "./controller";

const routerGanho = Router();

routerGanho.post("/win", winScenario);
routerGanho.post("/loss", lossSCenario);
routerGanho.post("/lossAggregate", onlyLossScenario);

export default routerGanho;