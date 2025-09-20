import express from "express";
import searchController from "../controllers/searchController";

const router = express.Router();

// Define the search route
router.post("/play-by-character", searchController.searchPlayByCharacter);
router.post(
  "/scenes-play-by-character",
  searchController.searchSceneAndPlayByCharacter
);
router.post(
  "/emotion-by-character-and-scene",
  searchController.searchEmotionByCharacterAndScene
);
router.post("/by-char-scene-emotion", searchController.searchByCharSceneEMo);
router.post("/character-general", searchController.searchCharacterGeneral);
router.post("/play-general", searchController.searchPlayGeneral);
router.post("/actor-general", searchController.searchActorGeneral);
router.post("/appearances", searchController.searchAppearance);
router.post("/scene-general", searchController.searchSceneGeneral);

export default router;
