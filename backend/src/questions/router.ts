import { Router } from "express";
import { getQuestionsCount,getUnique } from "./controller";

const router = Router();

router.get('/questions/count', getQuestionsCount);
router.get('/questions', getUnique);

export default router;