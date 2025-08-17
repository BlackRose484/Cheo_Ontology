"use client";

import { useState } from "react";
import VideoErrorBoundary from "./VideoErrorBoundary";
import { convertSecondsToTime } from "@/utils/util";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  className?: string;
  startTime?: string; // Thời gian bắt đầu, format: "mm:ss" hoặc "hh:mm:ss"
}

const VideoPlayer = ({
  videoUrl,
  title,
  className = "",
  startTime,
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Convert Google Drive link to embeddable format
  const getEmbedUrl = (driveUrl: string) => {
    if (!driveUrl) return "";

    let fileId = "";

    if (driveUrl.includes("/file/d/")) {
      fileId = driveUrl.split("/file/d/")[1].split("/")[0];
    } else if (driveUrl.includes("id=")) {
      fileId = driveUrl.split("id=")[1].split("&")[0];
    } else if (driveUrl.includes("/d/")) {
      fileId = driveUrl.split("/d/")[1].split("/")[0];
    }

    if (fileId) {
      let embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      if (startTime) {
        embedUrl += `?t=${startTime}`;
      }

      return embedUrl;
    }

    return driveUrl;
  };

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">❌</div>
          <p className="text-gray-600 mb-2">Không thể tải video</p>
          <button
            onClick={() => {
              setError(false);
              setIsLoading(true);
            }}
            className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 text-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoErrorBoundary>
      <div className={`relative ${className}`}>
        {/* Start time notification */}
        {startTime && (
          <div className="mb-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 text-yellow-800">
              <span>⏰</span>
              <span className="text-sm">
                <strong>Thời gian bắt đầu:</strong>{" "}
                {convertSecondsToTime(startTime)}
              </span>
            </div>
            <div className="text-xs text-yellow-700 mt-1 space-y-1">
              <p>
                Vui lòng tua đến thời điểm{" "}
                <strong>{convertSecondsToTime(startTime)}</strong> để xem đúng
                đoạn biểu diễn
              </p>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center z-10">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              <span className="text-gray-600">Đang tải video...</span>
            </div>
          </div>
        )}

        <div className="relative w-full h-0 pb-[56.25%] bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={getEmbedUrl(videoUrl)}
            className="absolute top-0 left-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title}
            onLoad={handleLoad}
            onError={handleError}
          ></iframe>
        </div>
      </div>
    </VideoErrorBoundary>
  );
};

export default VideoPlayer;
