import http from "@/utils/http";

export const getCharacters = () => {
  return http.get(`/infor/characters`);
};

export const getCharacterById = (id: string) => {
  return http.get(`/infor/characters/${id}`);
};

export const getPlays = () => {
  return http.get(`/infor/plays`);
};

export const getFullInformation = () => {
  return http.get(`/infor/full-infor`);
};

export const getActorNames = () => {
  return http.get(`/infor/actors`);
};
