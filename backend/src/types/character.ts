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
