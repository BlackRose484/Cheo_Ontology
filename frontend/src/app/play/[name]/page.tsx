"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPlays } from "@/apis/infor";
import { PlayGeneral } from "@/types";
import Link from "next/link";

export default function PlayDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playTitle = decodeURIComponent(params.name as string);

  const [play, setPlay] = useState<PlayGeneral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getPlays();
        console.log("Play list response:", response);

        if (response.data && Array.isArray(response.data)) {
          // Tìm play có title khớp
          const foundPlay = response.data.find(
            (p: PlayGeneral) => p.title === playTitle
          );

          if (foundPlay) {
            setPlay(foundPlay);
          } else {
            setError("Không tìm thấy thông tin vở diễn này");
          }
        } else {
          setError("Lỗi khi tải danh sách vở diễn");
        }
      } catch (error) {
        console.error("Error fetching play detail:", error);
        setError("Lỗi khi tải thông tin vở diễn. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (playTitle) {
      fetchPlayDetail();
    }
  }, [playTitle]);

  const handleBackToSearch = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-ancient-ink">
                Đang tải thông tin vở diễn...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !play) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-4xl">🎪</span>
            {play.title}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>Thông tin cơ bản</span>
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Tên vở:</span>
                  <span className="text-blue-800 font-semibold">
                    {play.title}
                  </span>
                </div>
                {play.author && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">Tác giả:</span>
                    <span className="text-green-800">{play.author}</span>
                  </div>
                )}
                {play.sceneNumber && (
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-700">Số cảnh:</span>
                    <span className="text-purple-800">
                      {play.sceneNumber} cảnh
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {play.summary && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>Tóm tắt</span>
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 leading-relaxed">
                    {play.summary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Characters List */}
            {play.allCharacter && play.allCharacter.length > 0 && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>🎭</span>
                  <span>Nhân vật ({play.allCharacter.length})</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {play.allCharacter.map((character, index) => (
                    <Link
                      key={index}
                      href={`/character/${encodeURIComponent(character)}`}
                      className="block p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600">👤</span>
                        <span className="text-blue-800 font-medium">
                          {character}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Scenes List */}
            {play.allScenes && play.allScenes.length > 0 && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>🎬</span>
                  <span>Cảnh ({play.allScenes.length})</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {play.allScenes.map((scene, index) => (
                    <div
                      key={index}
                      className="p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">🎭</span>
                        <span className="text-green-800 font-medium">
                          {scene}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                <span>🔍</span>
                <span>Khám phá thêm</span>
              </h3>
              <div className="space-y-3">
                <Link
                  href={`/search?play=${encodeURIComponent(playTitle)}`}
                  className="block w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🔍</span>
                    <span>Tìm kiếm trong vở này</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
