import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-red-100 relative overflow-hidden">
      {/* Vietnamese cultural background pattern */}
      <div className="absolute inset-0 bg-[url('/home-1.jpg')] opacity-5 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/5 via-transparent to-amber-600/5"></div>

      <div className="relative">
        {/* Hero Section với hình ảnh showcase */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Phần text và buttons */}
              <div className="text-center lg:text-left">
                <div className="mb-8">
                  <div className="flex justify-center lg:justify-start items-center mb-6">
                    <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Chèo Google Logo"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div className="text-4xl md:text-6xl font-bold text-red-900 font-traditional leading-none">
                      Chèo Google
                    </div>
                  </div>
                  <div className="w-32 h-2 bg-gradient-to-r from-red-800 to-amber-500 mx-auto lg:mx-0 mb-6 rounded-full"></div>
                  <p className="text-xl md:text-2xl text-red-800 font-medium mb-6">
                    Khám phá di sản nghệ thuật Chèo truyền thống Việt Nam 🇻🇳
                  </p>
                  <p className="text-lg text-red-800 leading-relaxed mb-8">
                    Kho tàng tri thức về Chèo - tinh hoa nghệ thuật sân khấu dân
                    gian từ vùng châu thổ Bắc Bộ. Khám phá những nhân vật bất
                    hủ, những câu hát da diết và bảy vở chèo cổ kinh điển được
                    truyền tụng qua bao thế hệ.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-8">
                  <Link
                    href="/search"
                    className="bg-gradient-to-r from-red-800 to-red-900 text-white font-medium py-4 px-8 rounded-lg hover:from-red-900 hover:to-red-800 transition-all duration-200 shadow-lg text-lg border border-red-700"
                  >
                    🔍 Bắt đầu tìm kiếm
                  </Link>
                  <Link
                    href="/library"
                    className="border-2 border-red-800 text-red-900 font-medium py-4 px-8 rounded-lg hover:bg-red-100 transition-all duration-200 text-lg"
                  >
                    📚 Thư viện
                  </Link>
                </div>
              </div>

              {/* Phần hình ảnh hero */}
              <div className="relative">
                <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-red-200">
                  <Image
                    src="/home-2.jpg"
                    alt="Nghệ thuật Chèo truyền thống"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/30 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm font-medium bg-red-900/70 px-3 py-2 rounded-lg backdrop-blur-sm">
                      Nghệ thuật Chèo - Tinh hoa văn hóa dân tộc
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section - Showcase các vở chèo */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50/30 via-white to-amber-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-red-900 mb-4 font-traditional">
                Khám phá các vở chèo kinh điển
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-800 to-amber-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Tám vở chèo cổ bất hủ - những viên ngọc quý của kho tàng văn hóa
                dân tộc
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Image 1 */}
              <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-64 w-full">
                  <Image
                    src="/home-3.jpg"
                    alt="Vở chèo Kim Nham"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-lg mb-1">Thị Màu lên chùa</h3>
                  <p className="text-sm opacity-90">
                    Câu chuyện tình yêu bi thương
                  </p>
                </div>
              </div>

              {/* Image 2 */}
              <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-64 w-full">
                  <Image
                    src="/home-4.jpg"
                    alt="Vở chèo Trương Viên"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-lg mb-1">Súy Vân giả dại</h3>
                  <p className="text-sm opacity-90">
                    Lòng hiếu thảo và tình người
                  </p>
                </div>
              </div>

              {/* Image 3 */}
              <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="relative h-64 w-full">
                  <Image
                    src="/home-5.jpg"
                    alt="Nghệ sĩ Chèo"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-bold text-lg mb-1">Hề Chèo</h3>
                  <p className="text-sm opacity-90">Những tài năng siêu việt</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Giới thiệu Chèo Google với split layout */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm relative">
          <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-5 bg-cover bg-center"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-red-900 mb-4 font-traditional">
                Giới thiệu Chèo Google
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-800 to-amber-500 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Kho tàng tri thức về nghệ thuật chèo - tinh hoa sân khấu dân
                gian từ vùng châu thổ Bắc Bộ
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-12">
              {/* Về nghệ thuật Chèo */}
              <div>
                <section className="bg-white/90 rounded-xl shadow-lg p-8 border border-red-400 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-red-900 mb-6 font-traditional flex items-center">
                    <span className="text-3xl mr-3">🎭</span>
                    Về nghệ thuật Chèo
                  </h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Chèo là loại kịch hát dân gian bản sắc của người Việt, nảy
                      nở từ vùng đất phì nhiêu châu thổ Bắc Bộ. Từ buổi ban đầu,
                      chèo đã đảm nhiệm vai trò kể chuyện của dân gian qua sự
                      hòa quyện tinh tế của âm nhạc, hóa trang, bài trí, múa và
                      điệu bộ.
                    </p>
                    <p className="mb-4">
                      Trải qua hàng trăm năm lưu truyền, chèo đã trưởng thành
                      thành một nghệ thuật sân khấu hoàn chỉnh với ngôn ngữ biểu
                      diễn đặc trưng, mang đậm hồn quê và tâm hồn dân tộc Việt
                      Nam.
                    </p>
                  </div>
                </section>
              </div>

              {/* Hình ảnh minh họa */}
              <div className="relative">
                <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/cheo-2.jpg"
                    alt="Biểu diễn nghệ thuật Chèo"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-amber-600/20"></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Hình ảnh minh họa 2 */}
              <div className="relative order-2 lg:order-1">
                <div className="relative h-80 w-full rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/cheo-1.jpg"
                    alt="Vở chèo dân gian"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-amber-600/20"></div>
                </div>
              </div>

              {/* Về dự án */}
              <div className="order-1 lg:order-2">
                <section className="bg-white/90 rounded-xl shadow-lg p-8 border border-red-400 backdrop-blur-sm">
                  <h3 className="text-2xl font-bold text-red-900 mb-6 font-traditional flex items-center">
                    <span className="text-3xl mr-3">💻</span>
                    Về dự án Chèo Google
                  </h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                    <p className="mb-4">
                      Chèo Google ra đời với sứ mệnh gìn giữ và truyền bá kho
                      tàng tri thức về nghệ thuật chèo truyền thống. Dự án xây
                      dựng một cơ sở dữ liệu toàn diện về các nhân vật kinh điển
                      và vở chèo bất hủ.
                    </p>
                    <p className="mb-4">
                      Với mong muốn đưa nghệ thuật dân gian đến gần hơn với thế
                      hệ trẻ, chúng tôi số hóa những giá trị văn hóa quý báu,
                      từng câu hát da diết và bài học nhân sinh sâu sắc.
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section với background ảnh */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-br from-red-900 to-red-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/home-1.jpg')] opacity-10 bg-cover bg-center"></div>
          <div className="absolute inset-0 bg-red-900/70"></div>
          <div className="relative max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-traditional">
                Kho tàng tri thức Chèo
              </h2>
              <div className="w-32 h-2 bg-gradient-to-r from-amber-400 to-yellow-300 mx-auto mb-6 rounded-full"></div>
              <p className="text-lg text-red-100 max-w-2xl mx-auto">
                Những con số ấn tượng về di sản văn hóa Chèo truyền thống
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="text-3xl font-bold text-amber-300 mb-2">
                  20+
                </div>
                <div className="text-red-100">Nhân vật</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="text-3xl font-bold text-amber-300 mb-2">
                  20+
                </div>
                <div className="text-red-100">Trích đoạn</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="text-3xl font-bold text-amber-300 mb-2">8</div>
                <div className="text-red-100">Vở chèo cổ</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-200">
                <div className="text-3xl font-bold text-amber-300 mb-2">
                  500+
                </div>
                <div className="text-red-100">Năm lịch sử</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action với parallax effect */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-white to-yellow-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/trong-dong-2.jpg')] opacity-15 bg-cover bg-center bg-fixed"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-yellow-400/20"></div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 border border-red-200 shadow-xl">
              <h2 className="text-4xl font-bold text-red-900 mb-6 font-traditional">
                Bắt đầu khám phá ngay
              </h2>
              <p className="text-lg text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto">
                Cùng nhau gìn giữ và truyền bá những câu hát da diết, những nhân
                vật bất hủ và bảy vở chèo cổ kinh điển - những viên ngọc quý
                trong kho tàng văn hóa dân tộc.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/search"
                  className="inline-block bg-gradient-to-r from-red-800 to-red-900 text-white font-semibold py-4 px-10 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-lg border border-red-200"
                >
                  Khám phá ngay 🚀
                </Link>
                <Link
                  href="/library"
                  className="inline-block border-2 border-red-800 text-red-900 font-semibold py-4 px-10 rounded-xl hover:bg-red-100 transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Xem thư viện 📚
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
