// Generic API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export type Infor = string[];

// Export contribution types
export * from "./contribution";

// AI Types
export * from "./ai";

export interface LibraryItem {
  vidVersion?: string;
  sceneName?: string;
  duration?: string;
  sceneSummary?: string;
  playTitle?: string;
  characters?: string[];
  actors?: string[];
}

export type Library = LibraryItem[];
