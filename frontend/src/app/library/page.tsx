"use client";

import { useEffect, useState } from "react";
import {
  getLibrary,
  getCharacters,
  getActorNames,
  getPlays,
} from "@/apis/infor";
import { Library, LibraryItem } from "@/types/index";
import LibraryVideoCard from "@/components/library/LibraryVideoCard";
import Link from "next/link";

type TabType = "videos" | "characters" | "actors" | "plays";

export default function LibraryPage() {
  const [library, setLibrary] = useState<Library>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [plays, setPlays] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("videos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [libraryRes, charactersRes, actorsRes, playsRes] =
          await Promise.all([
            getLibrary(),
            getCharacters(),
            getActorNames(),
            getPlays(),
          ]);

        if (libraryRes.data && Array.isArray(libraryRes.data)) {
          setLibrary(libraryRes.data);
        }
        if (charactersRes.data && Array.isArray(charactersRes.data)) {
          setCharacters(charactersRes.data);
        }
        if (actorsRes.data && Array.isArray(actorsRes.data)) {
          setActors(actorsRes.data);
        }
        if (playsRes.data && Array.isArray(playsRes.data)) {
          setPlays(playsRes.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Lỗi khi tải dữ liệu thư viện. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculate pagination for current tab
  const getCurrentData = () => {
    switch (activeTab) {
      case "videos":
        return library;
      case "characters":
        return characters;
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
                Đang tải thư viện video...
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
                <span>Nhân vật ({characters.length})</span>
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
                <span>Vở diễn ({plays.length})</span>
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

        {/* Video Grid */}
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
              {currentItems.map((item: LibraryItem | string, index: number) => {
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
                  // For characters, actors, and plays
                  const itemString = item as string;
                  const getHref = () => {
                    switch (activeTab) {
                      case "characters":
                        return `/character/${encodeURIComponent(itemString)}`;
                      case "actors":
                        return `/actor/${encodeURIComponent(itemString)}`;
                      case "plays":
                        return `/play/${encodeURIComponent(itemString)}`;
                      default:
                        return `/search?query=${encodeURIComponent(
                          itemString
                        )}`;
                    }
                  };

                  return (
                    <Link
                      key={itemString || index}
                      href={getHref()}
                      className="group"
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-red-200 p-6 h-full transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-red-400 cursor-pointer">
                        <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-lg p-4 mb-4 text-white text-center">
                          <span className="text-4xl mb-2 block">
                            {activeTab === "characters"
                              ? "🎭"
                              : activeTab === "actors"
                              ? "👨‍🎤"
                              : "🎪"}
                          </span>
                          <h3 className="text-lg font-bold text-center text-white group-hover:text-amber-200 transition-colors duration-300">
                            {itemString}
                          </h3>
                        </div>
                        <div className="text-center">
                          <p className="text-red-800 text-sm">
                            {activeTab === "characters"
                              ? "Nhân vật Chèo"
                              : activeTab === "actors"
                              ? "Diễn viên"
                              : "Vở diễn"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
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
