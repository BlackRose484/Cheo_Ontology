import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-yellow-50 relative overflow-hidden">
      {/* Vietnamese cultural background pattern */}
      <div className="absolute inset-0 bg-[url('/vietnam-flag.jpg')] opacity-3 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-yellow-400/5"></div>

      <div className="relative">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            {/* Main Title */}
            <div className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-16 h-16 mr-4">
                  <Image
                    src="/logo.png"
                    alt="Chèo Ontology Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-red-600 font-traditional leading-none">
                  Chèo Ontology
                </h1>
              </div>
              <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-yellow-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-2xl md:text-3xl text-red-700 font-medium max-w-3xl mx-auto">
                Khám phá di sản nghệ thuật Chèo truyền thống Việt Nam 🇻🇳
              </p>
            </div>

            {/* Description */}
            <div className="mb-12 max-w-4xl mx-auto">
              <p className="text-lg text-red-700 text-center leading-relaxed mb-6">
                Hệ thống tra cứu toàn diện về nghệ thuật Chèo - một trong những
                loại hình nghệ thuật sân khấu dân gian đặc sắc nhất của Việt
                Nam. Tìm hiểu về các nhân vật, trích dẫn nổi tiếng và những vở
                diễn kinh điển.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/search"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium py-4 px-8 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg text-lg border border-red-200"
              >
                🔍 Bắt đầu tìm kiếm
              </Link>
              <Link
                href="/library"
                className="border-2 border-red-500 text-red-600 font-medium py-4 px-8 rounded-lg hover:bg-red-50 transition-all duration-200 text-lg"
              >
                📚 Thư viện
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        {/* Giới thiệu Chèo Ontology */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-5 bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-red-600 mb-4 font-traditional">
                Giới thiệu Chèo Ontology
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-yellow-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Hệ thống tra cứu toàn diện về nghệ thuật Chèo truyền thống Việt
                Nam
              </p>
            </div>
            <section className="bg-white/90 rounded-xl shadow-lg p-8 border border-red-100 mb-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-red-600 mb-6 font-traditional flex items-center">
                <span className="text-3xl mr-3">🎭</span>
                Về nghệ thuật Chèo
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Chèo là một loại hình nghệ thuật sân khấu dân gian độc đáo của
                  Việt Nam, có lịch sử hàng nghìn năm phát triển. Nghệ thuật
                  Chèo không chỉ là hình thức giải trí mà còn là phương tiện
                  giáo dục, truyền đạt những giá trị đạo đức, văn hóa và triết
                  lý sống của dân tộc Việt Nam.
                </p>
                <p className="mb-4">
                  Chèo có nguồn gốc từ các nghi lễ tôn giáo cổ xưa và các hoạt
                  động văn hóa dân gian, dần phát triển thành một loại hình nghệ
                  thuật tổng hợp kết hợp nhiều yếu tố như hát, múa, diễn xuất,
                  và âm nhạc. Đặc biệt, Chèo luôn gắn liền với đời sống tinh
                  thần của người dân Việt Nam.
                </p>
              </div>
            </section>
            <section className="bg-white/90 rounded-xl shadow-lg p-8 border border-red-100 mb-8 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-red-600 mb-6 font-traditional flex items-center">
                <span className="text-3xl mr-3">💻</span>
                Về dự án Chèo Ontology
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Chèo Ontology là một hệ thống tra cứu số hóa nhằm bảo tồn và
                  chia sẻ kiến thức về nghệ thuật Chèo truyền thống. Dự án được
                  xây dựng với mục tiêu tạo ra một cơ sở dữ liệu toàn diện về
                  các nhân vật, vở diễn, nghệ sĩ, và các yếu tố liên quan đến
                  Chèo.
                </p>
              </div>
            </section>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white rounded-xl p-6 border border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-3xl font-bold text-red-500 mb-2">50+</div>
                <div className="text-gray-700">Nhân vật</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-3xl font-bold text-red-500 mb-2">100+</div>
                <div className="text-gray-700">Trích dẫn</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-3xl font-bold text-red-500 mb-2">20+</div>
                <div className="text-gray-700">Vở chèo</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-red-100 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-3xl font-bold text-red-500 mb-2">500+</div>
                <div className="text-gray-700">Năm lịch sử</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-yellow-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/trong-dong-2.jpg')] opacity-5 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-yellow-400/10"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-red-600 mb-6 font-traditional">
              Bắt đầu khám phá ngay
            </h2>
            <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
              Hãy cùng chúng tôi tìm hiểu và bảo tồn những giá trị văn hóa quý
              báu của nghệ thuật Chèo truyền thống Việt Nam.
            </p>
            <Link
              href="/search"
              className="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-4 px-10 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg border border-red-200"
            >
              Khám phá ngay 🚀
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
