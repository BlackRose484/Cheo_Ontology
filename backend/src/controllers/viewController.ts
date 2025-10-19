import { ActorInformation } from "../types/actor";
import { CharacterInformation } from "../types/character";
import { PlayInformation, SceneInformation } from "../types/play";
import {
  createErrorResponse,
  formatForScenes,
  formatStringtoArray,
} from "../utils/formatters";
import { DirectQueryService } from "../services/cache/directQueryService";
import { RedisCachedQueryService } from "../services/cache/redisCachedQueryService";
import { Request, Response } from "express";

const CACHE_ENABLED = process.env.CACHE_ENABLED === "true";

const ViewController = {
  getCharacterInformation: async (req: Request, res: Response) => {
    const { character } = req.body;

    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getCharacterInformation(
          character
        );
      } else {
        results = await DirectQueryService.getCharacterInformation(character);
      }

      if (!results || results.length === 0) {
        return res.status(404).json(createErrorResponse("Character not found"));
      }

      const result = results[0];

      const characterInfo: CharacterInformation = {
        charName: result.name?.value || "",
        gender: result.gender?.value || "",
        mainType: result.mainType?.value || "",
        subType: result.subType?.value || "",
        description: result.description?.value || "",
        plays: formatStringtoArray(result.plays?.value) || [],
        actors: formatStringtoArray(result.actors?.value) || [],
        scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
      };

      res.json(characterInfo);
    } catch (error) {
      console.error("Error running SPARQL query:", error);
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  getPlayInformation: async (req: Request, res: Response) => {
    const { play } = req.body;

    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getPlayInformation(play);
      } else {
        results = await DirectQueryService.getPlayInformation(play);
      }

      if (!results || results.length === 0) {
        return res.status(404).json(createErrorResponse("Play not found"));
      }

      const result = results[0];

      const playInfo: PlayInformation = {
        title: result.title?.value || "",
        author: result.author?.value || "",
        summary: result.summary?.value || "",
        sceneNumber: result.sceneNumber?.value || "",
        scenes: formatForScenes(result.scenes?.value, ",", "|xx|") || [],
        characters: formatStringtoArray(result.characters?.value) || [],
        actors: formatStringtoArray(result.actors?.value) || [],
      };

      res.json(playInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },
  getActorInformation: async (req: Request, res: Response) => {
    const { actor } = req.body;

    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getActorInformation(actor);
      } else {
        results = await DirectQueryService.getActorInformation(actor);
      }

      if (!results || results.length === 0) {
        return res.status(404).json(createErrorResponse("Actor not found"));
      }

      const result = results[0];
      const actorInfo: ActorInformation = {
        name: result.name?.value || "",
        gender: result.gender?.value || "",
        plays: formatStringtoArray(result.plays?.value) || [],
        characters: formatStringtoArray(result.characters?.value) || [],
      };

      res.json(actorInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },

  getSceneInformation: async (req: Request, res: Response) => {
    const { scene } = req.body;

    try {
      let results;

      if (CACHE_ENABLED) {
        results = await RedisCachedQueryService.getSceneInformation(scene);
      } else {
        results = await DirectQueryService.getSceneInformation(scene);
      }

      if (!results || results.length === 0) {
        return res.status(404).json(createErrorResponse("Scene not found"));
      }

      const result = results[0];
      const sceneInfo: SceneInformation = {
        name: result.name?.value || "",
        summary: result.summary?.value || "",
        allCharacters: formatStringtoArray(result?.allCharacters?.value) || [],
        inPlay: result.inPlay?.value || "",
        allVideos: formatStringtoArray(result?.allVideos?.value) || [],
        allActors: formatStringtoArray(result?.allActors?.value) || [],
      };

      res.json(sceneInfo);
    } catch (error) {
      const errorResponse = createErrorResponse(
        "Error running SPARQL query",
        error
      );
      res.status(500).json(errorResponse);
    }
  },
};

export default ViewController;
