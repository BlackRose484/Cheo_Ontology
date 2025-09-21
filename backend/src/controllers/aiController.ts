import { Request, Response } from "express";
import { AIModelFactory, AIModel } from "../services/ai/aiModelFactory";

export class AIController {
  static async handleChat(req: Request, res: Response) {
    try {
      const {
        message,
        context = [],
        model = "gemini-2.5-flash",
        conversationId,
      } = req.body;

      if (!message) {
        return res.status(400).json({
          error: "Message is required",
          response: "Vui lòng nhập câu hỏi của bạn về nghệ thuật Chèo! 🎭",
        });
      }

      const response = await AIModelFactory.processQuery(
        message,
        AIModel.GEMINI,
        context,
        model
      );

      // Add metadata
      const result = {
        ...response,
        timestamp: new Date().toISOString(),
        conversationId: conversationId || Date.now().toString(),
      };

      res.json(result);
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({
        error: "Internal server error",
        response: "Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau! 🎭",
        suggestions: [
          "Tìm nhân vật trong Chèo",
          "Các vở Chèo nổi tiếng",
          "Diễn viên Chèo",
        ],
        intent: "error",
        confidence: 0,
        model: "error",
        timestamp: new Date().toISOString(),
      });
    }
  }

  static async getAvailableModels(req: Request, res: Response) {
    try {
      const allModels = AIModelFactory.getAllSupportedModels();
      const modelInfo = allModels.map((modelName) => ({
        id: modelName,
        name: modelName,
        service: AIController.getServiceForModel(modelName),
        available: true,
      }));

      res.json({
        models: modelInfo,
        default: "gemini-2.5-flash",
        count: modelInfo.length,
      });
    } catch (error) {
      res.status(500).json({
        error: "Failed to get available models",
      });
    }
  }

  static async getSuggestions(req: Request, res: Response) {
    try {
      const suggestions = [
        "Tìm nhân vật nữ trong Chèo",
        "Vở Chèo nào nổi tiếng nhất?",
        "Diễn viên nào đóng vai Thị Mầu?",
        "Cảm xúc buồn xuất hiện trong trích đoạn nào?",
        "Giới thiệu về lịch sử nghệ thuật Chèo",
        "Tìm các vở Chèo có chủ đề tình yêu",
        "Nhân vật nào có nhiều cảm xúc nhất?",
        "So sánh nhân vật nam và nữ trong Chèo",
        "Các loại cảm xúc trong Chèo",
        "Diễn viên Chèo nổi tiếng",
      ];

      // Shuffle suggestions for variety
      const shuffled = suggestions.sort(() => 0.5 - Math.random());

      res.json({
        suggestions: shuffled.slice(0, 6), // Return 6 random suggestions
        total: suggestions.length,
      });
    } catch (error) {
      console.error("Error getting suggestions:", error);
      res.status(500).json({
        error: "Failed to get suggestions",
        suggestions: [
          "Tìm nhân vật trong Chèo",
          "Các vở Chèo nổi tiếng",
          "Diễn viên Chèo",
        ],
      });
    }
  }

  private static getServiceForModel(modelName: string): string {
    if (modelName.includes("gemini")) {
      return "Google Gemini";
    }
    // Add more services as they become available
    return "Unknown Service";
  }

  private static getModelDisplayName(model: AIModel): string {
    const names: { [key: string]: string } = {
      [AIModel.GEMINI]: "Google Gemini",
      [AIModel.OPENAI]: "OpenAI GPT",
      [AIModel.CLAUDE]: "Anthropic Claude",
      [AIModel.CUSTOM]: "Custom Model",
    };
    return names[model] || model;
  }
}
