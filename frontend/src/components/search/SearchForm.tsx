"use client";

import { useEffect, useState } from "react";
import { SearchFilters, SearchType } from "@/types";
import { getCharacters, getPlays } from "@/apis/infor";

interface SearchFormProps {
  onSearch: (filters: SearchFilters, searchType: SearchType) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [filters, setFilters] = useState<SearchFilters>({
    characterName: "",
    quoteContent: "",
    performance: "",
    gender: undefined,
  });

  // Mock data options - sẽ được thay thế bằng data thật sau

  const [characters, setCharacters] = useState([]);
  const [plays, setPlays] = useState([]);
  const fetchCharacters = async () => {
    try {
      const response = await getCharacters();
      setCharacters(response.data);
    } catch (error) {
      console.error("Failed to fetch characters:", error);
    }
  };

  const fetchPlays = async () => {
    try {
      const response = await getPlays();
      setPlays(response.data);
    } catch (error) {
      console.error("Failed to fetch plays:", error);
    }
  };

  useEffect(() => {
    fetchCharacters();
    fetchPlays();
  }, []);

  const characterOptions = characters.map((character) => ({
    value: character,
    label: character,
  }));

  const playOptions = plays.map((play) => ({
    value: play,
    label: play,
  }));

  const actorOptions = [
    { value: "", label: "Chọn biểu cảm" },
    { value: "vui", label: "vui" },
    { value: "buồn", label: "buồn" },
    { value: "giận", label: "giận" },
    { value: "thương", label: "thương" },
    { value: "lo", label: "lo" },
  ];

  const categoryOptions = [
    { value: "", label: "Chọn danh mục" },
    { value: "nhân vật", label: "nhân vật" },
    { value: "trích dẫn", label: "trích dẫn" },
    { value: "vở diễn", label: "vở diễn" },
    { value: "diễn viên", label: "diễn viên" },
  ];

  const tabs = [
    { id: 3, label: "Xuất hiện nhân vật", icon: "🎭" },
    { id: 4, label: "Nét diễn", icon: "😊" },
    { id: 5, label: "Xem mô tả", icon: "📖" },
  ];

  const handleSearch = (
    tabId: number,
    customFilters?: Partial<SearchFilters>
  ) => {
    const searchFilters = { ...filters, ...customFilters };

    // Xác định loại tìm kiếm dựa trên tab
    let searchType: SearchType = "all";
    switch (tabId) {
      case 1:
      case 3:
      case 4:
        searchType = "characters";
        break;
      case 2:
        searchType = "quotes";
        break;
      case 5:
        searchType = "performances";
        break;
    }

    onSearch(searchFilters, searchType);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "gender" && value === "" ? undefined : value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      characterName: "",
      quoteContent: "",
      performance: "",
      gender: undefined,
    });
  };

  return (
    <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-ancient-ink mb-2 font-traditional">
          Tìm kiếm thông tin Chèo
        </h2>
        <p className="text-gray-600">
          Chọn loại tìm kiếm và điền thông tin cần thiết
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              resetFilters();
            }}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? "bg-primary-500 text-white shadow-lg transform scale-105"
                : "bg-white text-ancient-ink border border-gray-300 hover:border-primary-400 hover:bg-primary-50"
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-sm">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {/* Tab 3: Danh sách những lần có sự xuất hiện của nhân vật */}
        {activeTab === 3 && (
          <div className="bg-white p-8 rounded-lg border-2 border-primary-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#4ade80]-600 mb-2 flex items-center gap-2">
                <span>🎭</span>
                <span>Danh sách xuất hiện của nhân vật</span>
              </h3>
              <p className="text-gray-600">
                Tìm kiếm tất cả các lần xuất hiện của nhân vật trong trích dẫn
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span className="text-gray-700">
                  Xem xuất hiện của nhân vật
                </span>
                <select
                  value={filters.characterName || ""}
                  onChange={(e) =>
                    handleFilterChange("characterName", e.target.value)
                  }
                  className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[200px] text-base"
                >
                  {characterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-gray-700">trong vở chèo</span>
                <select
                  value={filters.performance || ""}
                  onChange={(e) =>
                    handleFilterChange("performance", e.target.value)
                  }
                  className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[220px] text-base"
                >
                  {playOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleSearch(3)}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>🎭</span>
                <span>Tìm xuất hiện</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Danh sách những lần nhân vật có nét diễn */}
        {activeTab === 4 && (
          <div className="bg-white p-8 rounded-lg border-2 border-primary-200">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-primary-600 mb-2 flex items-center gap-2">
                <span>😊</span>
                <span>Danh sách nét diễn của nhân vật</span>
              </h3>
              <p className="text-gray-600">
                Tìm kiếm các cảnh diễn có biểu cảm cụ thể của nhân vật
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-center gap-3 text-lg">
                <span className="text-gray-700">Xem nét diễn của</span>
                <select
                  value={filters.characterName || ""}
                  onChange={(e) =>
                    handleFilterChange("characterName", e.target.value)
                  }
                  className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[200px] text-base"
                >
                  {characterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="text-gray-700">với biểu cảm</span>
                <select className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[160px] text-base">
                  {actorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleSearch(4)}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>😊</span>
                <span>Tìm nét diễn</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Xem mô tả */}
        {activeTab === 5 && (
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
                <select className="px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white min-w-[180px] text-base">
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => handleSearch(5)}
                className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition-all duration-300 font-medium text-lg flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <span>📖</span>
                <span>Xem mô tả</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
