import { Router } from "express";
import { getWinScenario,winScenario, lossSCenario, onlyLossScenario } from "./controller";

const routerScenario = Router();

routerScenario.post("/win", winScenario);
routerScenario.get("/win", getWinScenario);
routerScenario.post("/loss", lossSCenario);
routerScenario.post("/lossAggregate", onlyLossScenario);

export default routerScenario;