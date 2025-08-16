"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character } from "@/types";
import { getCharacterById } from "@/apis/infor";

const CharacterDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterDetail = async () => {
      if (!params.id || typeof params.id !== "string") {
        setError("ID nhân vật không hợp lệ");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Call API getCharacterById
        const response = await getCharacterById(params.id);
        setCharacter(response.data);
      } catch (err) {
        console.error("Error fetching character detail:", err);
        setError("Không thể tải thông tin nhân vật");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacterDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-ancient-ink">Đang tải...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-accent to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              {error || "Không tìm thấy nhân vật"}
            </h3>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200"
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-800 mb-4"
          >
            <span className="mr-2">←</span>
            Quay lại
          </button>
          <h1 className="text-4xl font-bold text-ancient-ink font-traditional">
            Chi tiết nhân vật
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Info Card */}
          <div className="lg:col-span-2">
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-ancient-ink mb-2">
                    {character.name}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        character.gender === "nam"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {character.gender}
                    </span>
                    {character.role && (
                      <span className="px-3 py-1 bg-accent text-ancient-ink rounded-full text-sm font-medium">
                        Vai {character.role}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-6xl">🎭</div>
              </div>

              {character.description && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-ancient-ink mb-2">
                    Mô tả
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {character.description}
                  </p>
                </div>
              )}

              {/* Performance Details */}
              {(character.performance ||
                character.scene ||
                character.expression ||
                character.actor) && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-ancient-ink mb-4">
                    Thông tin biểu diễn
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.performance && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Vở kịch:
                        </span>
                        <p className="text-ancient-ink mt-1">
                          {character.performance}
                        </p>
                      </div>
                    )}
                    {character.scene && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Trích đoạn:
                        </span>
                        <p className="text-ancient-ink mt-1">
                          {character.scene}
                        </p>
                      </div>
                    )}
                    {character.expression && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Nét biểu cảm:
                        </span>
                        <p className="text-ancient-ink mt-1">
                          {character.expression}
                        </p>
                      </div>
                    )}
                    {character.actor && (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <span className="font-medium text-gray-700">
                          Diễn viên:
                        </span>
                        <p className="text-ancient-ink mt-1">
                          {character.actor}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h3 className="text-lg font-semibold text-ancient-ink mb-4">
                Thông tin nhanh
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {character.id}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Giới tính:</span>
                  <span className="ml-2 text-ancient-ink font-medium">
                    {character.gender}
                  </span>
                </div>
                {character.role && (
                  <div>
                    <span className="text-gray-600">Vai trò:</span>
                    <span className="ml-2 text-ancient-ink font-medium">
                      {character.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterDetailPage;
