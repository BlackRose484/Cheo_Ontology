export interface Character {
  id: string;
  name: string;
  gender: "nam" | "nữ";
  description?: string;
  role?: "chính" | "phụ" | "quần chúng"; // Vai trò trong vở diễn
  performances?: string[];
  actor?: string; // Diễn viên
  scene?: string; // Phân cảnh
  expression?: string; // Nét biểu cảm
  performance?: string; // Tên vở kịch
}

export interface Performance {
  id: string;
  title: string;
  description?: string;
  characters: Character[];
}

export interface SearchFilters {
  characterName?: string;
  gender?: "nam" | "nữ"; // Lowercase theo API
  role?: "chính" | "phụ" | "quần chúng";
  actorName?: string;
  performance?: string;
  expression?: string; // Biểu cảm (optional)
  category?: string; // Danh mục động cho mô tả
  scene?: string; // Cảnh (nếu có)
}

export interface SearchResults {
  characters: Character[];
  performances: Performance[];
}

export type SearchType = "characters" | "performances" | "all";

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  message: string;
}

export type CharacterSearchResponse = ApiResponse<Character>;
export type PerformanceSearchResponse = ApiResponse<Performance>;

export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

interface UnknownApiResponse {
  success?: boolean;
  error?: string;
  data?: unknown[];
  count?: number;
  message?: string;
}

export const isApiError = (response: unknown): response is ApiErrorResponse => {
  const typed = response as UnknownApiResponse;
  return (
    typeof response === "object" &&
    response !== null &&
    typed.success === false &&
    typeof typed.error === "string"
  );
};

export const validateCharacterResponse = (
  response: unknown
): response is CharacterSearchResponse => {
  const typed = response as UnknownApiResponse;
  return (
    typeof response === "object" &&
    response !== null &&
    typeof typed.success === "boolean" &&
    Array.isArray(typed.data) &&
    typeof typed.count === "number" &&
    typeof typed.message === "string"
  );
};

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
