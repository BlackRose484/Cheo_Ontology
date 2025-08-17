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

  const [appearances, setAppearances] = useState<Appearances>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await searchAppearance(charName, playTitle, emotion);
        console.log("Video search response:", response);

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
  }, [charName, playTitle, emotion]);

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
              <span className="ml-3 text-ancient-ink">Đang tải video...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              Lỗi tải video
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-2 font-traditional">
            Video biểu diễn - {charName}
          </h1>

          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {playTitle && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Vở: {playTitle}
              </span>
            )}
            {emotion && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Cảm xúc:{" "}
                {DISPLAY_EMOTIONS[emotion as keyof typeof DISPLAY_EMOTIONS] ||
                  emotion}
              </span>
            )}
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {appearances.length} video
            </span>
          </div>
        </div>

        {appearances.length === 0 ? (
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent text-center">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-medium text-ancient-ink mb-2">
              Chưa có video
            </h3>
            <p className="text-gray-600">
              Hiện tại chưa có video nào cho nhân vật này với các tiêu chí đã
              chọn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Player */}
            <div className="lg:col-span-2">
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
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
                  <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Chọn video để xem</p>
                  </div>
                )}

                {/* Current video info */}
                {selectedVideo && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    {(() => {
                      const currentAppearance = appearances.find(
                        (app) => app.vidVersion === selectedVideo
                      );
                      return currentAppearance ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">
                              Thời điểm:
                            </span>
                            <span className="text-blue-600">
                              {convertSecondsToTime(currentAppearance.start)} -{" "}
                              {convertSecondsToTime(currentAppearance.end)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-blue-800">
                              Cảm xúc:
                            </span>
                            <span className="text-blue-600">
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

            {/* Video List */}
            <div className="lg:col-span-1">
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>📋</span>
                  <span>Danh sách video ({appearances.length})</span>
                </h3>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {appearances.map((appearance, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedVideo(appearance.vidVersion)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedVideo === appearance.vidVersion
                          ? "border-primary-500 bg-primary-50"
                          : "border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">
                                Thời gian:
                              </span>
                              <span className="text-gray-600 text-xs">
                                {convertSecondsToTime(appearance.start)} -{" "}
                                {convertSecondsToTime(appearance.end)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-700">
                                Cảm xúc:
                              </span>
                              <span className="text-gray-600 text-xs">
                                {DISPLAY_EMOTIONS[
                                  appearance.emotion as keyof typeof DISPLAY_EMOTIONS
                                ] || appearance.emotion}
                              </span>
                            </div>
                          </div>

                          {selectedVideo === appearance.vidVersion && (
                            <div className="mt-2 flex items-center gap-1 text-primary-600">
                              <span className="text-xs">▶</span>
                              <span className="text-xs font-medium">
                                Đang phát
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
