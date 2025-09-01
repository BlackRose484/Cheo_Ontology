"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSceneInformation } from "@/apis/view";
import { SceneInformation } from "@/types";
import Link from "next/link";

export default function SceneDetailPage() {
  const params = useParams();
  const router = useRouter();
  const sceneName = decodeURIComponent(params.name as string);

  const [scene, setScene] = useState<SceneInformation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSceneDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getSceneInformation(sceneName);

        if (response.data) {
          setScene(response.data[0]);
          console.log(response.data[0]);
        } else {
          setError("Không tìm thấy thông tin cảnh này");
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 rounded-lg shadow-lg p-8 border-2 border-red-300 backdrop-blur-sm">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <span className="ml-3 text-red-800 font-medium">
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-red-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 rounded-lg shadow-lg p-8 border-2 border-red-300 backdrop-blur-sm text-center">
            <div className="text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Không tìm thấy thông tin cảnh
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBackToSearch}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-yellow-200 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 font-medium border-2 border-yellow-400"
            >
              Quay lại tìm kiếm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50">
      {/* Header với văn hóa Việt Nam */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-700 to-red-600 text-white py-20">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-30 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/95 via-red-700/90 to-red-600/95"></div>

        {/* Họa tiết truyền thống */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-4 left-4 text-yellow-400 opacity-30 text-6xl">
            🏮
          </div>
          <div className="absolute top-4 right-4 text-yellow-400 opacity-30 text-6xl">
            🏮
          </div>
          <div className="absolute bottom-4 left-1/4 text-yellow-400 opacity-20 text-4xl">
            🌸
          </div>
          <div className="absolute bottom-4 right-1/4 text-yellow-400 opacity-20 text-4xl">
            🌸
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-yellow-300 text-8xl mb-6">🎬</div>
          <h1 className="text-5xl md:text-7xl font-traditional font-bold mb-6 drop-shadow-2xl tracking-wider">
            {scene.scene || scene.name}
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-2xl md:text-3xl text-yellow-200 font-traditional opacity-90">
            Cảnh Chèo truyền thống Việt Nam
          </p>
          {scene.inPlay && (
            <p className="text-xl text-yellow-300 mt-4 font-traditional">
              🎪 Thuộc vở: {scene.inPlay}
            </p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b-2 border-red-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors font-medium bg-white/80 px-4 py-2 rounded-lg border-2 border-red-300 hover:border-red-500"
            >
              <span>←</span>
              <span>Quay lại tìm kiếm</span>
            </button>
            <div className="hidden md:flex items-center gap-4 text-red-700">
              <span className="text-2xl">🎭</span>
              <span className="font-traditional text-lg">Cảnh Chèo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content với thiết kế văn hóa Việt */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Thông tin chính */}
          <div className="lg:col-span-2 space-y-8">
            {/* Thông tin cơ bản với thiết kế văn hóa */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                <h2 className="text-2xl font-traditional font-bold flex items-center">
                  <span className="text-yellow-300 mr-3 text-3xl">📋</span>
                  Thông tin cảnh
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                    Tên cảnh
                  </label>
                  <p className="text-2xl font-traditional font-bold text-gray-800">
                    {scene.scene || scene.name}
                  </p>
                </div>

                {scene.inPlay && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Vở chèo
                    </label>
                    <Link
                      href={`/play/${encodeURIComponent(scene.inPlay)}`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-yellow-100 text-red-800 rounded-full text-lg font-traditional font-bold border border-red-200 hover:border-yellow-400 transition-colors"
                    >
                      <span className="mr-2">🎪</span>
                      {scene.inPlay}
                    </Link>
                  </div>
                )}

                {scene.startTime && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Thời gian bắt đầu
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-red-100 text-blue-800 rounded-full text-lg font-traditional font-bold border border-blue-200">
                      <span className="mr-2">⏰</span>
                      {scene.startTime}
                    </span>
                  </div>
                )}

                {scene.endTime && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Thời gian kết thúc
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-red-100 text-purple-800 rounded-full text-lg font-traditional font-bold border border-purple-200">
                      <span className="mr-2">⏱️</span>
                      {scene.endTime}
                    </span>
                  </div>
                )}

                {scene.version && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Phiên bản
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 rounded-full text-lg font-traditional font-bold border border-green-200">
                      <span className="mr-2">📝</span>
                      {scene.version}
                    </span>
                  </div>
                )}

                {scene.summary && (
                  <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-6 border border-red-100">
                    <label className="text-lg font-traditional font-bold text-red-700 mb-3 flex items-center">
                      <span className="text-yellow-600 mr-2">📖</span>
                      Tóm tắt nội dung
                    </label>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line font-traditional text-lg">
                        {scene.summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video diễn xuất */}
            {scene.allVideos && scene.allVideos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎥</span>
                    Video diễn xuất ({scene.allVideos.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scene.allVideos.map((video, index) => (
                      <Link
                        key={index}
                        href={`/video/${encodeURIComponent(video)}`}
                        className="block p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border-2 border-red-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-traditional font-semibold text-gray-800 group-hover:text-red-700 flex items-center">
                            <span className="text-red-600 mr-2">🎬</span>
                            Phiên bản {index + 1}
                          </span>
                          <span className="text-yellow-600 group-hover:translate-x-1 transition-transform text-lg">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Nhân vật xuất hiện */}
            {scene.allCharacters && scene.allCharacters.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎭</span>
                    Nhân vật xuất hiện ({scene.allCharacters.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scene.allCharacters.map((character, index) => (
                      <Link
                        key={index}
                        href={`/character/${encodeURIComponent(character)}`}
                        className="block p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border-2 border-red-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-traditional font-semibold text-gray-800 group-hover:text-red-700 flex items-center">
                            <span className="text-red-600 mr-2">👤</span>
                            {character}
                          </span>
                          <span className="text-yellow-600 group-hover:translate-x-1 transition-transform text-lg">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Diễn viên tham gia */}
            {scene.allActors && scene.allActors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎪</span>
                    Diễn viên tham gia ({scene.allActors.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {scene.allActors.map((actor, index) => (
                      <Link
                        key={index}
                        href={`/actor/${encodeURIComponent(actor)}`}
                        className="block p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border-2 border-red-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-traditional font-semibold text-gray-800 group-hover:text-red-700 flex items-center">
                            <span className="text-red-600 mr-2">🎭</span>
                            {actor}
                          </span>
                          <span className="text-yellow-600 group-hover:translate-x-1 transition-transform text-lg">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar với thiết kế văn hóa Việt */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-yellow-300 mr-2">⚡</span>
                  Thao tác nhanh
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {scene.inPlay && (
                  <Link
                    href={`/play/${encodeURIComponent(scene.inPlay)}`}
                    className="block w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 px-4 rounded-lg transition-all duration-300 text-center font-traditional font-bold border-2 border-yellow-400 hover:border-yellow-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-xl mr-2">🎪</span>
                      <span>Xem vở diễn</span>
                    </div>
                  </Link>
                )}

                <Link
                  href={`/search?scene=${encodeURIComponent(sceneName)}`}
                  className="block w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white py-3 px-4 rounded-lg transition-all duration-300 text-center font-traditional font-bold border-2 border-red-300 hover:border-red-400 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-xl mr-2">🔍</span>
                    <span>Tìm kiếm trong cảnh</span>
                  </div>
                </Link>

                <Link
                  href="/library"
                  className="block w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 px-4 rounded-lg transition-all duration-300 text-center font-traditional font-bold border-2 border-yellow-300 hover:border-yellow-400 shadow-lg hover:shadow-xl"
                >
                  <div className="flex items-center justify-center">
                    <span className="text-xl mr-2">📚</span>
                    <span>Thư viện video</span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Thống kê nhanh */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-yellow-300 mr-2">📊</span>
                  Thống kê
                </h3>
              </div>

              <div className="p-6 space-y-4">
                {scene.allCharacters && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                    <span className="flex items-center font-traditional font-semibold text-red-700">
                      <span className="mr-2">🎭</span>
                      Nhân vật
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {scene.allCharacters.length}
                    </span>
                  </div>
                )}

                {scene.allActors && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                    <span className="flex items-center font-traditional font-semibold text-red-700">
                      <span className="mr-2">🎪</span>
                      Diễn viên
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {scene.allActors.length}
                    </span>
                  </div>
                )}

                {scene.allVideos && (
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border border-red-200">
                    <span className="flex items-center font-traditional font-semibold text-red-700">
                      <span className="mr-2">🎥</span>
                      Video
                    </span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {scene.allVideos.length}
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
}
