// Generic API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
}

export type Infor = string[];

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
