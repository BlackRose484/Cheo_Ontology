export interface CharacterState {
  charName: string;
  charGender: string;
  playTitle: string;
  sceneName: string;
  actor: string;
  emotion: string;
  appearance: string;
}

export type CharacterStates = CharacterState[];

export interface Character {
  char?: string;
  description?: string;
  gender?: string;
  charName?: string;
  mainType?: string;
  subType?: string;
}

export interface CharacterGeneral extends Character {
  inPlay?: string;
}

export type CharacterGenerals = CharacterGeneral[];

export interface CharacterInformation extends Character {
  plays?: string[];
  scenes?: object[];
  actors?: string[];
}

export interface CharacterName {
  char: string;
  charName: string;
}

export type CharacterNames = CharacterName[];
