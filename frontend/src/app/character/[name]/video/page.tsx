"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { searchAppearance } from "@/apis/search";
import { Appearances } from "@/types";
import VideoPlayer from "@/components/common/VideoPlayer";
import { DISPLAY_EMOTIONS } from "@/constants/base";
import { convertSecondsToTime } from "@/utils/util";

export default function CharacterVideoPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const charName = decodeURIComponent(params.name as string);
  const playTitle = searchParams.get("play") || "";
  const emotion = searchParams.get("emotion") || "";
  const uri = searchParams.get("uri") || "";

  const [appearances, setAppearances] = useState<Appearances>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await searchAppearance(
          charName,
          playTitle,
          emotion,
          uri
        );

        if (response.data && Array.isArray(response.data)) {
          setAppearances(response.data);
          // Auto-select first video if available
          if (response.data.length > 0 && response.data[0].vidVersion) {
            setSelectedVideo(response.data[0].vidVersion);
          }
        } else {
          setError("Không tìm thấy video cho nhân vật này");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Lỗi khi tải video. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (charName) {
      fetchVideos();
    }
  }, [charName, playTitle, emotion, uri]);

  console.log(appearances);

  const handleBackToSearch = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-8 relative">
        <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-3 bg-cover bg-center"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white/90 rounded-xl shadow-lg p-8 border border-red-100 backdrop-blur-sm">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
              <span className="ml-3 text-red-700 font-medium">
                Đang tải video...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-8 relative">
        <div className="absolute inset-0 bg-[url('/cheo-2.jpg')] opacity-3 bg-cover bg-center"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white/95 rounded-xl shadow-lg p-8 border border-red-200 text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-red-800 mb-2">
              Lỗi tải video
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleBackToSearch}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md"
            >
              Quay lại tìm kiếm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 py-8 relative">
      <div className="absolute inset-0 bg-[url('/trong-dong.jpg')] opacity-3 bg-cover bg-center"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={handleBackToSearch}
              className="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 px-3 py-2 rounded-lg transition-all duration-200 border border-red-600"
            >
              <span>←</span>
              <span>Quay lại tìm kiếm</span>
            </button>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-200">
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-4 font-traditional">
              🎭 Video biểu diễn - {charName}
            </h1>

            <div className="flex flex-wrap gap-2 text-sm">
              {playTitle && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full border border-red-200">
                  🎪 Vở: {playTitle}
                </span>
              )}
              {emotion && (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full border border-yellow-200">
                  😊 Cảm xúc:{" "}
                  {DISPLAY_EMOTIONS[emotion as keyof typeof DISPLAY_EMOTIONS] ||
                    emotion}
                </span>
              )}
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full border border-blue-200">
                📹 {appearances.length} video
              </span>
            </div>
          </div>
        </div>

        {appearances.length === 0 ? (
          <div className="bg-white/95 rounded-xl shadow-lg p-8 border border-red-200 text-center backdrop-blur-sm">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-medium text-red-800 mb-2">
              Chưa có video
            </h3>
            <p className="text-red-600">
              Hiện tại chưa có video nào cho nhân vật này với các tiêu chí đã
              chọn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 rounded-xl shadow-lg p-6 border border-red-200 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <span>🎬</span>
                  <span>Video hiện tại</span>
                </h2>

                {selectedVideo ? (
                  (() => {
                    const currentAppearance = appearances.find(
                      (app) => app.vidVersion === selectedVideo
                    );
                    return (
                      <VideoPlayer
                        videoUrl={selectedVideo}
                        title={`Video ${charName}`}
                        startTime={currentAppearance?.start}
                      />
                    );
                  })()
                ) : (
                  <div className="w-full h-64 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
                    <p className="text-red-500">Chọn video để xem</p>
                  </div>
                )}

                {/* Current video info */}
                {selectedVideo && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    {(() => {
                      const currentAppearance = appearances.find(
                        (app) => app.vidVersion === selectedVideo
                      );
                      return currentAppearance ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-red-800">
                              Thời điểm:
                            </span>
                            <span className="text-red-600">
                              {convertSecondsToTime(currentAppearance.start)} -{" "}
                              {convertSecondsToTime(currentAppearance.end)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-red-800">
                              Cảm xúc:
                            </span>
                            <span className="text-red-600">
                              {DISPLAY_EMOTIONS[
                                currentAppearance.emotion as keyof typeof DISPLAY_EMOTIONS
                              ] || currentAppearance.emotion}
                            </span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            </div>

            {/* Emotional Development & Subtitle */}
            <div className="lg:col-span-1 space-y-6">
              {/* Diễn biến tâm lý */}
              <div className="bg-white/95 rounded-xl shadow-lg p-6 border border-red-200 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                  <span>🧠</span>
                  <span>Diễn biến tâm lý</span>
                </h3>

                {selectedVideo ? (
                  (() => {
                    const currentAppearance = appearances.find(
                      (app) => app.vidVersion === selectedVideo
                    );
                    return currentAppearance?.ED ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {currentAppearance.ED}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">🤔</div>
                        <p className="text-sm">
                          Chưa có thông tin diễn biến tâm lý
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🎭</div>
                    <p className="text-sm">
                      Chọn video để xem diễn biến tâm lý
                    </p>
                  </div>
                )}
              </div>

              {/* Lời thoại */}
              <div className="bg-white/95 rounded-xl shadow-lg p-6 border border-red-200 backdrop-blur-sm">
                <h3 className="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
                  <span>💬</span>
                  <span>Lời thoại</span>
                </h3>

                {selectedVideo ? (
                  (() => {
                    const currentAppearance = appearances.find(
                      (app) => app.vidVersion === selectedVideo
                    );
                    return currentAppearance?.subtitle ? (
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed italic whitespace-pre-wrap bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          &ldquo;{currentAppearance.subtitle}&rdquo;
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">📝</div>
                        <p className="text-sm">Chưa có lời thoại</p>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <div className="text-4xl mb-2">🎤</div>
                    <p className="text-sm">Chọn video để xem lời thoại</p>
                  </div>
                )}
              </div>

              {/* Video selector dropdown */}
              {appearances.length > 1 && (
                <div className="bg-white/95 rounded-xl shadow-lg p-4 border border-red-200 backdrop-blur-sm">
                  <label className="block text-sm font-medium text-red-700 mb-2">
                    Chọn video khác ({appearances.length} video)
                  </label>
                  <select
                    value={selectedVideo || ""}
                    onChange={(e) => setSelectedVideo(e.target.value)}
                    className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-700"
                  >
                    {appearances.map((appearance, index) => (
                      <option key={index} value={appearance.vidVersion}>
                        Video {index + 1} -{" "}
                        {convertSecondsToTime(appearance.start)} đến{" "}
                        {convertSecondsToTime(appearance.end)} (
                        {DISPLAY_EMOTIONS[
                          appearance.emotion as keyof typeof DISPLAY_EMOTIONS
                        ] || appearance.emotion}
                        )
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
