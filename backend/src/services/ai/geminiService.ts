import { GoogleGenerativeAI } from "@google/generative-ai";
import { OntologyQueryService } from "./ontologyQueryService";

export interface AIResponse {
  response: string;
  suggestions: string[];
  intent: string;
  confidence: number;
  model?: string;
}

export interface IntentAnalysis {
  intent: string;
  entities: string[];
  needsOntologyQuery: boolean;
  queryType?: string;
  filters?: {
    gender?: string;
    emotion?: string;
    play?: string;
    character?: string;
  };
  confidence: number;
}

export class GeminiService {
  private static genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  // Available Gemini models
  private static readonly AVAILABLE_MODELS = [
    "gemini-2.5-pro",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash",
  ];

  static async processCheoQuery(
    message: string,
    context: any[] = [],
    modelName = "gemini-2.5-flash"
  ): Promise<AIResponse> {
    try {
      // Validate model name
      const validModel = this.validateAndGetModel(modelName);

      // 1. Analyze intent and extract entities
      const analysis = await this.analyzeIntent(message, validModel);

      // 2. Query ontology based on intent
      let ontologyData = null;
      if (analysis.needsOntologyQuery) {
        ontologyData = await OntologyQueryService.queryByIntent(analysis);
      }

      // 3. Generate contextualized response
      const response = await this.generateResponse(
        message,
        analysis,
        ontologyData,
        context,
        validModel
      );

      return {
        response: response.text,
        suggestions: response.suggestions,
        intent: analysis.intent,
        confidence: analysis.confidence,
        model: validModel,
      };
    } catch (error) {
      console.error("Gemini processing error:", error);
      return this.getFallbackResponse(modelName);
    }
  }

  private static validateAndGetModel(modelName: string): string {
    if (this.AVAILABLE_MODELS.includes(modelName)) {
      return modelName;
    }

    console.warn(
      `Model ${modelName} not available, falling back to gemini-2.5-flash`
    );
    return "gemini-2.5-flash";
  }

  private static async analyzeIntent(
    message: string,
    modelName: string
  ): Promise<IntentAnalysis> {
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const intentPrompt = `
    Phân tích ý định trong câu hỏi về nghệ thuật Chèo Việt Nam sau:
    "${message}"
    
    Trả về JSON format chính xác (không thêm markdown):
    {
      "intent": "find_character|find_play|find_scene|find_actor|find_emotion|general_info|greeting|help",
      "entities": ["entity1", "entity2"],
      "needsOntologyQuery": true|false,
      "queryType": "characters|plays|scenes|actors|emotions|general",
      "filters": {
        "gender": "nam|nữ",
        "emotion": "vui|buồn|giận|sợ",
        "play": "tên vở",
        "character": "tên nhân vật"
      },
      "confidence": 0.9
    }
    
    Ví dụ:
    - "Tìm nhân vật nữ" → intent: "find_character", entities: ["nữ"], needsOntologyQuery: true
    - "Xin chào" → intent: "greeting", needsOntologyQuery: false
    - "Thị Mầu là ai" → intent: "find_character", entities: ["Thị Mầu"], needsOntologyQuery: true
    `;

    try {
      const result = await model.generateContent(intentPrompt);
      const response = await result.response;
      const text = response
        .text()
        .replace(/```json\n?|\n?```/g, "")
        .trim();

      const parsed = JSON.parse(text);
      return {
        intent: parsed.intent || "general_info",
        entities: parsed.entities || [],
        needsOntologyQuery: parsed.needsOntologyQuery || false,
        queryType: parsed.queryType,
        filters: parsed.filters || {},
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      console.error("Intent analysis error:", error);
      return {
        intent: "general_info",
        entities: [],
        needsOntologyQuery: false,
        confidence: 0.3,
      };
    }
  }

  private static async generateResponse(
    message: string,
    analysis: IntentAnalysis,
    ontologyData: any,
    context: any[],
    modelName: string
  ) {
    const model = this.genAI.getGenerativeModel({ model: modelName });

    const systemContext = `
    Bạn là "Chèo Bot" - trợ lý AI chuyên về nghệ thuật Chèo truyền thống Việt Nam.
    
    PERSONALITY:
    - Thân thiện, nhiệt tình, am hiểu văn hóa Việt Nam
    - Sử dụng ngôn ngữ trang trọng nhưng gần gũi
    - Thêm emoji phù hợp với văn hóa Việt (🎭, 🏮, 🌸, 🎪)
    - Khuyến khích khám phá thêm về Chèo
    
    DỮ LIỆU TỪ ONTOLOGY:
    ${
      ontologyData
        ? JSON.stringify(ontologyData, null, 2)
        : "Không có dữ liệu cụ thể từ cơ sở dữ liệu."
    }
    
    NGỮ CẢNH CUỘC TRUYỆN:
    ${
      context.length > 0
        ? JSON.stringify(context.slice(-3))
        : "Đây là đầu cuộc trò chuyện"
    }
    
    QUY TẮC:
    - Nếu có dữ liệu từ ontology, ưu tiên sử dụng thông tin này
    - Nếu không có dữ liệu, đưa ra thông tin chung về Chèo và gợi ý tìm kiếm cụ thể
    - Luôn đề xuất 2-3 câu hỏi tiếp theo để người dùng khám phá thêm
    - Nếu không chắc chắn, thành thật thừa nhận và hướng dẫn cách tìm thông tin
    - Trả lời bằng tiếng Việt, ngắn gọn nhưng đầy đủ thông tin
    `;

    const prompt = `
    ${systemContext}
    
    NGƯỜI DÙNG HỎI: "${message}"
    Ý ĐỊNH PHÂN TÍCH: ${analysis.intent}
    
    Hãy trả lời câu hỏi của người dùng một cách hữu ích và thú vị.
    
    Trả về JSON format chính xác (không thêm markdown):
    {
      "text": "Câu trả lời chính",
      "suggestions": ["Gợi ý 1", "Gợi ý 2", "Gợi ý 3"]
    }
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response
        .text()
        .replace(/```json\n?|\n?```/g, "")
        .trim();

      const parsed = JSON.parse(text);
      return {
        text: parsed.text || response.text(),
        suggestions: parsed.suggestions || [
          "Tìm hiểu về nhân vật Chèo",
          "Khám phá các vở Chèo nổi tiếng",
          "Tìm hiểu về diễn viên Chèo",
        ],
      };
    } catch (error) {
      console.error("Response generation error:", error);
      return {
        text: "Tôi hiểu câu hỏi của bạn về nghệ thuật Chèo. Hãy thử hỏi cụ thể hơn về nhân vật, vở chèo, hoặc diễn viên bạn quan tâm! 🎭",
        suggestions: [
          "Tìm nhân vật trong Chèo",
          "Các vở Chèo nổi tiếng",
          "Diễn viên Chèo",
        ],
      };
    }
  }

  private static getFallbackResponse(
    modelName = "gemini-2.5-flash"
  ): AIResponse {
    return {
      response:
        "Xin lỗi, tôi gặp chút khó khăn. Bạn có thể thử hỏi về nhân vật, vở chèo, hoặc diễn viên không? 🎭",
      suggestions: [
        "Tìm nhân vật trong Chèo",
        "Các vở Chèo nổi tiếng",
        "Diễn viên Chèo",
      ],
      intent: "error",
      confidence: 0,
      model: modelName,
    };
  }

  static isAvailable(): boolean {
    return !!process.env.GEMINI_API_KEY;
  }

  static getAvailableModels(): string[] {
    return [...this.AVAILABLE_MODELS];
  }

  static isModelSupported(modelName: string): boolean {
    return this.AVAILABLE_MODELS.includes(modelName);
  }
}
