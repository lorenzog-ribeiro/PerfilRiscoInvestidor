import { Router } from "express";
import { getWinScenario, winScenario, getLossScenario, lossSCenario, onlyLossScenario, getOnlyLossScenario, calcResult } from "./controller";

const routerScenario = Router();

//1
routerScenario.post("/win", winScenario);
routerScenario.get("/getwin", getWinScenario);
//2
routerScenario.post("/loss", lossSCenario);
routerScenario.get("/getloss", getLossScenario);
//3
routerScenario.post("/onlyloss", onlyLossScenario);
routerScenario.get("/getonlyloss", getOnlyLossScenario);

routerScenario.get("/result", calcResult);

export default routerScenario; 