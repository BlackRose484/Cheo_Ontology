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

// AI Chatbot interfaces
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  context?: string;
  model?: string;
}

export interface ChatResponse {
  response: string;
  model: string;
  timestamp: Date;
  error?: string;
}

export interface AIModelInfo {
  id: string;
  name: string;
  description: string;
  available: boolean;
}

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

export interface CharacterState {
  charName: string;
  charGender: string;
  playTitle: string;
  sceneName: string;
  actor: string;
  emotion: string;
  appearance: string;
  versionID: string;
  showDate: string;
  start: string;
  end: string;
}

export type CharacterStates = CharacterState[];

export interface SearchStatesFilters {
  character?: string;
  scene?: string;
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

export interface PlayGeneral extends Play {
  allScenes?: string[];
  allCharacter?: string[];
}

export interface CharacterGeneral extends Character {
  inPlay?: string;
}

export interface ActorGeneral extends Actor {
  charNames?: string[];
  playTitles?: string[];
}

export type ActorGenerals = ActorGeneral[];

export type CharacterGenerals = CharacterGeneral[];

export type PlayGenerals = PlayGeneral[];

export interface Appearance {
  start: string;
  end: string;
  emotion: string;
  vidVersion: string;
  ED: string;
  subtitle: string;
}

export type Appearances = Appearance[];

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

export interface LibraryItem {
  vidVersion?: string; // Link Drive Video
  sceneName?: string;
  duration?: string;
  sceneSummary?: string;
  playTitle?: string;
  characters?: string[];
  actors?: string[];
}

export type Library = LibraryItem[];

export interface ActorInformation extends Actor {
  plays?: string[];
  characters?: string[];
}

export interface CharacterInformation extends Character {
  plays?: string[];
  scenes?: Scene[];
  actors?: string[];
}

export interface PlayInformation extends Play {
  scenes?: Scene[];
  characters?: string[];
  actors?: string[];
}

export interface SceneInformation extends Scene {
  allCharacters?: string[];
  allVideos?: string[];
  allActors?: string[];
  inPlay?: string;
}

export interface ActorName {
  actor: string;
  name: string;
}

export type ActorNames = ActorName[];

export interface CharacterName {
  char: string;
  charName: string;
}

export type CharacterNames = CharacterName[];

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

export interface SceneAndPlay {
  scene: string;
  sceneName: string;
  playTitle: string;
}

export type SceneAndPlays = SceneAndPlay[];
