"use client";

import { useState } from "react";
import { SearchFilters } from "@/types";
import useSearchData from "@/hooks/useSearchData";

const CATEGORIES = ["Character", "Play", "Scene", "Actor"];

const DISPLAY_CATEGORIES = {
  Character: "Nhân vật",
  Play: "Vở chèo",
  Scene: "Cảnh",
  Actor: "Diễn viên",
};

interface GeneralDescriptionSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

const GeneralDescriptionSearch = ({
  onSearch,
  initialFilters = {},
}: GeneralDescriptionSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    characterName: "",
    performance: "",
    ...initialFilters,
  });

  const { characters, categories } = useSearchData();

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const resetFilters = () => {
    setFilters({
      category: "",
      characterName: "",
      performance: "",
    });
  };

  const categoryOptions: { value: string; label: string }[] = CATEGORIES.filter(
    (category) => categories.includes(category)
  ).map((category) => ({
    value: category,
    label:
      DISPLAY_CATEGORIES[category as keyof typeof DISPLAY_CATEGORIES] ||
      category,
  }));

  return (
    <div className="bg-white p-8 rounded-lg border-2 border-primary-200">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-primary-600 mb-2 flex items-center gap-2">
          <span>📖</span>
          <span>Xem mô tả chi tiết</span>
        </h3>
        <p className="text-gray-600">
          Xem mô tả chi tiết về các danh mục trong nghệ thuật Chèo
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-lg">
          <span className="text-gray-700">Xem mô tả về</span>
          <select
            className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[180px] text-base"
            value={filters.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
          >
            <option value="">Chọn danh mục</option>
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown động theo category */}
          {filters.category === "Character" && (
            <select
              className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[180px] text-base"
              value={filters.characterName || ""}
              onChange={(e) =>
                handleFilterChange("characterName", e.target.value)
              }
            >
              <option value="">Chọn nhân vật</option>
              {characters.map((char) => (
                <option key={char} value={char}>
                  {char}
                </option>
              ))}
            </select>
          )}

          {filters.category === "Play" && (
            <select
              className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[180px] text-base"
              value={filters.performance || ""}
              onChange={(e) =>
                handleFilterChange("performance", e.target.value)
              }
            >
              <option value="">Chọn vở diễn</option>
              {/* Sử dụng API riêng để lấy danh sách tất cả vở diễn nếu cần */}
              <option value="temp">Chưa có dữ liệu</option>
            </select>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleSearch}
          className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          <span>📖</span>
          <span>Xem mô tả</span>
        </button>

        <button
          onClick={resetFilters}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 font-medium text-lg flex items-center gap-2"
        >
          <span>🔄</span>
          <span>Đặt lại</span>
        </button>
      </div>
    </div>
  );
};

export default GeneralDescriptionSearch;
