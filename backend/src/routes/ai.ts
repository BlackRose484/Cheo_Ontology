import express from "express";
import { AIController } from "../controllers/aiController";

const router = express.Router();
router.post("/chat", AIController.handleChat);
router.get("/models", AIController.getAvailableModels);
router.get("/suggestions", AIController.getSuggestions);

export default router;
