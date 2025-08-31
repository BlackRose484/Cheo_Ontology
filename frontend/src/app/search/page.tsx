"use client";

import { useState } from "react";
import SearchForm from "@/components/search/SearchForm";
import CharacterStateTable from "@/components/results/CharacterStateTable";
import GeneralResultsDisplay from "@/components/results/GeneralResultsDisplay";
import {
  SearchType,
  CharacterStates,
  CharacterState,
  SearchStatesFilters,
  GeneralDescriptionFilters,
  CharacterGenerals,
  PlayGenerals,
  ActorGenerals,
} from "@/types";
import { getCharacterStates, searchSceneGeneral } from "@/apis/search";
import {
  searchCharacterGeneral,
  searchPlayGeneral,
  searchActorGeneral,
} from "@/apis/search";

// Define interface for general search results
interface GeneralSearchResults {
  category: string;
  items: CharacterGenerals | PlayGenerals | ActorGenerals | string[];
  totalCount: number;
  searchCriteria: GeneralDescriptionFilters;
}

export default function SearchPage() {
  const [characterStateResults, setCharacterStateResults] =
    useState<CharacterStates>([]);
  const [generalSearchResults, setGeneralSearchResults] =
    useState<GeneralSearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchType, setCurrentSearchType] = useState<
    "general" | "character-state"
  >("general");

  const handleSearch = async (
    filters: SearchStatesFilters | GeneralDescriptionFilters,
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

    // Check if this is a character state search
    if ("character" in filters || "play" in filters || "emotion" in filters) {
      setCurrentSearchType("character-state");
      const stateFilters = filters as SearchStatesFilters;

      try {
        const response = await getCharacterStates(
          stateFilters.character || "",
          stateFilters.play || "",
          stateFilters.emotion || ""
        );

        const results = response.data;

        const characterStateData: CharacterStates = results.map(
          (char: CharacterState) => ({
            ...char,
          })
        );
        setCharacterStateResults(characterStateData);
        setGeneralSearchResults(null); // Clear other results
      } catch (error) {
        console.error("Error fetching character states:", error);
      }
    }
    // Handle general description search
    else if ("category" in filters) {
      setCurrentSearchType("general");
      const generalFilters = filters as GeneralDescriptionFilters;

      try {
        let items: CharacterGenerals | PlayGenerals | ActorGenerals | string[] =
          [];

        switch (generalFilters.category) {
          case "Character":
            if (generalFilters.selectedItem) {
              // Search for specific character
              const charResponse = await searchCharacterGeneral(
                generalFilters.selectedItem
              );
              items = charResponse.data as CharacterGenerals;
            } else {
              // Return empty array if no specific character selected
              items = [];
            }
            break;
          case "Play":
            if (generalFilters.selectedItem) {
              // Search for specific play
              const playResponse = await searchPlayGeneral(
                generalFilters.selectedItem
              );
              items = playResponse.data as PlayGenerals;
            } else {
              // Return empty array if no specific play selected
              items = [];
            }
            break;
          case "Actor":
            if (generalFilters.selectedItem) {
              // Search for specific actor
              const actorResponse = await searchActorGeneral(
                generalFilters.selectedItem
              );
              items = actorResponse.data as ActorGenerals;
            } else {
              // Return empty array if no specific actor selected
              items = [];
            }
            break;
          case "Scene":
            if (generalFilters.selectedItem) {
              // Search for specific scene
              const sceneResponse = await searchSceneGeneral(
                generalFilters.selectedItem
              );
              items = sceneResponse.data as string[];
            } else {
              items = [];
            }
            break;
          default:
            items = [];
        }

        const results: GeneralSearchResults = {
          category: generalFilters.category,
          items,
          totalCount: items.length,
          searchCriteria: generalFilters,
        };

        setGeneralSearchResults(results);
        setCharacterStateResults([]); // Clear other results
      } catch (error) {
        console.error("Error fetching general description data:", error);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 py-8 relative overflow-hidden">
      {/* Vietnamese cultural background */}
      <div className="absolute inset-0 bg-[url('/cheo-2.jpg')] opacity-5 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/8 via-transparent to-yellow-400/8"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-red-800 mb-4 font-traditional">
            Tìm kiếm thông tin Chèo
          </h1>
          <div className="w-32 h-2 bg-gradient-to-r from-red-600 to-yellow-400 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-red-700 max-w-2xl mx-auto">
            Khám phá kho tàng tri thức về nghệ thuật Chèo truyền thống Việt Nam
            🇻🇳
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Search Results */}
        {hasSearched && (
          <div className="mb-8">
            {currentSearchType === "character-state" ? (
              <CharacterStateTable
                results={characterStateResults}
                isLoading={isLoading}
              />
            ) : (
              <GeneralResultsDisplay
                results={generalSearchResults}
                isLoading={isLoading}
              />
            )}
          </div>
        )}

        {/* Help Section */}
        {!hasSearched && (
          <div className="bg-white/80 rounded-lg shadow-lg p-6 border-2 border-yellow-400 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-red-800 mb-4 font-traditional">
              Hướng dẫn tìm kiếm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-700">
              <div>
                <h4 className="font-medium text-red-800 mb-2">
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
                <h4 className="font-medium text-red-800 mb-2">
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
