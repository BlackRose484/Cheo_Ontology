import http from "@/utils/http";

export const getActorInformation = (actor: string) => {
  return http.post(`/view/actor-information`, { actor });
};

export const getCharacterInformation = (character: string) => {
  return http.post(`/view/character-information`, { character });
};

export const getPlayInformation = (play: string) => {
  return http.post(`/view/play-information`, { play });
};

export const getSceneInformation = (scene: string) => {
  return http.post(`/view/scene-information`, { scene });
};
