import express from "express";
import inforController from "../controllers/inforController";

const router = express.Router();

router.get("/characters", inforController.getCharacterNames);
router.get("/plays", inforController.getPlayTitles);
router.get("/full-infor", inforController.getFullInfor);

export default router;
