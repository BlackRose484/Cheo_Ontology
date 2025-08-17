"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getActorNames } from "@/apis/infor";
import { ActorGeneral } from "@/types";
import Link from "next/link";

export default function ActorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const actorName = decodeURIComponent(params.name as string);

  const [actor, setActor] = useState<ActorGeneral | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActorDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getActorNames();
        console.log("Actor list response:", response);

        if (response.data && Array.isArray(response.data)) {
          // Tìm actor có name khớp
          const foundActor = response.data.find(
            (a: ActorGeneral) => a.name === actorName
          );

          if (foundActor) {
            setActor(foundActor);
          } else {
            setError("Không tìm thấy thông tin diễn viên này");
          }
        } else {
          setError("Lỗi khi tải danh sách diễn viên");
        }
      } catch (error) {
        console.error("Error fetching actor detail:", error);
        setError("Lỗi khi tải thông tin diễn viên. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (actorName) {
      fetchActorDetail();
    }
  }, [actorName]);

  const handleBackToSearch = () => {
    router.push("/search");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-ancient-ink">
                Đang tải thông tin diễn viên...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !actor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <span className="text-4xl">🎨</span>
            {actor.name}
          </h1>
        </div>

        {/* Actor Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                <span>📋</span>
                <span>Thông tin cơ bản</span>
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium text-gray-700">
                    Tên diễn viên:
                  </span>
                  <span className="text-purple-800 font-semibold">
                    {actor.name}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="font-medium text-gray-700">Giới tính:</span>
                  <span className="text-pink-800 capitalize">
                    {actor.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
              <h2 className="text-xl font-bold text-ancient-ink mb-4 flex items-center gap-2">
                <span>🎭</span>
                <span>Nghề nghiệp</span>
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg border">
                <p className="text-gray-700 leading-relaxed italic">
                  Nghệ sĩ chuyên nghiệp trong lĩnh vực nghệ thuật Chèo truyền
                  thống Việt Nam. Chèo là một loại hình nghệ thuật sân khấu dân
                  gian đặc sắc, kết hợp giữa ca hát, múa, và diễn xuất, mang đậm
                  bản sắc văn hóa dân tộc.
                </p>
              </div>
            </div>
          </div>

          {/* Side Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Characters List */}
            {actor.charNames && actor.charNames.length > 0 && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>🎭</span>
                  <span>Nhân vật đã thủ vai ({actor.charNames.length})</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {actor.charNames.map((charName, index) => (
                    <Link
                      key={index}
                      href={`/character/${encodeURIComponent(charName)}`}
                      className="block p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-600">👤</span>
                        <span className="text-blue-800 font-medium">
                          {charName}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Plays List */}
            {actor.playTitles && actor.playTitles.length > 0 && (
              <div className="bg-surface rounded-lg shadow-ancient p-6 border-2 border-accent">
                <h3 className="text-lg font-bold text-ancient-ink mb-4 flex items-center gap-2">
                  <span>�</span>
                  <span>Vở chèo đã tham gia ({actor.playTitles.length})</span>
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {actor.playTitles.map((playTitle, index) => (
                    <Link
                      key={index}
                      href={`/play/${encodeURIComponent(playTitle)}`}
                      className="block p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-green-600">🎪</span>
                        <span className="text-green-800 font-medium">
                          {playTitle}
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
                <Link
                  href={`/search?actor=${encodeURIComponent(actorName)}`}
                  className="block w-full p-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>🔍</span>
                    <span>Tìm kiếm các vai diễn</span>
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
