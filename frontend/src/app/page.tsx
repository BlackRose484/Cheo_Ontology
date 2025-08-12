import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-8">
            <h1 className="hero-title text-ancient-ink font-traditional">
              Chèo Ontology
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-jade mx-auto mb-6"></div>
            <p className="hero-subtitle max-w-3xl mx-auto">
              Khám phá di sản nghệ thuật Chèo truyền thống Việt Nam
            </p>
          </div>

          {/* Description */}
          <div className="mb-12 max-w-4xl mx-auto">
            <p className="text-lg text-gray-600 text-center leading-relaxed mb-6">
              Hệ thống tra cứu toàn diện về nghệ thuật Chèo - một trong những
              loại hình nghệ thuật sân khấu dân gian đặc sắc nhất của Việt Nam.
              Tìm hiểu về các nhân vật, trích dẫn nổi tiếng và những vở diễn
              kinh điển.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/search"
              className="bg-gradient-to-r from-primary-500 to-primary-600 text-black-400 font-medium py-4 px-8 rounded-traditional hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-ancient text-lg"
            >
              🔍 Bắt đầu tìm kiếm
            </Link>
            <Link
              href="/characters"
              className="border-2 border-primary-500 text-primary-600 font-medium py-4 px-8 rounded-traditional hover:bg-primary-50 transition-all duration-200 text-lg"
            >
              👥 Xem nhân vật
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-ancient-ink text-center mb-12 font-traditional">
            Tính năng nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card">
              <div className="text-4xl mb-4 text-center">👥</div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-3">
                Nhân vật Chèo
              </h3>
              <p className="text-gray-600">
                Khám phá các nhân vật kinh điển trong nghệ thuật Chèo với thông
                tin chi tiết về tính cách, vai trò và ý nghĩa văn hóa.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card">
              <div className="text-4xl mb-4 text-center">💬</div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-3">
                Trích dẫn nổi tiếng
              </h3>
              <p className="text-gray-600">
                Tìm hiểu những câu thoại, lời ca đầy ý nghĩa từ các vở Chèo kinh
                điển, phản ánh triết lý sống của người Việt.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card">
              <div className="text-4xl mb-4 text-center">🎭</div>
              <h3 className="text-xl font-semibold text-ancient-ink mb-3">
                Vở diễn truyền thống
              </h3>
              <p className="text-gray-600">
                Tìm hiểu về các vở Chèo nổi tiếng, cốt truyện và thông điệp văn
                hóa mà chúng mang lại cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/80 rounded-lg p-6 border border-accent">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                50+
              </div>
              <div className="text-gray-600">Nhân vật</div>
            </div>
            <div className="bg-white/80 rounded-lg p-6 border border-accent">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                100+
              </div>
              <div className="text-gray-600">Trích dẫn</div>
            </div>
            <div className="bg-white/80 rounded-lg p-6 border border-accent">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                20+
              </div>
              <div className="text-gray-600">Vở diễn</div>
            </div>
            <div className="bg-white/80 rounded-lg p-6 border border-accent">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Năm lịch sử</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-50 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-ancient-ink mb-6 font-traditional">
            Bắt đầu khám phá ngay
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Hãy cùng chúng tôi tìm hiểu và bảo tồn những giá trị văn hóa quý báu
            của nghệ thuật Chèo truyền thống Việt Nam.
          </p>
          <Link
            href="/search"
            className="inline-block bg-gradient-to-r from-primary-500 to-primary-600 text-black-400 font-medium py-4 px-8 rounded-traditional hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-ancient text-lg"
          >
            Khám phá ngay 🚀
          </Link>
        </div>
      </section>
    </div>
  );
}
