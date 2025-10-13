import { Router } from "express";
import { contributionController } from "../controllers/contributionController";

const router = Router();
router.post("/submit", async (req, res) => {
  await contributionController.submitContribution(req, res);
});
router.get("/test-email", async (req, res) => {
  await contributionController.testEmailConnection(req, res);
});

export default router;
