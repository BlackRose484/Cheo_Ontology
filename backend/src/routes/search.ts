import express from "express";
import searchController from "../controllers/searchController";

const router = express.Router();

// Define the search route
router.post("/play-by-character", searchController.searchPlayByCharacter);
router.post(
  "/emotion-by-character-and-play",
  searchController.searchEmotionByCharacterAndPlay
);
router.post("/by-char-play-emotion", searchController.searchByCharPlayEMo);

export default router;
