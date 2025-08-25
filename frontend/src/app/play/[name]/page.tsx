"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPlayInformation } from "@/apis/view";
import { PlayInformation } from "@/types";

export default function PlayDetailPage() {
  const params = useParams();
  const playTitle = decodeURIComponent(params.name as string);

  const [play, setPlay] = useState<PlayInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching play info for:", playTitle);

        const response = await getPlayInformation(playTitle);
        console.log("Play API response:", response);

        // API view trả về AxiosResponse với data là PlayInformation
        if (response && response.data) {
          setPlay(response.data[0]);
        } else {
          setError("Không tìm thấy thông tin vở diễn");
        }
      } catch (err) {
        setError("Không thể tải thông tin vở diễn");
        console.error("Error fetching play info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (playTitle) {
      fetchPlayInfo();
    }
  }, [playTitle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-20 bg-cover bg-center"></div>
        <div className="relative text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-traditional font-bold mb-2">
            Đang tải thông tin vở diễn...
          </h2>
          <p className="text-yellow-200 font-traditional">
            Xin vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error || !play) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-20 bg-cover bg-center"></div>
        <div className="relative text-center text-white max-w-md mx-auto px-6">
          <div className="text-yellow-300 text-8xl mb-6">🎪</div>
          <h1 className="text-3xl font-traditional font-bold mb-4">
            Không tìm thấy thông tin
          </h1>
          <p className="text-yellow-200 mb-8 font-traditional">
            {error || "Vở diễn này không tồn tại hoặc đã bị xóa"}
          </p>
          <Link
            href="/search"
            className="inline-block bg-yellow-500 text-red-800 px-8 py-3 rounded-lg font-bold font-traditional hover:bg-yellow-400 transition-all duration-300 shadow-lg"
          >
            Quay lại tìm kiếm
          </Link>
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
          <div className="text-yellow-300 text-8xl mb-6">🎪</div>
          <h1 className="text-5xl md:text-7xl font-traditional font-bold mb-6 drop-shadow-2xl tracking-wider">
            {play.title}
          </h1>
          <div className="w-24 h-1 bg-yellow-400 mx-auto mb-6"></div>
          <p className="text-2xl md:text-3xl text-yellow-200 font-traditional opacity-90">
            Vở Chèo truyền thống Việt Nam
          </p>
          {play.author && (
            <p className="text-xl text-yellow-300 mt-4 font-traditional">
              🖋️ Tác giả: {play.author}
            </p>
          )}
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
                  <span className="text-yellow-300 mr-3 text-3xl">📚</span>
                  Thông tin vở diễn
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                    Tên vở diễn
                  </label>
                  <p className="text-2xl font-traditional font-bold text-gray-800">
                    {play.title}
                  </p>
                </div>

                {play.author && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Tác giả
                    </label>
                    <p className="text-lg font-traditional text-gray-800 flex items-center">
                      <span className="text-yellow-600 mr-2">🖋️</span>
                      {play.author}
                    </p>
                  </div>
                )}

                {play.sceneNumber && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-600 mb-2 font-traditional">
                      Số cảnh
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-yellow-100 text-red-800 rounded-full text-lg font-traditional font-bold border border-red-200">
                      <span className="mr-2">🎬</span>
                      {play.sceneNumber} cảnh
                    </span>
                  </div>
                )}

                {play.summary && (
                  <div className="bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg p-6 border border-red-100">
                    <label className="block text-lg font-traditional font-bold text-red-700 mb-3 items-center">
                      <span className="text-yellow-600 mr-2">📖</span>
                      Tóm tắt nội dung
                    </label>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line font-traditional text-lg">
                        {play.summary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Nhân vật trong vở */}
            {play.characters && play.characters.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎭</span>
                    Nhân vật trong vở ({play.characters.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {play.characters.map((character: string, index: number) => (
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
            {play.actors && play.actors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎬</span>
                    Diễn viên tham gia ({play.actors.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {play.actors.map((actor: string, index: number) => (
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

            {/* Cảnh diễn */}
            {play.scenes && play.scenes.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-600">
                <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-yellow-300 mr-3 text-3xl">🎬</span>
                    Danh sách cảnh ({play.scenes.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="space-y-4">
                    {play.scenes.map((scene: string, index: number) => (
                      <div
                        key={index}
                        className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 rounded-lg border-2 border-red-200 hover:border-yellow-400 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="font-traditional font-bold text-red-800 mb-1 text-lg flex items-center">
                              <span className="text-yellow-600 mr-2">🎪</span>
                              Cảnh {index + 1}: {scene}
                            </div>
                          </div>
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-traditional font-bold">
                            #{index + 1}
                          </span>
                        </div>
                      </div>
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
              <div className="p-6 space-y-3">
                <Link
                  href={`/search?play=${encodeURIComponent(playTitle)}`}
                  className="block w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg text-center font-traditional font-bold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg"
                >
                  🔍 Tìm kiếm trong vở này
                </Link>

                <Link
                  href="/library"
                  className="block w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-red-800 py-3 px-4 rounded-lg text-center font-traditional font-bold hover:from-yellow-600 hover:to-yellow-700 transition-all duration-300 shadow-lg"
                >
                  🎥 Xem video biểu diễn
                </Link>

                <Link
                  href="/search"
                  className="block w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-4 rounded-lg text-center font-traditional font-bold hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg"
                >
                  ↩️ Quay lại tìm kiếm
                </Link>
              </div>
            </div>

            {/* Thống kê với thiết kế văn hóa */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-yellow-300 mr-2">📊</span>
                  Thống kê
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg border border-red-200">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-600 mr-2">👥</span>
                    Số nhân vật
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-800">
                    {play.characters?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg border border-red-200">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-600 mr-2">🎭</span>
                    Số diễn viên
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-800">
                    {play.actors?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-yellow-100 rounded-lg border border-red-200">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-600 mr-2">🎬</span>
                    Số cảnh
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-800">
                    {play.scenes?.length || play.sceneNumber || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin tác phẩm với văn hóa Việt */}
            <div className="bg-gradient-to-br from-red-100 via-white to-yellow-100 rounded-xl p-6 border-2 border-red-200 shadow-lg">
              <h3 className="text-lg font-traditional font-bold text-red-800 mb-4 flex items-center">
                <span className="text-yellow-600 mr-2">🎪</span>
                Về tác phẩm
              </h3>
              <div className="text-sm text-gray-700 space-y-3 font-traditional">
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-0.5">🏮</span>
                  <span>Vở Chèo truyền thống Việt Nam</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-0.5">🌸</span>
                  <span>Mang đậm bản sắc văn hóa dân tộc</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-0.5">📖</span>
                  <span>Kể lại câu chuyện đời thường</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-600 mr-2 mt-0.5">💖</span>
                  <span>Truyền tải giá trị nhân văn</span>
                </div>
                {play.author && (
                  <div className="flex items-start">
                    <span className="text-red-600 mr-2 mt-0.5">🖋️</span>
                    <span>Được sáng tác bởi {play.author}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation với thiết kế văn hóa */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-yellow-300 mr-2">🧭</span>
                  Khám phá thêm
                </h3>
              </div>
              <div className="p-6 space-y-3 font-traditional">
                <Link
                  href="/library"
                  className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <span className="mr-3">📺</span>
                  Thư viện video Chèo
                </Link>
                <Link
                  href="/characters"
                  className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <span className="mr-3">👥</span>
                  Danh sách nhân vật
                </Link>
                <Link
                  href="/search"
                  className="flex items-center text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <span className="mr-3">🔍</span>
                  Tìm kiếm nâng cao
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
