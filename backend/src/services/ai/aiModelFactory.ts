import { GeminiService, AIResponse } from "./geminiService";

export enum AIModel {
  GEMINI = "gemini",
  OPENAI = "openai",
  CLAUDE = "claude",
  CUSTOM = "custom",
}

export interface AIModelService {
  processCheoQuery(
    message: string,
    context: any[],
    modelName?: string
  ): Promise<AIResponse>;
  getName(): string;
  isAvailable(): boolean;
  getAvailableModels?(): string[];
  isModelSupported?(modelName: string): boolean;
}

export class AIModelFactory {
  private static services: Map<AIModel, AIModelService> = new Map();

  static initialize() {
    // Register available models
    this.services.set(AIModel.GEMINI, new GeminiServiceAdapter());
    // Future: Add other models
    // this.services.set(AIModel.OPENAI, new OpenAIServiceAdapter());
    // this.services.set(AIModel.CLAUDE, new ClaudeServiceAdapter());
  }

  static async processQuery(
    message: string,
    model: AIModel | string = AIModel.GEMINI,
    context: any[] = [],
    specificModel?: string
  ): Promise<AIResponse> {
    if (this.services.size === 0) {
      this.initialize();
    }

    const modelEnum =
      typeof model === "string" ? this.mapStringToModel(model) : model;
    const service = this.services.get(modelEnum);

    if (!service || !service.isAvailable()) {
      // Fallback to Gemini
      const fallbackService = this.services.get(AIModel.GEMINI);
      if (fallbackService?.isAvailable()) {
        const response = await fallbackService.processCheoQuery(
          message,
          context,
          specificModel || "gemini-2.5-flash"
        );
        response.model = specificModel || "gemini-2.5-flash";
        return response;
      }
      throw new Error("No AI service available");
    }

    const response = await service.processCheoQuery(
      message,
      context,
      specificModel
    );
    response.model = specificModel || modelEnum;
    return response;
  }

  private static mapStringToModel(modelString: string): AIModel {
    // Check if it's a Gemini model
    if (modelString.includes("gemini")) {
      return AIModel.GEMINI;
    }
    // Add more mappings as needed
    return AIModel.GEMINI; // Default fallback
  }

  static getAvailableModels(): { service: AIModel; models: string[] }[] {
    // Initialize if not done
    if (this.services.size === 0) {
      this.initialize();
    }

    const result: { service: AIModel; models: string[] }[] = [];

    for (const [model, service] of this.services.entries()) {
      if (service.isAvailable()) {
        const availableModels = service.getAvailableModels?.() || [model];
        result.push({
          service: model,
          models: availableModels,
        });
      }
    }

    return result;
  }

  static getAllSupportedModels(): string[] {
    const allModels: string[] = [];
    const services = this.getAvailableModels();

    for (const service of services) {
      allModels.push(...service.models);
    }

    return allModels;
  }
}

class GeminiServiceAdapter implements AIModelService {
  async processCheoQuery(
    message: string,
    context: any[],
    modelName?: string
  ): Promise<AIResponse> {
    return await GeminiService.processCheoQuery(message, context, modelName);
  }

  getName(): string {
    return "Google Gemini";
  }

  isAvailable(): boolean {
    return GeminiService.isAvailable();
  }

  getAvailableModels(): string[] {
    return GeminiService.getAvailableModels();
  }

  isModelSupported(modelName: string): boolean {
    return GeminiService.isModelSupported(modelName);
  }
}

// Future implementations:
/*
class OpenAIServiceAdapter implements AIModelService {
  async processCheoQuery(message: string, context: any[]): Promise<AIResponse> {
    // Implementation for OpenAI
  }
  
  getName(): string { return 'OpenAI GPT'; }
  isAvailable(): boolean { return !!process.env.OPENAI_API_KEY; }
}

class ClaudeServiceAdapter implements AIModelService {
  async processCheoQuery(message: string, context: any[]): Promise<AIResponse> {
    // Implementation for Claude
  }
  
  getName(): string { return 'Anthropic Claude'; }
  isAvailable(): boolean { return !!process.env.ANTHROPIC_API_KEY; }
}
*/
