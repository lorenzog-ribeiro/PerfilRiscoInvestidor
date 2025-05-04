import { Router } from "express";
import { saveAnswers } from "./controller";

const routerAnswers = Router();

routerAnswers.post("/save-answer", saveAnswers);


export default routerAnswers; 