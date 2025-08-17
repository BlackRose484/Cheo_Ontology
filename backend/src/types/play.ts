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
