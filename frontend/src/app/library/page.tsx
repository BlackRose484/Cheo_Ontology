"use client";

import { useState, useEffect } from "react";
import { Character, Performance } from "@/types";
import { getPlays } from "@/apis/infor";
import useSearchData from "@/hooks/useSearchData";
import Link from "next/link";

const LibraryPage = () => {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [activeTab, setActiveTab] = useState<"characters" | "performances">(
    "characters"
  );
  const [isLoadingPerformances, setIsLoadingPerformances] = useState(true);

  // Use custom hook for characters data
  const { characters: characterNames, isLoading: isLoadingCharacters } =
    useSearchData();

  // Convert character names to Character objects
  const characters: Character[] = characterNames.map((name, index) => ({
    id: `character-${index}`,
    name: name,
    gender: "nam" as const, // Default, should be fetched from proper API
    description: "Thông tin chi tiết sẽ được cập nhật...",
  }));

  useEffect(() => {
    const fetchPerformances = async () => {
      try {
        setIsLoadingPerformances(true);
        const playsResponse = await getPlays();

        if (playsResponse.data) {
          const performancesData = Array.isArray(playsResponse.data)
            ? playsResponse.data.map((title: string, index: number) => ({
                id: `performance-${index}`,
                title: title,
                description: "Mô tả vở diễn sẽ được cập nhật...",
                characters: [],
                quotes: [],
              }))
            : [];
          setPerformances(performancesData);
        }
      } catch (error) {
        console.error("Error fetching library data:", error);
      } finally {
        setIsLoadingPerformances(false);
      }
    };

    fetchPerformances();
  }, []);

  const isLoading = isLoadingCharacters || isLoadingPerformances;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-ancient-ink">
                Đang tải thư viện...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            📚 Thư viện Chèo
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-jade mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập đầy đủ về nhân vật và vở diễn Chèo truyền thống
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-ancient p-1 border-2 border-accent">
            <button
              onClick={() => setActiveTab("characters")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "characters"
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-gray-600 hover:text-ancient-ink hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">👥</span>
              Nhân vật ({characters.length})
            </button>
            <button
              onClick={() => setActiveTab("performances")}
              className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                activeTab === "performances"
                  ? "bg-primary-500 text-white shadow-md"
                  : "text-gray-600 hover:text-ancient-ink hover:bg-gray-50"
              }`}
            >
              <span className="mr-2">🎭</span>
              Vở diễn ({performances.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === "characters" ? (
          // Characters Tab
          <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {characters.map((character) => (
                <div
                  key={character.id}
                  className="bg-white rounded-lg p-4 border border-accent hover:shadow-soft transition-all duration-200 group hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-ancient-ink text-lg group-hover:text-primary-600">
                      {character.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        character.gender === "nam"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {character.gender}
                    </span>
                  </div>

                  {character.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {character.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      ID: {character.id}
                    </span>
                    <Link
                      href={`/character/${character.name}`}
                      className="inline-flex items-center px-3 py-1.5 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm"
                    >
                      <span className="mr-1">👁</span>
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {characters.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-medium text-ancient-ink mb-2">
                  Chưa có nhân vật nào
                </h3>
                <p className="text-gray-600">
                  Dữ liệu nhân vật sẽ được cập nhật sớm.
                </p>
              </div>
            )}
          </div>
        ) : (
          // Performances Tab
          <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {performances.map((performance) => (
                <div
                  key={performance.id}
                  className="bg-white rounded-lg p-4 border border-accent hover:shadow-soft transition-all duration-200 group hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-ancient-ink text-lg group-hover:text-primary-600">
                      {performance.title}
                    </h3>
                    <div className="text-3xl">🎭</div>
                  </div>

                  {performance.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {performance.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>
                      <strong>Nhân vật:</strong> {performance.characters.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      ID: {performance.id}
                    </span>
                    <button
                      className="inline-flex items-center px-3 py-1.5 bg-gray-300 text-gray-600 rounded-md cursor-not-allowed text-sm"
                      disabled
                    >
                      <span className="mr-1">👁</span>
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {performances.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-medium text-ancient-ink mb-2">
                  Chưa có vở diễn nào
                </h3>
                <p className="text-gray-600">
                  Dữ liệu vở diễn sẽ được cập nhật sớm.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500">
                {characters.length}
              </div>
              <p className="text-gray-600">Nhân vật</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">
                {performances.length}
              </div>
              <p className="text-gray-600">Vở diễn</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500">
                {characters.length + performances.length}
              </div>
              <p className="text-gray-600">Tổng cộng</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryPage;
