import http from "@/utils/http";

export const getCharacters = () => {
  return http.get(`/infor/characters`);
};

export const getPlays = () => {
  return http.get(`/infor/plays`);
}