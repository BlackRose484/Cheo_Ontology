import { ChatRequest, ChatResponse, AIModelInfo } from "@/types";
import http from "@/utils/http";

const AI_API_BASE = "/ai";

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await http.post<ChatResponse>(
        `${AI_API_BASE}/chat`,
        request
      );
      return response.data;
    } catch (error) {
      console.error("Error sending chat message:", error);
      throw new Error("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  },

  getModels: async (): Promise<AIModelInfo[]> => {
    try {
      const response = await http.get<AIModelInfo[]>(`${AI_API_BASE}/models`);
      return response.data;
    } catch (error) {
      console.error("Error fetching AI models:", error);
      throw new Error("Không thể tải danh sách model AI.");
    }
  },

  getSuggestions: async (): Promise<string[]> => {
    try {
      const response = await http.get<string[]>(`${AI_API_BASE}/suggestions`);
      return response.data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  },
};

export default chatApi;
