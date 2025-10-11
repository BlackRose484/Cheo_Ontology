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
    
    NGUYÊN TẮC PHÂN TÍCH:
    - Ưu tiên tìm kiếm thông tin chi tiết khi có tên cụ thể
    - Tên nhân vật, vở kịch, diễn viên cụ thể → intent "find_character", "find_play", "find_actor"
    - Các từ khóa chung như "nhân vật nữ", "diễn viên nam" → intent tương ứng với filter
    - Câu hỏi chung về Chèo → "general_info"
    
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
        "character": "tên nhân vật",
        "actor": "tên diễn viên"
      },
      "confidence": 0.9
    }
    
    Ví dụ:
    - "Thị Mầu là ai?" → intent: "find_character", entities: ["Thị Mầu"], needsOntologyQuery: true
    - "Tìm nhân vật nữ" → intent: "find_character", entities: [], filters: {"gender": "nữ"}
    - "Vở Quan Âm Thị Kính" → intent: "find_play", entities: ["Quan Âm Thị Kính"]
    - "Diễn viên Xuân Hinh" → intent: "find_actor", entities: ["Xuân Hinh"]
    - "Nghệ thuật Chèo là gì" → intent: "general_info", entities: ["Chèo"]
    - "Xin chào" → intent: "greeting", needsOntologyQuery: false
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
        needsOntologyQuery: parsed.needsOntologyQuery !== false,
        queryType: parsed.queryType,
        filters: parsed.filters || {},
        confidence: parsed.confidence || 0.5,
      };
    } catch (error) {
      console.error("Intent analysis error:", error);
      return {
        intent: "general_info",
        entities: [],
        needsOntologyQuery: true,
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
        ? `
Loại dữ liệu: ${ontologyData.type}
Số lượng kết quả: ${ontologyData.count}
Dữ liệu chi tiết: ${JSON.stringify(ontologyData.data, null, 2)}
${ontologyData.error ? `Lỗi: ${ontologyData.error}` : ""}
        `
        : "Không có dữ liệu cụ thể từ cơ sở dữ liệu."
    }
    
    NGỮ CẢNH CUỘC TRUYỆN:
    ${
      context.length > 0
        ? JSON.stringify(context.slice(-3))
        : "Đây là đầu cuộc trò chuyện"
    }
    
    QUY TẮC TRẢ LỜI:
    - Nếu có dữ liệu chi tiết (character_details, play_details, actor_details, scene_details), ưu tiên trình bày thông tin đầy đủ
    - Với thông tin nhân vật: tên, giới tính, loại vai, mô tả, các vở kịch, diễn viên đóng, cảnh xuất hiện
    - Với thông tin vở kịch: tên, tác giả, tóm tắt, số cảnh, nhân vật, diễn viên, danh sách cảnh
    - Với thông tin diễn viên: tên, giới tính, các vở đã đóng, nhân vật đã thể hiện
    - Nếu không có dữ liệu hoặc có lỗi, đưa ra thông tin chung và gợi ý tìm kiếm cụ thể
    - Luôn đề xuất 2-3 câu hỏi tiếp theo để người dùng khám phá thêm
    - Trả lời bằng tiếng Việt, rõ ràng và dễ hiểu
    - Với dữ liệu danh sách, hãy trình bày có cấu trúc, dễ đọc
    `;

    const prompt = `
    ${systemContext}
    
    NGƯỜI DÙNG HỎI: "${message}"
    Ý ĐỊNH PHÂN TÍCH: ${analysis.intent}
    
    Hãy trả lời câu hỏi của người dùng một cách hữu ích và thú vị dựa trên dữ liệu có sẵn.
    
    Trả về JSON format chính xác (không thêm markdown):
    {
      "text": "Câu trả lời chính với thông tin chi tiết và có cấu trúc",
      "suggestions": ["Gợi ý cụ thể 1", "Gợi ý cụ thể 2", "Gợi ý cụ thể 3"]
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
