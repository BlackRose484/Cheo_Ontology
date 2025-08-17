export type PlayTitles = string[];

export type PlayTitlesByCharacter = string[];

export interface Play {
  author?: string;
  summary?: string;
  title?: string;
  sceneNumber?: number;
}

export interface PlayGeneral extends Play {
  // additional infor
}

export type PlayGenerals = PlayGeneral[];

export interface Appearance {
  start: string;
  end: string;
  emotion: string;
  vidVersion: string;
}

export type Appearances = Appearance[];
