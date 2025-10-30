"use client";

import { DISPLAY_EMOTIONS } from "@/constants/base";
import { CharacterStates } from "@/types";
import { convertSecondsToTime } from "@/utils/util";
import Link from "next/link";

interface CharacterStateTableProps {
  results: CharacterStates;
  isLoading: boolean;
}

const CharacterStateTable = ({
  results,
  isLoading,
}: CharacterStateTableProps) => {
  if (isLoading) {
    return (
      <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-amber-400 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800"></div>
          <span className="ml-3 text-red-900">Đang tìm kiếm...</span>
        </div>
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="bg-white/80 rounded-lg shadow-lg p-8 border-2 border-amber-400 text-center backdrop-blur-sm">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-red-900 mb-2">
          Không tìm thấy kết quả
        </h3>
        <p className="text-red-800">
          Hãy thử điều chỉnh bộ lọc để có kết quả tốt hơn.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 rounded-lg shadow-lg p-6 border-2 border-amber-400 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-red-900 font-traditional flex items-center">
          <span className="text-2xl mr-2">🎭</span>
          Kết quả tìm kiếm theo trạng thái nhân vật ({results.length})
        </h3>
      </div>

      {/* Table for larger screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse bg-white/90 rounded-lg overflow-hidden shadow-lg backdrop-blur-sm">
          <thead>
            <tr className="bg-gradient-to-r from-red-800 to-red-900">
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Tên Nhân vật
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Vở chèo
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Trích đoạn
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Phiên bản
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Nét biểu cảm
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Thời gian
              </th>
              <th className="border border-amber-400 px-4 py-3 text-left font-semibold text-amber-200">
                Diễn viên
              </th>
              <th className="border border-amber-400 px-4 py-3 text-center font-semibold text-amber-200">
                Xem Video
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((character, index) => (
              <tr
                key={`${character.appearance}-${index}`}
                className={`hover:bg-red-50 transition-colors duration-150 ${
                  index % 2 === 0 ? "bg-white/90" : "bg-red-50/50"
                }`}
              >
                <td className="border border-red-200 px-4 py-3">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-red-800">
                        {character.charName}
                      </div>
                      <div
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${
                          character.charGender === "nam"
                            ? "bg-red-100 text-red-800 border-red-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {character.charGender}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <span className="text-gray-800">
                    {character.playTitle || "Chưa xác định"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <span className="text-gray-800">
                    {character.sceneName || "Chưa xác định"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-mono font-medium">
                      {character.versionID || "N/A"}
                    </span>
                    {character.showDate && (
                      <span className="text-xs text-gray-600">
                        📅 {character.showDate}
                      </span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      character.emotion
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {DISPLAY_EMOTIONS[
                      character.emotion as keyof typeof DISPLAY_EMOTIONS
                    ] || "Chưa xác định"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {character.start && character.end ? (
                      <>
                        <span className="text-xs text-gray-600">
                          ⏱ Bắt đầu:{" "}
                          <span className="font-medium">
                            {convertSecondsToTime(character.start)}
                          </span>
                        </span>
                        <span className="text-xs text-gray-600">
                          ⏱ Kết thúc:{" "}
                          <span className="font-medium">
                            {convertSecondsToTime(character.end)}
                          </span>
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Chưa có dữ liệu
                      </span>
                    )}
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <span className="text-gray-800">
                    {character.actor || "Chưa xác định"}
                  </span>
                </td>
                <td className="border border-gray-300 px-4 py-3 text-center">
                  <Link
                    href={`/character/${encodeURIComponent(
                      character.charName
                    )}/video?play=${encodeURIComponent(
                      character.playTitle || ""
                    )}&emotion=${encodeURIComponent(
                      character.emotion || ""
                    )}&uri=${encodeURIComponent(character.appearance || "")}`}
                    className="inline-flex items-center px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                  >
                    <span className="mr-1">�</span>Video
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for mobile screens */}
      <div className="md:hidden space-y-4">
        {results.map((character, index) => (
          <div
            key={`${character.appearance}-${index}`}
            className="bg-white rounded-lg p-4 border border-accent shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-ancient-ink text-lg">
                  {character.charName}
                </h4>
                <p className="text-sm text-gray-600">{character.charGender}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  character.emotion
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {DISPLAY_EMOTIONS[
                  character.emotion as keyof typeof DISPLAY_EMOTIONS
                ] || "Chưa xác định"}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Vở chèo:</span>
                <span className="text-gray-800">
                  {character.playTitle || "Chưa xác định"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">
                  Trích đoạn:
                </span>
                <span className="text-gray-800">
                  {character.sceneName || "Chưa xác định"}
                </span>
              </div>
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">
                  Phiên bản:
                </span>
                <span className="text-xs font-mono bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {character.versionID || "N/A"}
                </span>
              </div>
              {character.showDate && (
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">
                    Ngày diễn:
                  </span>
                  <span className="text-gray-800">📅 {character.showDate}</span>
                </div>
              )}
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">
                  Diễn viên:
                </span>
                <span className="text-gray-800">
                  {character.actor || "Chưa xác định"}
                </span>
              </div>
              {character.start && character.end && (
                <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded">
                  <span className="text-xs text-gray-600">
                    ⏱ Bắt đầu:{" "}
                    <span className="font-medium">
                      {convertSecondsToTime(character.start)}
                    </span>
                  </span>
                  <span className="text-xs text-gray-600">
                    ⏱ Kết thúc:{" "}
                    <span className="font-medium">
                      {convertSecondsToTime(character.end)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100">
              <Link
                href={`/character/${encodeURIComponent(
                  character.charName
                )}/video?play=${encodeURIComponent(
                  character.playTitle || ""
                )}&emotion=${encodeURIComponent(
                  character.emotion || ""
                )}&uri=${encodeURIComponent(character.appearance || "")}`}
                className="w-full inline-flex items-center px-4 py-2 bg-red-800 text-white rounded-md hover:bg-red-900 transition-colors duration-200 text-sm font-medium justify-center"
              >
                <span className="mr-2">�</span>
                Xem video
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterStateTable;
