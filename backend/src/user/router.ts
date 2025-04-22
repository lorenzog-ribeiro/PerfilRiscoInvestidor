import { Router } from "express";
import { create } from "./controller";

const router = Router();

router.post("/create-user", create);


export default router;