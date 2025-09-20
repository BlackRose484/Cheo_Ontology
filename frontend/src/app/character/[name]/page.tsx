"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getCharacterInformation } from "@/apis/view";
import { CharacterInformation } from "@/types";

export default function CharacterDetailPage() {
  const params = useParams();
  const characterName = decodeURIComponent(params.name as string);

  const [character, setCharacter] = useState<CharacterInformation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getCharacterInformation(characterName);

        // API view trả về AxiosResponse với data là CharacterInformation
        if (response && response.data) {
          setCharacter(response.data[0]);
        } else {
          setError("Không tìm thấy thông tin nhân vật");
        }
      } catch (err) {
        setError("Không thể tải thông tin nhân vật");
        console.error("Error fetching character info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (characterName) {
      fetchCharacterInfo();
    }
  }, [characterName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-900 to-red-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-20 bg-cover bg-center"></div>
        <div className="relative text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-traditional font-bold mb-2">
            Đang tải thông tin nhân vật...
          </h2>
          <p className="text-amber-200 font-traditional">
            Xin vui lòng chờ trong giây lát
          </p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-900 to-red-800 flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-20 bg-cover bg-center"></div>
        <div className="relative text-center text-white max-w-md mx-auto px-6">
          <div className="text-amber-300 text-8xl mb-6">😔</div>
          <h1 className="text-3xl font-traditional font-bold mb-4">
            Không tìm thấy thông tin
          </h1>
          <p className="text-amber-200 mb-8 font-traditional">
            {error || "Nhân vật này không tồn tại hoặc đã bị xóa"}
          </p>
          <Link
            href="/characters"
            className="inline-block bg-amber-500 text-red-900 px-8 py-3 rounded-lg font-bold font-traditional hover:bg-amber-400 transition-all duration-300 shadow-lg"
          >
            Quay lại danh sách nhân vật
          </Link>
        </div>
      </div>
    );
  }

  const getGenderIcon = (gender: string) => {
    return gender.toLowerCase() === "nam" ? "👨" : "👩";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-amber-50">
      {/* Header với văn hóa Việt Nam */}
      <div className="relative bg-gradient-to-r from-red-800 via-red-900 to-red-800 text-white py-8">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-30 bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-800/95 via-red-900/90 to-red-800/95"></div>

        {/* Họa tiết truyền thống */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-2 left-2 text-amber-400 opacity-20 text-3xl">
            🏮
          </div>
          <div className="absolute top-2 right-2 text-amber-400 opacity-20 text-3xl">
            🏮
          </div>
          <div className="absolute bottom-2 left-1/4 text-amber-400 opacity-15 text-2xl">
            🌸
          </div>
          <div className="absolute bottom-2 right-1/4 text-amber-400 opacity-15 text-2xl">
            🌸
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-amber-300 text-5xl mb-3">
            {getGenderIcon(character.gender)}
          </div>
          <h1 className="text-3xl md:text-5xl font-traditional font-bold mb-3 drop-shadow-2xl tracking-wider">
            {character.name || character.charName}
          </h1>
          <div className="w-16 h-1 bg-amber-400 mx-auto mb-3"></div>
          <p className="text-lg md:text-xl text-amber-200 font-traditional opacity-90">
            Nhân vật Chèo truyền thống Việt Nam
          </p>
          {character.description && (
            <p className="text-base text-amber-300 mt-2 font-traditional">
              📖 {character.description}
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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-800">
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-6">
                <h2 className="text-2xl font-traditional font-bold flex items-center">
                  <span className="text-amber-300 mr-3 text-3xl">�</span>
                  Thông tin nhân vật
                </h2>
              </div>

              <div className="p-8 space-y-6">
                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-red-800 mb-2 font-traditional">
                    Tên nhân vật
                  </label>
                  <p className="text-2xl font-traditional font-bold text-gray-800">
                    {character.name || character.charName}
                  </p>
                </div>

                <div className="border-b border-gray-100 pb-4">
                  <label className="block text-sm font-medium text-red-800 mb-2 font-traditional">
                    Giới tính
                  </label>
                  <div className="flex items-center">
                    <span className="text-3xl mr-3">
                      {getGenderIcon(character.gender)}
                    </span>
                    <span className="text-lg font-traditional font-semibold text-gray-800">
                      {character.gender}
                    </span>
                  </div>
                </div>

                {character.mainType && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-800 mb-2 font-traditional">
                      Loại vai chính
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-amber-100 text-red-900 rounded-full text-lg font-traditional font-bold border border-red-200">
                      <span className="mr-2">🎭</span>
                      {character.mainType}
                    </span>
                  </div>
                )}

                {character.subType && (
                  <div className="border-b border-gray-100 pb-4">
                    <label className="block text-sm font-medium text-red-800 mb-2 font-traditional">
                      Loại vai phụ
                    </label>
                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-100 to-amber-100 text-red-900 rounded-full text-lg font-traditional font-bold border border-red-200">
                      <span className="mr-2">🎪</span>
                      {character.subType}
                    </span>
                  </div>
                )}

                {character.description && (
                  <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-lg p-6 border border-red-100">
                    <label className="text-lg font-traditional font-bold text-red-900 mb-3 flex items-center">
                      <span className="text-amber-600 mr-2">📖</span>
                      Mô tả nhân vật
                    </label>
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line font-traditional text-lg">
                        {character.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Vở chèo */}
            {character.plays && character.plays.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-800">
                <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-amber-300 mr-3 text-3xl">🎭</span>
                    Vở chèo ({character.plays.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {character.plays.map((play, index) => (
                      <Link
                        key={index}
                        href={`/play/${encodeURIComponent(play)}`}
                        className="block p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg border-2 border-red-300 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-traditional font-semibold text-gray-800 group-hover:text-red-800 flex items-center">
                            <span className="text-red-800 mr-2">🎪</span>
                            {play}
                          </span>
                          <span className="text-amber-600 group-hover:translate-x-1 transition-transform text-lg">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Diễn viên */}
            {character.actors && character.actors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-800">
                <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-6">
                  <h2 className="text-xl font-traditional font-bold flex items-center">
                    <span className="text-amber-300 mr-3 text-xl">🎬</span>
                    Diễn viên thể hiện ({character.actors.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {character.actors.map((actor, index) => (
                      <Link
                        key={index}
                        href={`/actor/${encodeURIComponent(actor)}`}
                        className="block p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg border-2 border-red-300 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-traditional font-semibold text-gray-800 group-hover:text-red-800 flex items-center">
                            <span className="text-red-800 mr-2">🎭</span>
                            {actor}
                          </span>
                          <span className="text-amber-600 group-hover:translate-x-1 transition-transform text-lg">
                            →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Trích đoạn diễn */}
            {character.scenes && character.scenes.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-red-800">
                <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-8 py-6">
                  <h2 className="text-2xl font-traditional font-bold flex items-center">
                    <span className="text-amber-300 mr-3 text-3xl">🎬</span>
                    Danh sách trích đoạn ({character.scenes.length})
                  </h2>
                </div>

                <div className="p-8">
                  <div className="space-y-4">
                    {character.scenes.map((scene, index) => (
                      <Link
                        href={`/scene/${encodeURIComponent(
                          scene?.scene || ""
                        )}`}
                        key={index}
                        className="block w-full p-4 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg border-2 border-red-300 hover:border-amber-400 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 min-w-0">
                            <div className="font-traditional font-bold text-red-900 mb-1 text-lg flex items-center">
                              <span className="text-amber-600 mr-2">🎪</span>
                              <span className="truncate">
                                Trích đoạn {index + 1}: {String(scene?.name)}
                              </span>
                            </div>
                          </div>
                          <span className="bg-red-800 text-white px-3 py-1 rounded-full text-sm font-traditional font-bold ml-4 flex-shrink-0">
                            #{index + 1}
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
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-amber-300 mr-2">⚡</span>
                  Thao tác nhanh
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/characters"
                  className="block w-full bg-gradient-to-r from-amber-500 to-amber-600 text-red-900 py-3 px-4 rounded-lg text-center font-traditional font-bold hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg"
                >
                  📋 Danh sách nhân vật
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
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-amber-300 mr-2">📊</span>
                  Thống kê
                </h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-amber-100 rounded-lg border border-red-300">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-800 mr-2">🎭</span>
                    Số vở chèo
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-900">
                    {character.plays?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-amber-100 rounded-lg border border-red-300">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-800 mr-2">🎬</span>
                    Số diễn viên
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-900">
                    {character.actors?.length || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-red-100 to-amber-100 rounded-lg border border-red-300">
                  <span className="text-gray-700 font-traditional font-bold flex items-center">
                    <span className="text-red-800 mr-2">🎪</span>
                    Số trích đoạn diễn
                  </span>
                  <span className="font-traditional font-black text-2xl text-red-900">
                    {character.scenes?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Thông tin nhân vật với văn hóa Việt */}
            <div className="bg-gradient-to-br from-red-100 via-white to-amber-100 rounded-xl p-6 border-2 border-red-300 shadow-lg">
              <h3 className="text-lg font-traditional font-bold text-red-900 mb-4 flex items-center">
                <span className="text-amber-600 mr-2">🎭</span>
                Về nhân vật
              </h3>
              <div className="text-sm text-gray-700 space-y-3 font-traditional">
                <div className="flex items-start">
                  <span className="text-red-800 mr-2 mt-0.5">🏮</span>
                  <span>Nhân vật trong nghệ thuật Chèo</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-800 mr-2 mt-0.5">🌸</span>
                  <span>Thể hiện tính cách đặc trưng</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-800 mr-2 mt-0.5">🎪</span>
                  <span>Mang ý nghĩa văn hóa sâu sắc</span>
                </div>
                <div className="flex items-start">
                  <span className="text-red-800 mr-2 mt-0.5">💖</span>
                  <span>Truyền tải thông điệp nhân văn</span>
                </div>
                {character.gender && (
                  <div className="flex items-start">
                    <span className="text-red-800 mr-2 mt-0.5">
                      {getGenderIcon(character.gender)}
                    </span>
                    <span>Giới tính: {character.gender}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation với thiết kế văn hóa */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-red-800 to-red-900 text-white px-6 py-4">
                <h3 className="text-lg font-traditional font-bold flex items-center">
                  <span className="text-amber-300 mr-2">🧭</span>
                  Khám phá thêm
                </h3>
              </div>
              <div className="p-6 space-y-3 font-traditional">
                <Link
                  href="/library"
                  className="flex items-center text-red-800 hover:text-red-900 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                >
                  <span className="mr-3">📺</span>
                  Thư viện video Chèo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
