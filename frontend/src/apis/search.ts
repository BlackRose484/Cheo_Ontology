import http from "../utils/http";

export const getAllCharacters = async () => http.get("/search/all-characters");

export const getCharacterByName = async (name: string) =>
  http.post("/search/character", { name });
