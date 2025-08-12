"use client";

import { useState } from "react";
import SearchForm from "@/components/search/SearchForm";
import SearchResultsDisplay from "@/components/results/SearchResultsDisplay";
import { SearchFilters, SearchType, SearchResults } from "@/types";
import { getCharacterByName } from "@/apis/search";

export default function SearchPage() {
  const [results, setResults] = useState<SearchResults>({
    characters: [],
    quotes: [],
    performances: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (
    filters: SearchFilters,
    searchType: SearchType
  ) => {
    setIsLoading(true);
    setHasSearched(true);

    console.log(
      "Search initiated with filters:",
      filters,
      "and searchType:",
      searchType
    );

    if (searchType === "characters") {
      try {
        const response = await getCharacterByName(filters.characterName ?? "");
        const results = response.data.data;
        console.log("Search results:", results);
        setResults({ characters: results, quotes: results, performances: [] });
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            Tìm kiếm thông tin Chèo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá kho tàng tri thức về nghệ thuật Chèo truyền thống Việt Nam
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            <SearchResultsDisplay results={results} isLoading={isLoading} />
          </div>
        )}

        {/* Help Section */}
        {!hasSearched && (
          <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
            <h3 className="text-xl font-semibold text-ancient-ink mb-4 font-traditional">
              Hướng dẫn tìm kiếm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
              <div>
                <h4 className="font-medium text-ancient-ink mb-2">
                  💡 Mẹo tìm kiếm:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Sử dụng từ khóa đơn giản và chính xác</li>
                  <li>• Kết hợp nhiều bộ lọc để thu hẹp kết quả</li>
                  <li>
                    • Thử tìm kiếm theo tên nhân vật hoặc nội dung trích dẫn
                  </li>
                  <li>• Sử dụng các gợi ý tìm kiếm nhanh</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-ancient-ink mb-2">
                  🎭 Ví dụ tìm kiếm:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Nhân vật: &quot;Thị Mầu&quot;, &quot;Chú Cuội&quot;</li>
                  <li>
                    • Trích dẫn: &quot;trăng kia&quot;, &quot;làm người&quot;
                  </li>
                  <li>• Vở diễn: &quot;Quan Âm&quot;, &quot;Tấm Cám&quot;</li>
                  <li>• Giới tính: Chọn &quot;Nam&quot; hoặc &quot;Nữ&quot;</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
