import http from "../utils/http";

export interface ContributionScene {
  name: string;
  summary: string;
  videoCount: number;
  videoLinks: string[];
}

export interface ContributionPlay {
  playName: string;
  sceneCount: number;
  author: string;
  summary: string;
  scenes: ContributionScene[];
}

export interface ContributionCharacter {
  name: string;
  type: string;
  gender: string;
  description: string;
}

export interface ContributionActor {
  name: string;
  character: string;
  description: string;
}

export interface ContributionData {
  playData: ContributionPlay;
  characterData: {
    characters: ContributionCharacter[];
  };
  actorData: {
    actors: ContributionActor[];
  };
  contributorInfo?: {
    name?: string;
    email?: string;
    note?: string;
  };
}

export interface ContributionResponse {
  success: boolean;
  message: string;
  submissionId?: string;
}

export const submitContribution = (data: ContributionData) => {
  return http.post("/contribution/submit", data);
};

export const testEmailConnection = () => {
  return http.get("/contribution/test-email");
};
