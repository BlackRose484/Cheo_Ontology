"use client";

import React from "react";
import { Bot, X } from "lucide-react";

interface ChatBotToggleProps {
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
}

const ChatBotToggle: React.FC<ChatBotToggleProps> = ({ onToggle, isOpen }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-opacity duration-300 ${
        isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <button
        onClick={() => onToggle(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700 text-white"
            : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
        }`}
        title={isOpen ? "Đóng AI Chatbot" : "Mở AI Chatbot"}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isOpen ? <X className="w-7 h-7" /> : <Bot className="w-7 h-7" />}
        </div>

        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-red-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {isOpen ? "Đóng AI Chatbot" : "AI Trợ lý Chèo"}
          <div className="absolute top-1/2 left-full w-0 h-0 border-4 border-transparent border-l-red-800 transform -translate-y-1/2" />
        </div>
      </button>
    </div>
  );
};

export default ChatBotToggle;
