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
              href="/library"
              className="border-2 border-primary-500 text-primary-600 font-medium py-4 px-8 rounded-traditional hover:bg-primary-50 transition-all duration-200 text-lg"
            >
              � Thư viện
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      {/* Giới thiệu Chèo Ontology */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
              Giới thiệu Chèo Ontology
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-jade mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hệ thống tra cứu toàn diện về nghệ thuật Chèo truyền thống Việt
              Nam
            </p>
          </div>
          <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
            <h3 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
              <span className="text-3xl mr-3">🎭</span>
              Về nghệ thuật Chèo
            </h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-4">
                Chèo là một loại hình nghệ thuật sân khấu dân gian độc đáo của
                Việt Nam, có lịch sử hàng nghìn năm phát triển. Nghệ thuật Chèo
                không chỉ là hình thức giải trí mà còn là phương tiện giáo dục,
                truyền đạt những giá trị đạo đức, văn hóa và triết lý sống của
                dân tộc Việt Nam.
              </p>
              <p className="mb-4">
                Chèo có nguồn gốc từ các nghi lễ tôn giáo cổ xưa và các hoạt
                động văn hóa dân gian, dần phát triển thành một loại hình nghệ
                thuật tổng hợp kết hợp nhiều yếu tố như hát, múa, diễn xuất, và
                âm nhạc. Đặc biệt, Chèo luôn gắn liền với đời sống tinh thần của
                người dân Việt Nam.
              </p>
            </div>
          </section>
          <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
            <h3 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
              <span className="text-3xl mr-3">💻</span>
              Về dự án Chèo Ontology
            </h3>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
              <p className="mb-4">
                Chèo Ontology là một hệ thống tra cứu số hóa nhằm bảo tồn và
                chia sẻ kiến thức về nghệ thuật Chèo truyền thống. Dự án được
                xây dựng với mục tiêu tạo ra một cơ sở dữ liệu toàn diện về các
                nhân vật, vở diễn, nghệ sĩ, và các yếu tố liên quan đến Chèo.
              </p>
            </div>
          </section>
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
