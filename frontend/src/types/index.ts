export interface Character {
  id: string;
  name: string;
  gender: "nam" | "nữ"; // Lowercase theo API
  description?: string;
  role?: "chính" | "phụ" | "quần chúng"; // Vai trò trong vở diễn
  quotes?: Quote[];
  performances?: string[];
}

export interface Quote {
  id: string;
  content: string;
  character: string;
  performance?: string;
  context?: string;
}

export interface Performance {
  id: string;
  title: string;
  description?: string;
  characters: Character[];
  quotes: Quote[];
}

export interface SearchFilters {
  characterName?: string;
  gender?: "nam" | "nữ"; // Lowercase theo API
  role?: "chính" | "phụ" | "quần chúng";
  actorName?: string;
  quoteContent?: string;
  performance?: string;
}

export interface SearchResults {
  characters: Character[];
  quotes: Quote[];
  performances: Performance[];
}

export type SearchType = "characters" | "quotes" | "performances" | "all";

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  message: string;
}

export type CharacterSearchResponse = ApiResponse<Character>;
export type QuoteSearchResponse = ApiResponse<Quote>;
export type PerformanceSearchResponse = ApiResponse<Performance>;

// Error response interface
export interface ApiErrorResponse {
  success: false;
  error: string;
  message: string;
}

// Helper functions for API handling
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
