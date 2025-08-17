export interface GeneralDescriptionFilters {
  category: string;
  selectedItem?: string;
}

export interface SearchFilters {
  characterName?: string;
  gender?: "nam" | "nữ";
  role?: "chính" | "phụ" | "quần chúng";
  actorName?: string;
  performance?: string;
  expression?: string;
  category?: string;
  scene?: string;
}

export type SearchType = "characters" | "performances" | "all";

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

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

export interface SearchStatesFilters {
  character?: string;
  play?: string;
  emotion?: string;
}

export interface GeneralDescriptionResults {
  category: string;
  items: string[];
  totalCount: number;
  searchCriteria: GeneralDescriptionFilters;
}

export interface Character {
  description: string;
  gender: string;
  name: string;
  role: string;
  charGender: string;
  charName: string;
  mainType: string;
  subType: string;
}

export interface Play {
  author: string;
  summary: string;
  title: string;
  sceneNumber: number;
}

export interface Actor {
  name: string;
  gender: "nam" | "nữ" | "khác";
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PlayGeneral extends Play {
  // additional information
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CharacterGeneral extends Character {
  // Additional fields for general character information
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ActorGeneral extends Actor {}

export type ActorGenerals = ActorGeneral[];

export type CharacterGenerals = CharacterGeneral[];

export type PlayGenerals = PlayGeneral[];
