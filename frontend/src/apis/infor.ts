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

export const getSceneNames = () => {
  return http.get(`/infor/scenes`);
};

export const getSceneNamesByPlay = (play: string) => {
  return http.post(`/infor/scenes-by-play`, { play });
};

export const getLibrary = () => {
  return http.get(`/infor/library`);
};

export const getMainTypeCategories = () => {
  return http.get(`/infor/maintype`);
};

export const getSubTypeCategories = () => {
  return http.get(`/infor/subtype`);
};

export const filterCharactersByCategory = (
  mainType: string,
  subType: string
) => {
  return http.post(`/infor/filtered-characters`, { mainType, subType });
};
