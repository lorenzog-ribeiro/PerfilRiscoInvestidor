import { Router } from "express";
import { winScenario, lossSCenario, onlyLossScenario } from "./controller";

const routerScenario = Router();

routerScenario.post("/win", winScenario);
routerScenario.post("/loss", lossSCenario);
routerScenario.post("/lossAggregate", onlyLossScenario);

export default routerScenario;