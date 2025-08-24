"use client";

import { useState } from "react";
import {
  GeneralDescriptionFilters,
  SearchStatesFilters,
  SearchType,
} from "@/types";
import CharacterStateSearch from "./CharacterStateSearch";
import GeneralDescriptionSearch from "./GeneralSearch";

interface SearchFormProps {
  onSearch: (
    filters: SearchStatesFilters | GeneralDescriptionFilters,
    searchType: SearchType
  ) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);

  const tabs = [
    { id: 1, label: "Xem mô tả", icon: "📖" },
    { id: 2, label: "Trạng thái nhân vật", icon: "🎭" },
  ];

  const handleCharacterStateSearch = (filters: SearchStatesFilters) => {
    onSearch(filters, "characters");
  };

  const handleGeneralDescriptionSearch = (
    filters: GeneralDescriptionFilters
  ) => {
    onSearch(filters, "performances");
  };

  const resetActiveTab = () => {
    // Logic to reset current tab if needed
  };

  return (
    <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-yellow-400 max-w-6xl mx-auto backdrop-blur-sm">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-red-800 mb-2 font-traditional">
          Tìm kiếm thông tin Chèo
        </h2>
        <p className="text-red-700">
          Chọn loại tìm kiếm và điền thông tin cần thiết
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b-2 border-yellow-400 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              resetActiveTab();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 shadow-lg transform scale-105 border-2 border-yellow-400"
                : "bg-white text-red-800 border-2 border-red-300 hover:border-red-500 hover:bg-red-50"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 1 && (
          <GeneralDescriptionSearch onSearch={handleGeneralDescriptionSearch} />
        )}

        {activeTab === 2 && (
          <CharacterStateSearch onSearch={handleCharacterStateSearch} />
        )}
      </div>
    </div>
  );
};

export default SearchForm;
