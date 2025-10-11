"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { chatApi } from "@/apis/ai";
import { markdownToHtml } from "@/utils/markdownToHtml";
import {
  Send,
  X,
  Settings,
  Loader2,
  Bot,
  User,
  Trash2,
  ChevronDown,
} from "lucide-react";

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

// Available Gemini models
const geminiModels = [
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash-Lite" },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash" },
  { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro" },
  { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash" },
];

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.5-flash");
  const [showSettings, setShowSettings] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await chatApi.getModels(); // Just for health check
      } catch (error) {
        console.error("Failed to load initial data:", error);
      }
    };

    if (isOpen && messages.length === 0) {
      loadInitialData();
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        role: "assistant",
        content:
          "Chào bạn! Tôi là trợ lý AI của Chèo Google. Tôi có thể giúp bạn tìm hiểu về nghệ thuật Chèo. Cần hỗ trợ gì không?",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, selectedModel]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await chatApi.sendMessage({
        message: userMessage.content,
        model: selectedModel,
      });

      if (response.response) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.response,
          timestamp: new Date(response.timestamp),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      const isConnectionError =
        error instanceof Error &&
        (error.message.includes("Network Error") ||
          error.message.includes("ECONNREFUSED") ||
          error.message.includes("Failed to fetch"));

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isConnectionError
          ? "Xin lỗi, server hiện không khả dụng. Vui lòng thử lại sau."
          : `Đã có lỗi xảy ra: ${
              error instanceof Error ? error.message : "Lỗi không xác định"
            }`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content:
        "Chào bạn! Tôi là trợ lý AI của Chèo Google. Tôi có thể giúp bạn tìm hiểu về nghệ thuật Chèo. Cần hỗ trợ gì không?",
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-4 z-50">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .chat-content .markdown-h1 {
            font-size: 1.1rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0.5rem 0 0.25rem 0;
            line-height: 1.3;
          }
          .chat-content .markdown-h2 {
            font-size: 1rem;
            font-weight: 600;
            color: #374151;
            margin: 0.4rem 0 0.2rem 0;
            line-height: 1.3;
          }
          .chat-content .markdown-h3 {
            font-size: 0.9rem;
            font-weight: 600;
            color: #4b5563;
            margin: 0.3rem 0 0.15rem 0;
            line-height: 1.3;
          }
          .chat-content .markdown-code {
            background-color: #f3f4f6;
            color: #dc2626;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            font-weight: 500;
          }
          .chat-content .markdown-link {
            color: #dc2626;
            text-decoration: underline;
            font-weight: 500;
          }
          .chat-content .markdown-link:hover {
            color: #991b1b;
          }
          .chat-content .list-item {
            margin-bottom: 0.25rem;
            line-height: 1.4;
            display: flex;
            align-items: flex-start;
          }
          .chat-content .list-item.bullet {
            margin-left: 0.5rem;
          }
          .chat-content .list-item.numbered {
            font-weight: 400;
          }
          .chat-content .list-number {
            color: #dc2626;
            font-weight: 600;
            margin-right: 0.5rem;
            flex-shrink: 0;
          }
          .chat-content strong {
            font-weight: 600;
            color: #1f2937;
          }
          .chat-content em {
            font-style: italic;
            color: #374151;
          }
        `,
        }}
      />
      <div className="bg-white rounded-lg shadow-2xl w-96 h-[32rem] flex flex-col border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5" />
            <div className="text-sm font-medium text-center">
              Hỗ trợ trực tuyến
            </div>
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Cài đặt"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearChat}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Xóa cuộc trò chuyện"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
              title="Đóng"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-3 rounded-lg shadow-sm ${
                  message.role === "user"
                    ? "bg-red-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                }`}
              >
                {message.role === "assistant" ? (
                  <div
                    className="text-sm prose prose-sm max-w-none chat-content"
                    dangerouslySetInnerHTML={{
                      __html: markdownToHtml(message.content),
                    }}
                    style={{
                      lineHeight: "1.4",
                    }}
                  />
                ) : (
                  <div className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </div>
                )}
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {message.role === "user" && (
                <div className="w-6 h-6 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white text-gray-800 p-3 rounded-lg rounded-bl-sm border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-red-600" />
                  <span className="text-sm">Đang suy nghĩ...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-gray-50/50 backdrop-blur-sm">
          {/* Message Input */}
          <div className="flex gap-3 items-end">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="relative w-fit">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="!text-xs bg-white text-gray-800 focus:outline-none appearance-none cursor-pointer font-medium"
                  disabled={isLoading}
                >
                  {geminiModels.map((model) => (
                    <option
                      key={model.id}
                      value={model.id}
                      className="bg-white text-gray-800"
                    >
                      {model.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 text-gray-300 pointer-events-none" />
              </div>

              {/* Text Input */}
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                className="border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm transition-all duration-200 placeholder-gray-500"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-xl transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg disabled:shadow-none min-w-[48px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
