"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSceneNames } from "@/apis/infor";
import { SceneGeneral } from "@/types";
import Link from "next/link";

export default function SceneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sceneName = decodeURIComponent(params.name as string);

  const [scene, setScene] = useState<SceneGeneral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSceneDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getSceneNames();

        if (response.data && Array.isArray(response.data)) {
          // Tìm scene có name khớp
          const foundScene = response.data.find(
            (s: SceneGeneral) => (s.scene || s.name) === sceneName
          );

          if (foundScene) {
            setScene(foundScene);
          } else {
            setError("Không tìm thấy thông tin cảnh này");
          }
        } else {
          setError("Lỗi khi tải danh sách cảnh");
        }
      } catch (error) {
        console.error("Error fetching scene detail:", error);
        setError("Lỗi khi tải thông tin cảnh. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (sceneName) {
      fetchSceneDetail();
    }
  }, [sceneName]);

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
                Đang tải thông tin cảnh...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !scene) {
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
            <span className="text-4xl">🎬</span>
            {scene.scene || scene.name}
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
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-700">Tên cảnh:</span>
                  <span className="text-orange-800 font-semibold">
                    {scene.scene || scene.name}
                  </span>
                </div>
                {scene.startTime && (
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Thời gian bắt đầu:
                    </span>
                    <span className="text-blue-800">{scene.startTime}</span>
                  </div>
                )}
                {scene.endTime && (
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Thời gian kết thúc:
                    </span>
                    <span className="text-purple-800">{scene.endTime}</span>
                  </div>
                )}
                {scene.version && (
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-gray-700">
                      Phiên bản:
                    </span>
                    <span className="text-green-800">{scene.version}</span>
                  </div>
                )}
                {scene.inPlay && (
                  <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                    <span className="font-medium text-gray-700">Vở chèo:</span>
                    <Link
                      href={`/play/${encodeURIComponent(scene.inPlay)}`}
                      className="text-pink-800 hover:text-pink-900 hover:underline font-medium"
                    >
                      {scene.inPlay}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            {scene.summary && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>📖</span>
                  <span>Tóm tắt</span>
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <p className="text-gray-700 leading-relaxed">
                    {scene.summary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Side Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Characters List */}
            {scene.allCharacters && scene.allCharacters.length > 0 && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>🎭</span>
                  <span>Nhân vật xuất hiện ({scene.allCharacters.length})</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {scene.allCharacters.map((character, index) => (
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

            {/* Action Buttons */}
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                <span>🔍</span>
                <span>Khám phá thêm</span>
              </h3>
              <div className="space-y-3">
                {scene.inPlay && (
                  <Link
                    href={`/play/${encodeURIComponent(scene.inPlay)}`}
                    className="block w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>🎪</span>
                      <span>Xem thông tin vở diễn</span>
                    </div>
                  </Link>
                )}
                <Link
                  href={`/search?scene=${encodeURIComponent(sceneName)}`}
                  className="block w-full p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🔍</span>
                    <span>Tìm kiếm trong cảnh này</span>
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
