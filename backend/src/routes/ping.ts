import { Router } from "express";
import { PingController } from "../controllers/pingController";

const router = Router();

// Simple ping endpoint - GET /ping
router.get("/", PingController.ping);

export default router;
