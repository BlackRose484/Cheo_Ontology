import express from "express";
import inforController from "../controllers/inforController";

const router = express.Router();

router.get("/characters", inforController.getCharacterNames);
router.get("/plays", inforController.getPlayTitles);
router.get("/full-infor", inforController.getFullInfor);
router.get("/actors", inforController.getActorNames);
router.get("/scenes", inforController.getSceneNames);
router.get("/library", inforController.getLibrary);
router.post("/scenes-by-play", inforController.getSceneNamesByPlay);
router.get("/maintype", inforController.getMainTypeCategories);
router.get("/subtype", inforController.getSubTypeCategories);
router.post("/filtered-characters", inforController.filterCharactersByCategory);

export default router;
