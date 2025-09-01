import express from "express";
import ViewController from "../controllers/viewController";

const router = express.Router();

router.post("/character-information", ViewController.getCharacterInformation);
router.post("/play-information", ViewController.getPlayInformation);
router.post("/actor-information", ViewController.getActorInformation);
router.post("/scene-information", ViewController.getSceneInformation);

export default router;
