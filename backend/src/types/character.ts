export type CharacterNames = string[];

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
  description?: string;
  gender?: string;
  role?: string;
  charGender?: string;
  charName?: string;
  mainType?: string;
  subType?: string;
}

export interface CharacterGeneral extends Character {
  // Additional fields for general character information
}

export type CharacterGenerals = CharacterGeneral[];
