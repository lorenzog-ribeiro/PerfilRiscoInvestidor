import { Router } from "express";
import { create } from "./controller";

const routerUser = Router();

routerUser.post("/create-user", create);


export default routerUser;