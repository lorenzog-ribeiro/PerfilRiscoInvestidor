import { Router } from "express";
import { getWinScenario, winScenario, getLossScenario, lossSCenario, onlyLossScenario } from "./controller";

const routerScenario = Router();

routerScenario.post("/win", winScenario);
routerScenario.get("/getwin", getWinScenario);
routerScenario.post("/loss", lossSCenario);
routerScenario.get("/getloss", getLossScenario);

routerScenario.post("/lossAggregate", onlyLossScenario);

export default routerScenario;