"use client";

import { useEffect, useState } from "react";
import { getLibrary } from "@/apis/infor";
import { Library } from "@/types/index";
import LibraryVideoCard from "@/components/library/LibraryVideoCard";

export default function LibraryPage() {
  const [library, setLibrary] = useState<Library>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 20;
  const videosPerRow = 4;

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getLibrary();
        console.log("Library response:", response);

        if (response.data && Array.isArray(response.data)) {
          setLibrary(response.data);
        } else {
          setError("Không tìm thấy dữ liệu thư viện video.");
        }
      } catch (err) {
        console.error("Error fetching library:", err);
        setError("Lỗi khi tải dữ liệu thư viện. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(library.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const endIndex = startIndex + videosPerPage;
  const currentVideos = library.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-1.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center py-16">
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-red-100">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
              <span className="text-red-700 font-medium">
                Đang tải thư viện video...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 py-8 relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url('/cheo-2.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-red-200 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-medium text-red-800 mb-2">
              Lỗi tải dữ liệu
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-md"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50 py-8 relative">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/trong-dong-2.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-red-200">
            {/* Vietnamese flag inspired banner */}
            <div className="bg-gradient-to-r from-red-600 to-yellow-500 p-4 rounded-lg mb-4 relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url('/cheo-1.jpg')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 font-traditional flex items-center gap-3 relative z-10">
                <span className="text-4xl">📺</span>
                Thư viện Video Chèo
              </h1>
              <p className="text-yellow-100 text-lg relative z-10">
                Khám phá bộ sưu tập video nghệ thuật Chèo truyền thống Việt Nam
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-red-600">
              <span>📊 {library.length} video</span>
              <span>
                📄 Trang {currentPage}/{totalPages}
              </span>
              <span>🎭 Nghệ thuật dân gian</span>
              <span>🇻🇳 Văn hóa Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {library.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-red-200 text-center">
            <div className="text-6xl mb-4">📹</div>
            <h3 className="text-xl font-medium text-red-800 mb-2">
              Chưa có video nào
            </h3>
            <p className="text-red-600">
              Thư viện video đang được cập nhật. Vui lòng quay lại sau.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentVideos.map((item, index) => (
                <LibraryVideoCard key={index} item={item} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-red-100">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Trước
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                            : "text-red-700 bg-white border border-red-300 hover:bg-red-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Sau
                  </button>
                </nav>
              </div>
            )}
          </>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center">
          <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-yellow-200">
            <p className="text-red-600 text-sm font-medium">
              Bộ sưu tập video nghệ thuật Chèo được sưu tầm và lưu trữ với mục
              đích bảo tồn văn hóa
            </p>
            <div className="mt-3 flex justify-center items-center gap-2">
              <span className="text-red-500">🇻🇳</span>
              <span className="text-yellow-600 font-semibold">
                Tự hào văn hóa Việt Nam
              </span>
              <span className="text-red-500">🇻🇳</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
