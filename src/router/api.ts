import { Router } from "express";
import { analyticsRouter } from "./analyticsRouter";
const router = Router();

router.use("/analytics", analyticsRouter);

export { router };
