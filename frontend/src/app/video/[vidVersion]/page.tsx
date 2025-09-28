"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { LibraryItem } from "@/types/index";
import { useLibrary } from "@/hooks/useLibraryQueries";

export default function VideoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vidVersion = decodeURIComponent(params.vidVersion as string);

  // Use cached library data
  const { data: libraryData, isLoading, error } = useLibrary();

  // Find video and related videos from cached data
  const { video, relatedVideos } = useMemo(() => {
    if (!libraryData) return { video: null, relatedVideos: [] };

    const foundVideo = libraryData.find(
      (item: LibraryItem) => item.vidVersion === vidVersion
    );

    if (!foundVideo) return { video: null, relatedVideos: [] };

    const related = libraryData
      .filter(
        (item: LibraryItem) =>
          item.vidVersion !== vidVersion &&
          (item.playTitle === foundVideo.playTitle ||
            item.characters?.some((char) =>
              foundVideo.characters?.includes(char)
            ))
      )
      .slice(0, 5);

    return { video: foundVideo, relatedVideos: related };
  }, [libraryData, vidVersion]);

  const handleBack = () => {
    router.push("/library");
  };

  const extractFileId = (driveUrl: string) => {
    // Extract file ID from various Google Drive URL formats
    const match = driveUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : driveUrl;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-red-100 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-1.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-center bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-red-200">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-800 border-t-transparent mx-auto mb-4"></div>
              <span className="text-red-800 font-medium">
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-red-100 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 text-center border border-red-300">
              <div className="text-6xl mb-4">❌</div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Lỗi tải video
              </h3>
              <p className="text-red-800 mb-6">
                {error?.message || "Lỗi khi tải video"}
              </p>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gradient-to-r from-red-800 to-red-900 text-white rounded-lg hover:from-red-900 hover:to-red-800 transition-all duration-200 font-medium shadow-md"
              >
                Quay lại thư viện
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!video) {
    return null;
  }

  const fileId = extractFileId(video.vidVersion || "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-red-100 py-6 relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/cheo-1.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-red-800 hover:text-red-900 transition-colors font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-red-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Quay lại thư viện</span>
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main video section */}
          <div className="xl:col-span-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-amber-200">
              {/* Video player */}
              <div className="aspect-video w-full bg-black relative">
                <iframe
                  src={`https://drive.google.com/file/d/${fileId}/preview`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.sceneName || video.playTitle || "Video"}
                />
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-400 to-red-800 opacity-20 rounded-bl-full"></div>
              </div>

              {/* Video info */}
              <div className="p-6 bg-gradient-to-r from-red-50 to-amber-50">
                <h1 className="text-2xl md:text-3xl font-bold text-red-900 mb-4 leading-tight">
                  {video.sceneName || video.playTitle || "Video Chèo"}
                </h1>

                {/* Video metadata grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {video.playTitle && (
                    <div className="flex items-center gap-3 p-3 bg-red-100/70 rounded-lg border border-red-300">
                      <div className="w-8 h-8 bg-red-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🎭</span>
                      </div>
                      <div>
                        <span className="font-semibold text-red-800 text-sm">
                          Vở chèo
                        </span>
                        <p className="text-red-700">{video.playTitle}</p>
                      </div>
                    </div>
                  )}

                  {video.duration && (
                    <div className="flex items-center gap-3 p-3 bg-amber-100/70 rounded-lg border border-amber-300">
                      <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">⏱️</span>
                      </div>
                      <div>
                        <span className="font-semibold text-amber-800 text-sm">
                          Thời lượng
                        </span>
                        <p className="text-amber-700">{video.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actors section */}
                {video.actors && video.actors.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <span className="text-red-800">👥</span>
                      Diễn viên ({video.actors.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {video.actors.map((actor, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-red-100 to-red-200 text-red-900 rounded-full text-sm font-medium hover:from-red-200 hover:to-red-300 transition-all duration-200 border border-red-400"
                        >
                          {actor}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Characters section */}
                {video.characters && video.characters.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <span className="text-amber-700">🎪</span>
                      Nhân vật ({video.characters.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {video.characters.map((character, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 rounded-full text-sm font-medium hover:from-amber-200 hover:to-amber-300 transition-all duration-200 border border-amber-400"
                        >
                          {character}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description section */}
                {video.sceneSummary && (
                  <div className="border-t border-red-300 pt-6">
                    <h3 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <span className="text-red-800">📝</span>
                      Mô tả
                    </h3>
                    <div className="bg-gradient-to-r from-amber-50 to-red-50 p-4 rounded-lg border border-amber-300">
                      <p className="text-red-800 leading-relaxed text-base">
                        {video.sceneSummary}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related videos sidebar */}
          <div className="xl:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-6 border border-red-200">
              {/* Vietnamese flag inspired header */}
              <div className="bg-gradient-to-r from-red-800 to-amber-600 p-4 rounded-lg mb-6 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `url('/vietnam-flag.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
                <h3 className="text-lg font-bold text-white relative z-10 flex items-center gap-2">
                  <span className="text-amber-200">🎬</span>
                  Video liên quan
                </h3>
              </div>

              {relatedVideos.length === 0 ? (
                <div className="text-center py-8">
                  <div
                    className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-red-100 to-amber-100 flex items-center justify-center"
                    style={{
                      backgroundImage: `url('/cheo-2.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="text-2xl">🎭</div>
                  </div>
                  <p className="text-red-800 text-sm font-medium">
                    Không có video liên quan
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {relatedVideos.map((relatedVideo, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        router.push(
                          `/video/${encodeURIComponent(
                            relatedVideo.vidVersion || ""
                          )}`
                        )
                      }
                      className="flex gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-amber-50 p-1 rounded-lg transition-all duration-200 border border-transparent hover:border-red-300 hover:shadow-md"
                    >
                      <div className="w-32 h-20 bg-gradient-to-br from-red-100 to-amber-100 rounded-lg flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-red-300">
                        {/* Background pattern */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: `url('/trong-dong.jpg')`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        />
                        <span className="text-red-700 text-xl relative z-10">
                          🎭
                        </span>
                        {relatedVideo.duration && (
                          <div className="absolute bottom-1 right-1 bg-gradient-to-r from-red-800 to-red-900 text-white text-xs px-1.5 py-0.5 rounded shadow-sm">
                            {relatedVideo.duration}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-red-900 line-clamp-2 leading-tight m-0">
                          {relatedVideo.sceneName ||
                            relatedVideo.playTitle ||
                            "Video Chèo"}
                        </h4>
                        {relatedVideo.actors &&
                          relatedVideo.actors.length > 0 && (
                            <p className="text-xs text-red-800 truncate">
                              {relatedVideo.actors.slice(0, 2).join(", ")}
                            </p>
                          )}
                        {relatedVideo.characters &&
                          relatedVideo.characters.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {relatedVideo.characters
                                .slice(0, 1)
                                .map((character, charIdx) => (
                                  <span
                                    key={charIdx}
                                    className="px-1.5 py-0.5 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-900 text-xs rounded border border-amber-400"
                                  >
                                    {character}
                                  </span>
                                ))}
                              {relatedVideo.characters.length > 1 && (
                                <span className="text-xs text-red-700">
                                  +{relatedVideo.characters.length - 1}
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
