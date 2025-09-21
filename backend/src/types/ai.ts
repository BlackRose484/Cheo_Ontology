export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  message: string;
  context?: string;
  model?: string;
}

export interface ChatResponse {
  message: string;
  success: boolean;
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

export interface SearchSuggestion {
  query: string;
  category: "character" | "play" | "actor" | "emotion" | "scene";
  description: string;
}

export interface OntologyIntent {
  type: "character" | "play" | "actor" | "emotion" | "scene" | "general";
  entity?: string;
  confidence: number;
  parameters?: Record<string, any>;
}

export interface OntologyResult {
  type: string;
  data: any[];
  query: string;
}
