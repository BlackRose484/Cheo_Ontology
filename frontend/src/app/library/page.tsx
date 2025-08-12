export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            📚 Thư viện Chèo
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-jade mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá tất cả các vở diễn, nghệ sĩ, nhân vật nổi bật trong nghệ
            thuật Chèo truyền thống Việt Nam.
          </p>
        </div>
        {/* TODO: Hiển thị danh sách vở diễn, nghệ sĩ, nhân vật ở đây */}
        <div className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent">
          <p className="text-center text-gray-500">
            Tính năng đang phát triển...
          </p>
        </div>
      </div>
    </div>
  );
}
