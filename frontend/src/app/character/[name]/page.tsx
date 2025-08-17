"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCharacterById } from "@/apis/infor";
import { CharacterGeneral } from "@/types";
import Link from "next/link";

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const charName = decodeURIComponent(params.name as string);

  const [character, setCharacter] = useState<CharacterGeneral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getCharacterById(charName);
        console.log("Character detail response:", response);

        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          setCharacter(response.data[0]);
        } else {
          setError("Không tìm thấy thông tin nhân vật này");
        }
      } catch (error) {
        console.error("Error fetching character detail:", error);
        setError("Lỗi khi tải thông tin nhân vật. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (charName) {
      fetchCharacterDetail();
    }
  }, [charName]);

  const handleBackToSearch = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-ancient-ink">
                Đang tải thông tin nhân vật...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              Không tìm thấy thông tin
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleBackToSearch}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Quay lại tìm kiếm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-800 transition-colors"
            >
              <span>←</span>
              <span>Quay lại tìm kiếm</span>
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-2 font-traditional flex items-center gap-3">
            <span className="text-4xl">🎭</span>
            {character.name || character.charName}
          </h1>
        </div>

        {/* Character Details */}
        <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>Thông tin cơ bản</span>
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Tên nhân vật:
                    </span>
                    <span className="text-blue-800 font-semibold">
                      {character.name || character.charName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Giới tính:
                    </span>
                    <span className="text-pink-800 capitalize">
                      {character.gender || character.charGender}
                    </span>
                  </div>
                  {character.mainType && (
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Loại chính:
                      </span>
                      <span className="text-green-800">
                        {character.mainType}
                      </span>
                    </div>
                  )}
                  {character.subType && (
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Loại phụ:
                      </span>
                      <span className="text-yellow-800">
                        {character.subType}
                      </span>
                    </div>
                  )}
                  {character.inPlay && (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="font-medium text-gray-700">
                        Vở chèo:
                      </span>
                      <Link
                        href={`/play/${encodeURIComponent(character.inPlay)}`}
                        className="text-purple-800 hover:text-purple-900 hover:underline"
                      >
                        {character.inPlay}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              {character.description && (
                <div>
                  <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                    <span>📖</span>
                    <span>Mô tả</span>
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <p className="text-gray-700 leading-relaxed">
                      {character.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>🎬</span>
                  <span>Khám phá thêm</span>
                </h2>
                <div className="space-y-3">
                  <Link
                    href={`/character/${encodeURIComponent(charName)}/video`}
                    className="block w-full p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🎥</span>
                      <span>Xem video biểu diễn</span>
                    </div>
                  </Link>
                  <Link
                    href={`/search?character=${encodeURIComponent(charName)}`}
                    className="block w-full p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🔍</span>
                      <span>Tìm kiếm trạng thái nhân vật</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
