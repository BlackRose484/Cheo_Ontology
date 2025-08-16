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
