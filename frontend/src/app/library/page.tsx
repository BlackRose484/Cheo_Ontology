"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getMainTypeCategories,
  getSubTypesByMainType,
  filterCharactersByCategory,
} from "@/apis/infor";
import {
  LibraryItem,
  CharacterName,
  ActorName,
  PlayTitle,
  Character,
} from "@/types/index";
import LibraryVideoCard from "@/components/library/LibraryVideoCard";
import Link from "next/link";
import { useLibraryData } from "@/hooks/useLibraryQueries";

type TabType = "videos" | "characters" | "actors" | "plays";

export default function LibraryPage() {
  // Use cached library data
  const {
    library: libraryQuery,
    characters: charactersQuery,
    actors: actorsQuery,
    plays: playsQuery,
    isLoading: libraryDataLoading,
  } = useLibraryData();

  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [mainTypes, setMainTypes] = useState<string[]>([]);
  const [subTypes, setSubTypes] = useState<string[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter states
  const [selectedMainType, setSelectedMainType] = useState<string>("all");
  const [selectedSubType, setSelectedSubType] = useState<string>("all");

  // Derived state from cached data using useMemo
  const library = useMemo(() => libraryQuery.data || [], [libraryQuery.data]);
  const characters = useMemo(
    () => charactersQuery.data || [],
    [charactersQuery.data]
  );
  const actors = useMemo(() => actorsQuery.data || [], [actorsQuery.data]);
  const plays = useMemo(() => playsQuery.data || [], [playsQuery.data]);
  const isLoading = libraryDataLoading;

  // Initialize filtered characters when characters data loads
  useEffect(() => {
    if (characters && characters.length > 0) {
      setFilteredCharacters(characters);
    }
  }, [characters]);

  // Load main types for filtering (only load categories, not main data)
  useEffect(() => {
    const fetchMainTypes = async () => {
      try {
        const mainTypesRes = await getMainTypeCategories();
        if (mainTypesRes.data && Array.isArray(mainTypesRes.data)) {
          setMainTypes(mainTypesRes.data);
        }
      } catch (err) {
        console.error("Error fetching main types:", err);
        setError("Lỗi khi tải danh mục. Vui lòng thử lại sau.");
      }
    };

    fetchMainTypes();
  }, []);

  useEffect(() => {
    const fetchSubTypes = async () => {
      if (selectedMainType === "all") {
        setSubTypes([]);
        setSelectedSubType("all");
        setFilteredCharacters(characters);
      } else {
        try {
          const subTypesRes = await getSubTypesByMainType(selectedMainType);
          if (subTypesRes.data) {
            setSubTypes(subTypesRes.data);
          }
        } catch (error) {
          console.error("Error fetching subtypes:", error);
          setSubTypes([]);
        }
        setSelectedSubType("all");
      }
    };

    fetchSubTypes();
  }, [selectedMainType, characters]);

  useEffect(() => {
    const applyFilterEffect = async () => {
      if (characters.length === 0 || activeTab !== "characters") return;

      if (selectedMainType === "all") {
        return;
      }

      try {
        setFilterLoading(true);
        const filterMainType =
          selectedMainType === "all" ? "" : selectedMainType;
        const filterSubType = selectedSubType === "all" ? "" : selectedSubType;

        const result = await filterCharactersByCategory(
          filterMainType,
          filterSubType
        );
        if (result.data && Array.isArray(result.data)) {
          setFilteredCharacters(result.data);
        }
      } catch (error) {
        console.error("Error filtering characters:", error);
        setFilteredCharacters(characters);
      } finally {
        setFilterLoading(false);
      }
    };

    applyFilterEffect();
  }, [selectedMainType, selectedSubType, characters, activeTab]);

  // Reset filters
  const resetFilters = () => {
    setSelectedMainType("all");
    setSelectedSubType("all");
  };

  // Calculate pagination for current tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "videos":
        return library;
      case "characters":
        return filteredCharacters;
      case "actors":
        return actors;
      case "plays":
        return plays;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = currentData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    // Reset filters when switching away from characters tab
    if (tab !== "characters") {
      setSelectedMainType("all");
      setSelectedSubType("all");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-200 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-1.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center py-16">
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-red-400">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-800 border-t-transparent mx-auto mb-4"></div>
              <span className="text-red-900 font-medium">
                Đang tải thư viện ...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-200 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-8 border border-red-400 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-red-900 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-800 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-lg hover:from-red-900 hover:to-red-800 transition-all duration-200 font-medium shadow-md"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-amber-50 to-red-200 py-8 relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/trong-dong-2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-200">
            {/* Vietnamese flag inspired banner */}
            <div className="bg-gradient-to-r from-red-800 to-amber-600 p-4 rounded-lg mb-4 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url('/cheo-1.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-traditional flex items-center gap-3 relative z-10">
                <span className="text-4xl">🏛️</span>
                Thư viện Chèo
              </h1>
              <p className="text-amber-100 text-lg relative z-10">
                Khám phá bộ sưu tập nghệ thuật Chèo truyền thống Việt Nam
              </p>
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleTabChange("videos")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "videos"
                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg"
                    : "bg-white text-red-800 border-2 border-red-800 hover:border-red-900 hover:bg-red-50"
                }`}
              >
                <span>🎥</span>
                <span>Video ({library.length})</span>
              </button>
              <button
                onClick={() => handleTabChange("characters")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "characters"
                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg"
                    : "bg-white text-red-800 border-2 border-red-800 hover:border-red-900 hover:bg-red-50"
                }`}
              >
                <span>🎭</span>
                <span>Nhân vật ({filteredCharacters.length})</span>
              </button>
              <button
                onClick={() => handleTabChange("actors")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "actors"
                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg"
                    : "bg-white text-red-800 border-2 border-red-800 hover:border-red-900 hover:bg-red-50"
                }`}
              >
                <span>👨‍🎤</span>
                <span>Diễn viên ({actors.length})</span>
              </button>
              <button
                onClick={() => handleTabChange("plays")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === "plays"
                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-lg"
                    : "bg-white text-red-800 border-2 border-red-800 hover:border-red-900 hover:bg-red-50"
                }`}
              >
                <span>🎪</span>
                <span>Vở chèo ({plays.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-red-800">
              <span>📊 {currentData.length} mục</span>
              <span>
                📄 Trang {currentPage}/{totalPages}
              </span>
              <span>🎭 Nghệ thuật dân gian</span>
              <span>🇻🇳 Văn hóa Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Filter Section - Only visible when on characters tab */}
        {activeTab === "characters" && (
          <div className="mb-6">
            <div className="bg-white/95 backdrop-blur-sm border border-red-200 rounded-xl shadow-lg p-4">
              <div className="flex flex-wrap items-center justify-end gap-3">
                {/* Filter Status */}
                {filterLoading && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <div className="animate-spin rounded-full h-3 w-3 border border-red-600 border-t-transparent"></div>
                    <span>Đang lọc...</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-red-800 font-medium text-sm">🔍</span>
                </div>

                {/* Main Type Filter */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-red-800 whitespace-nowrap">
                    Loại chính:
                  </label>
                  <select
                    value={selectedMainType}
                    onChange={(e) => setSelectedMainType(e.target.value)}
                    className="px-2 py-1 border border-red-300 rounded-md bg-white text-red-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 min-w-[100px]"
                    style={{ fontSize: "0.9rem" }}
                    disabled={isLoading}
                  >
                    <option value="all">Tất cả</option>
                    {mainTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Type Filter */}
                <div className="flex items-center gap-2 group">
                  <label className="text-sm font-medium text-red-800 whitespace-nowrap">
                    Loại phụ:
                  </label>
                  <div className="relative flex flex-col">
                    <select
                      value={selectedSubType}
                      onChange={(e) => setSelectedSubType(e.target.value)}
                      className={`px-2 py-1 border border-red-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 min-w-[100px] ${
                        isLoading || selectedMainType === "all"
                          ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                          : "bg-white text-red-800"
                      }`}
                      style={{ fontSize: "0.9rem" }}
                      disabled={isLoading || selectedMainType === "all"}
                    >
                      <option value="all">Tất cả</option>
                      {selectedMainType !== "all" &&
                        subTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </select>

                    {/* Custom Tooltip */}
                    {selectedMainType === "all" && (
                      <div className="absolute top-full left-0 mt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
                        <div className="bg-gray-800 text-white text-xs rounded-md py-2 px-3 whitespace-nowrap shadow-lg">
                          <div className="flex items-center gap-1">
                            <span>💡</span>
                            <span>
                              Chọn loại chính trước để lọc theo loại phụ
                            </span>
                          </div>
                          {/* Tooltip arrow */}
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-800 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-2 py-1 text-sm bg-red-800 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors duration-200 whitespace-nowrap"
                  disabled={isLoading}
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Grid */}
        {library.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-red-200 text-center">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-medium text-red-900 mb-2">
              Chưa có video nào
            </h3>
            <p className="text-red-800">
              Thư viện video đang được cập nhật. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentItems.map(
                (
                  item: LibraryItem | CharacterName | ActorName | PlayTitle,
                  index: number
                ) => {
                  if (
                    activeTab === "videos" &&
                    typeof item === "object" &&
                    item !== null &&
                    "vidVersion" in item
                  ) {
                    return (
                      <LibraryVideoCard
                        key={item.vidVersion || index}
                        item={item as LibraryItem}
                      />
                    );
                  } else {
                    const getKeyLabel = () => {
                      if (activeTab === "characters") {
                        return (item as CharacterName).charName;
                      } else if (activeTab === "actors") {
                        return (item as ActorName).name;
                      } else if (activeTab === "plays") {
                        return (item as PlayTitle).title;
                      }
                      return "";
                    };

                    const getHref = () => {
                      if (activeTab === "characters") {
                        return `/character/${encodeURIComponent(
                          (item as CharacterName).charName
                        )}`;
                      } else if (activeTab === "actors") {
                        return `/actor/${encodeURIComponent(
                          (item as ActorName).name
                        )}`;
                      } else if (activeTab === "plays") {
                        return `/play/${encodeURIComponent(
                          (item as PlayTitle).title
                        )}`;
                      }
                      return "#";
                    };

                    return (
                      <Link
                        key={getKeyLabel() || index}
                        href={getHref()}
                        className="group"
                      >
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 p-6 h-64 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-red-400 cursor-pointer">
                          <div
                            className="relative rounded-lg p-4 flex-1 text-white text-center overflow-hidden flex flex-col justify-center items-center"
                            style={{
                              backgroundImage: `url('/background.png')`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          >
                            {/* Dark overlay to make text readable */}
                            <div className="absolute inset-0 bg-red-900/60 rounded-lg"></div>
                            <div className="relative z-10 flex flex-col justify-center items-center h-full">
                              <span className="text-4xl mb-3 block drop-shadow-lg">
                                {activeTab === "characters"
                                  ? "🎭"
                                  : activeTab === "actors"
                                  ? "👨‍🎤"
                                  : "🎪"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-center text-center pt-3 mt-auto">
                            <p className="text-red-800 text-sm !font-bold text-center w-full">
                              {getKeyLabel()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  }
                }
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-red-100">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-red-800 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                            : "text-red-800 bg-white border border-red-300 hover:bg-red-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-red-800 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-amber-200">
            <p className="text-red-800 text-sm font-medium">
              Bộ sưu tập video nghệ thuật Chèo được sưu tầm và lưu trữ với mục
              đích bảo tồn văn hóa
            </p>
            <div className="mt-3 flex justify-center items-center gap-2">
              <span className="text-red-800">🇻🇳</span>
              <span className="text-amber-600 font-semibold">
                Tự hào văn hóa Việt Nam
              </span>
              <span className="text-red-800">🇻🇳</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
