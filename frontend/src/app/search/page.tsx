"use client";

import { useState } from "react";
import SearchForm from "@/components/search/SearchForm";
import CharacterStateTable from "@/components/results/CharacterStateTable";
import GeneralResultsDisplay from "@/components/results/GeneralResultsDisplay";
import {
  SearchType,
  SearchStatesFilters,
  GeneralDescriptionFilters,
} from "@/types";
import {
  useCharacterStates,
  useCharacterGeneral,
  usePlayGeneral,
  useActorGeneral,
  useSceneGeneral,
} from "@/hooks/useSearchQueries";

export default function SearchPage() {
  const [hasSearched, setHasSearched] = useState(false);
  const [currentSearchType, setCurrentSearchType] = useState<
    "general" | "character-state"
  >("general");

  // State to control cached queries
  const [characterSearchParams, setCharacterSearchParams] = useState<{
    character: string;
    scene: string;
    emotion: string;
  } | null>(null);

  const [generalSearchParams, setGeneralSearchParams] = useState<{
    category: string;
    selectedItem: string;
  } | null>(null);

  // Cached queries - only enabled when we have search params
  const { data: cachedCharacterStates, isLoading: isCharacterStatesLoading } =
    useCharacterStates(
      characterSearchParams?.character || "",
      characterSearchParams?.scene || "",
      characterSearchParams?.emotion || "all",
      !!characterSearchParams && currentSearchType === "character-state"
    );

  const { data: cachedCharacterGeneral, isLoading: isCharacterGeneralLoading } =
    useCharacterGeneral(
      generalSearchParams?.selectedItem || "",
      !!generalSearchParams &&
        generalSearchParams.category === "Character" &&
        currentSearchType === "general"
    );

  const { data: cachedPlayGeneral, isLoading: isPlayGeneralLoading } =
    usePlayGeneral(
      generalSearchParams?.selectedItem || "",
      !!generalSearchParams &&
        generalSearchParams.category === "Play" &&
        currentSearchType === "general"
    );

  const { data: cachedActorGeneral, isLoading: isActorGeneralLoading } =
    useActorGeneral(
      generalSearchParams?.selectedItem || "",
      !!generalSearchParams &&
        generalSearchParams.category === "Actor" &&
        currentSearchType === "general"
    );

  const { data: cachedSceneGeneral, isLoading: isSceneGeneralLoading } =
    useSceneGeneral(
      generalSearchParams?.selectedItem || "",
      !!generalSearchParams &&
        generalSearchParams.category === "Scene" &&
        currentSearchType === "general"
    );

  const handleSearch = async (
    filters: SearchStatesFilters | GeneralDescriptionFilters,
    searchType: SearchType
  ) => {
    setHasSearched(true);

    console.log(
      "🔍 Search initiated with filters:",
      filters,
      "and searchType:",
      searchType
    );

    // Check if this is a character state search
    if ("character" in filters || "play" in filters || "emotion" in filters) {
      setCurrentSearchType("character-state");
      const stateFilters = filters as SearchStatesFilters;

      // Trigger cached query by setting params
      setCharacterSearchParams({
        character: stateFilters.character || "",
        scene: stateFilters.scene || "",
        emotion: stateFilters.emotion || "all",
      });

      // Clear other results
      setGeneralSearchParams(null);
    }
    // Handle general description search
    else if ("category" in filters) {
      setCurrentSearchType("general");
      const generalFilters = filters as GeneralDescriptionFilters;

      // Trigger cached query by setting params
      setGeneralSearchParams({
        category: generalFilters.category,
        selectedItem: generalFilters.selectedItem || "",
      });

      // Clear other results
      setCharacterSearchParams(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-200 py-8 relative overflow-hidden">
      {/* Vietnamese cultural background */}
      <div className="absolute inset-0 bg-[url('/cheo-2.jpg')] opacity-5 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-800/8 via-transparent to-amber-500/8"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-red-900 mb-4 font-traditional">
            Tìm kiếm thông tin Chèo
          </h1>
          <div className="w-32 h-2 bg-gradient-to-r from-red-800 to-amber-500 mx-auto mb-6 rounded-full"></div>
          <p className="text-lg text-red-800 max-w-2xl mx-auto">
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
                results={cachedCharacterStates || []}
                isLoading={isCharacterStatesLoading}
              />
            ) : (
              <GeneralResultsDisplay
                results={
                  generalSearchParams
                    ? {
                        category: generalSearchParams.category,
                        items:
                          generalSearchParams.category === "Character"
                            ? cachedCharacterGeneral || []
                            : generalSearchParams.category === "Play"
                            ? cachedPlayGeneral || []
                            : generalSearchParams.category === "Actor"
                            ? cachedActorGeneral || []
                            : generalSearchParams.category === "Scene"
                            ? cachedSceneGeneral || []
                            : [],
                        totalCount:
                          generalSearchParams.category === "Character"
                            ? (cachedCharacterGeneral || []).length
                            : generalSearchParams.category === "Play"
                            ? (cachedPlayGeneral || []).length
                            : generalSearchParams.category === "Actor"
                            ? (cachedActorGeneral || []).length
                            : generalSearchParams.category === "Scene"
                            ? (cachedSceneGeneral || []).length
                            : 0,
                        searchCriteria: {
                          category: generalSearchParams.category,
                          selectedItem: generalSearchParams.selectedItem,
                        },
                      }
                    : null
                }
                isLoading={
                  generalSearchParams?.category === "Character"
                    ? isCharacterGeneralLoading
                    : generalSearchParams?.category === "Play"
                    ? isPlayGeneralLoading
                    : generalSearchParams?.category === "Actor"
                    ? isActorGeneralLoading
                    : generalSearchParams?.category === "Scene"
                    ? isSceneGeneralLoading
                    : false
                }
              />
            )}
          </div>
        )}

        {/* Help Section */}
        {!hasSearched && (
          <div className="bg-white/90 rounded-lg shadow-xl p-6 border-2 border-amber-400 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-red-900 mb-4 font-traditional">
              Hướng dẫn tìm kiếm
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-red-800">
              <div>
                <h4 className="font-medium text-red-800 mb-2">
                  💡 Cách tìm kiếm:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Tìm kiếm chung:</strong> Chọn danh mục (Nhân vật,
                    Diễn viên, Vở chèo, Trích đoạn) rồi chọn mục cụ thể
                  </li>
                  <li>
                    • <strong>Tìm kiếm trạng thái:</strong> Tìm trạng thái cảm
                    xúc của nhân vật trong vở chèo
                  </li>
                  <li>
                    • Sử dụng danh sách thả xuống để chọn từ các tùy chọn có sẵn
                  </li>
                  <li>• Có thể để trống một số trường để mở rộng kết quả</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-800 mb-2">
                  🎭 Ví dụ tìm kiếm:
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>
                    • <strong>Tìm nhân vật:</strong> Chọn &ldquo;Nhân vật&rdquo;
                    → chọn tên nhân vật từ danh sách
                  </li>
                  <li>
                    • <strong>Tìm vở chèo:</strong> Chọn &ldquo;Vở chèo&rdquo; →
                    chọn tên vở từ danh sách
                  </li>
                  <li>
                    • <strong>Tìm trạng thái:</strong> Chọn nhân vật + vở chèo +
                    cảm xúc
                  </li>
                  <li>
                    • <strong>Tìm diễn viên:</strong> Chọn &ldquo;Diễn
                    viên&rdquo; → chọn tên diễn viên
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
