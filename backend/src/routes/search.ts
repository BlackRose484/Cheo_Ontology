import express from "express";
import searchController from "../controllers/searchController";

const router = express.Router();

// Define the search route
router.post("/character", searchController.searchCharacter);
router.get("/all-characters", searchController.searchAllCharacters);

export default router;
