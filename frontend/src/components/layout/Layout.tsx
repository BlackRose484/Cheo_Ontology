"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navigator from "./Navigator";
import ChatBot from "../ai/ChatBot";
import ChatBotToggle from "../ai/ChatBotToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const pathname = usePathname();
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  const getPageBackground = () => {
    switch (pathname) {
      case "/":
        return "bg-gradient-to-br from-green-50 via-white to-green-100";
      case "/search":
        return "bg-gradient-to-br from-emerald-50 via-white to-emerald-100";
      case "/characters":
        return "bg-gradient-to-br from-lime-50 via-white to-lime-100";
      case "/quotes":
        return "bg-gradient-to-br from-teal-50 via-white to-teal-100";
      case "/about":
        return "bg-gradient-to-br from-green-50 via-white to-emerald-100";
      default:
        return "bg-gradient-to-br from-green-50 via-white to-green-100";
    }
  };

  const getPagePattern = () => {
    switch (pathname) {
      case "/":
        return "bg-pattern-home";
      case "/search":
        return "bg-pattern-search";
      case "/characters":
        return "bg-pattern-characters";
      case "/quotes":
        return "bg-pattern-quotes";
      case "/about":
        return "bg-pattern-about";
      default:
        return "bg-pattern-home";
    }
  };

  return (
    <div
      className={`min-h-screen ${getPageBackground()} relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${getPagePattern()}`} />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-green-200/20 to-transparent rounded-full transform translate-x-32 translate-y-32" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-radial from-emerald-200/20 to-transparent rounded-full transform -translate-x-32" />

      {/* Content */}
      <div className="relative z-10">
        <Navigator />
        <main className="relative">{children}</main>
      </div>

      {/* AI Chatbot */}
      <ChatBotToggle isOpen={isChatBotOpen} onToggle={setIsChatBotOpen} />
      <ChatBot isOpen={isChatBotOpen} onClose={() => setIsChatBotOpen(false)} />
    </div>
  );
};

export default Layout;
