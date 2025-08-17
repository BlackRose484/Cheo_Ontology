export type PlayTitles = string[];

export type PlayTitlesByCharacter = string[];

export type SceneNames = string[];

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
