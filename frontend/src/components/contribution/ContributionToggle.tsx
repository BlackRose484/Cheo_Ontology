"use client";

import React from "react";
import { Heart, X } from "lucide-react";

interface ContributionToggleProps {
  onToggle: (isOpen: boolean) => void;
  isOpen: boolean;
}

const ContributionToggle: React.FC<ContributionToggleProps> = ({
  onToggle,
  isOpen,
}) => {
  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ${
        isOpen
          ? "opacity-0 pointer-events-none scale-90"
          : "opacity-100 scale-100"
      }`}
    >
      <div className="group relative">
        <button
          onClick={() => onToggle(!isOpen)}
          className={`flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 ${
            isOpen
              ? "bg-gray-600 hover:bg-gray-700 text-white"
              : "bg-gradient-to-br from-red-700 via-red-800 to-red-900 hover:from-red-600 hover:via-red-700 hover:to-red-800 text-white shadow-red-800/30"
          } border-2 border-red-600/20 backdrop-blur-sm`}
          title={isOpen ? "Đóng đóng góp" : "Đóng góp cho Chèo"}
        >
          <div className="flex items-center justify-center relative">
            {isOpen ? (
              <X className="w-7 h-7" />
            ) : (
              <>
                <Heart className="w-7 h-7 animate-pulse " />
                <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping" />
              </>
            )}
          </div>
        </button>

        <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 px-4 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-2xl border border-red-600/30">
          <div className="font-medium">
            {isOpen ? "Đóng đóng góp" : "Đóng góp cho Chèo"}
          </div>
          <div className="text-xs text-red-200 mt-1">
            {isOpen ? "Ẩn form đóng góp" : "Chia sẻ kiến thức về Chèo"}
          </div>
          <div className="absolute top-1/2 right-full w-0 h-0 border-8 border-transparent border-r-red-800 transform -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default ContributionToggle;
