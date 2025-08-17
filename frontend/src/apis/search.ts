import http from "../utils/http";

export const getAllCharacters = async () => http.get("/search/all-characters");

export const getCharacterByName = async (name: string) =>
  http.post("/search/character", { name });

export const getPlaysByCharacter = async (character: string) =>
  http.post("/search/play-by-character", { character });

export const getEmotionsByCharacterAndPlay = async (
  character: string,
  play: string
) => http.post("/search/emotion-by-character-and-play", { character, play });

export const getCharacterStates = async (
  character: string,
  play: string,
  emotion: string
) => http.post("/search/by-char-play-emotion", { character, play, emotion });

export const searchActorGeneral = async (actor: string) =>
  http.post("/search/actor-general", { actor });

export const searchPlayGeneral = async (play: string) =>
  http.post("/search/play-general", { play });

export const searchCharacterGeneral = async (character: string) =>
  http.post("/search/character-general", { character });

export const searchAppearance = async (
  character: string,
  play: string,
  emotion: string
) => http.post("/search/appearances", { character, play, emotion });

export const searchSceneGeneral = async (scene: string) =>
  http.post("/search/scene-general", { scene });
