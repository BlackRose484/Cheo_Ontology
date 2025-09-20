export type PlayTitlesByCharacter = string[];

export interface Play {
  play?: string;
  author?: string;
  summary?: string;
  title?: string;
  sceneNumber?: number;
}

export interface Scene {
  scene?: string;
  startTime?: string;
  endTime?: string;
  name?: string;
  version?: string;
  summary?: string;
}

export interface SceneGeneral extends Scene {
  allCharacters?: string[];
  inPlay?: string;
}

export type SceneGenerals = SceneGeneral[];

export interface PlayGeneral extends Play {
  allScenes?: string[];
  allCharacter?: string[];
}

export type PlayGenerals = PlayGeneral[];

export interface Appearance {
  start: string;
  end: string;
  emotion: string;
  vidVersion: string;
}

export type Appearances = Appearance[];

export interface PlayInformation extends Play {
  scenes?: string[];
  characters?: string[];
  actors?: string[];
  sceneNumber?: number;
}

export interface SceneInformation extends Scene {
  allCharacters?: string[];
  allVideos?: string[];
  allActors?: string[];
  inPlay?: string;
}

export interface SceneAndPlay {
  scene: string;
  sceneName: string;
  playTitle: string;
}

export type SceneAndPlays = SceneAndPlay[];

export interface PlayTitle {
  play: string;
  title: string;
}

export type PlayTitles = PlayTitle[];

export interface SceneName {
  scene: string;
  name: string;
}

export type SceneNames = SceneName[];
