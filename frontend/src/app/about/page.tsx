export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-accent py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-ancient-ink mb-4 font-traditional">
            Giới thiệu Chèo Ontology
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-ancient-gold to-ancient-jade mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hệ thống tra cứu toàn diện về nghệ thuật Chèo truyền thống Việt Nam
          </p>
        </div>

        {/* About Cheo */}
        <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
          <h2 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
            <span className="text-3xl mr-3">🎭</span>
            Về nghệ thuật Chèo
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              Chèo là một loại hình nghệ thuật sân khấu dân gian độc đáo của
              Việt Nam, có lịch sử hàng nghìn năm phát triển. Nghệ thuật Chèo
              không chỉ là hình thức giải trí mà còn là phương tiện giáo dục,
              truyền đạt những giá trị đạo đức, văn hóa và triết lý sống của dân
              tộc Việt Nam.
            </p>
            <p className="mb-4">
              Chèo có nguồn gốc từ các nghi lễ tôn giáo cổ xưa và các hoạt động
              văn hóa dân gian, dần phát triển thành một loại hình nghệ thuật
              tổng hợp kết hợp nhiều yếu tố như hát, múa, diễn xuất, và âm nhạc.
              Đặc biệt, Chèo luôn gắn liền với đời sống tinh thần của người dân
              Việt Nam.
            </p>
          </div>
        </section>

        {/* About Project */}
        <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
          <h2 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
            <span className="text-3xl mr-3">💻</span>
            Về dự án Chèo Ontology
          </h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-4">
              Chèo Ontology là một hệ thống tra cứu số hóa nhằm bảo tồn và chia
              sẻ kiến thức về nghệ thuật Chèo truyền thống. Dự án được xây dựng
              với mục tiêu tạo ra một cơ sở dữ liệu toàn diện về các nhân vật,
              trích dẫn, và vở diễn trong kho tàng Chèo Việt Nam.
            </p>
            <p className="mb-4">
              Thông qua việc số hóa và hệ thống hóa thông tin, chúng tôi hy vọng
              sẽ giúp thế hệ trẻ và các nhà nghiên cứu dễ dàng tiếp cận, tìm
              hiểu và nghiên cứu về nghệ thuật Chèo một cách có hệ thống và khoa
              học.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
          <h2 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
            <span className="text-3xl mr-3">⚡</span>
            Tính năng chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-accent">
              <h3 className="font-semibold text-ancient-ink mb-2 flex items-center">
                <span className="text-xl mr-2">🔍</span>
                Tìm kiếm thông minh
              </h3>
              <p className="text-gray-600 text-sm">
                Hệ thống tìm kiếm đa dạng theo nhân vật, trích dẫn, vở diễn với
                bộ lọc chi tiết.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-accent">
              <h3 className="font-semibold text-ancient-ink mb-2 flex items-center">
                <span className="text-xl mr-2">📚</span>
                Cơ sở dữ liệu phong phú
              </h3>
              <p className="text-gray-600 text-sm">
                Thông tin chi tiết về hàng trăm nhân vật, trích dẫn và vở diễn
                nổi tiếng.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-accent">
              <h3 className="font-semibold text-ancient-ink mb-2 flex items-center">
                <span className="text-xl mr-2">📱</span>
                Giao diện thân thiện
              </h3>
              <p className="text-gray-600 text-sm">
                Thiết kế responsive, dễ sử dụng trên mọi thiết bị với phong cách
                cổ điển.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-accent">
              <h3 className="font-semibold text-ancient-ink mb-2 flex items-center">
                <span className="text-xl mr-2">🎨</span>
                Thiết kế văn hóa
              </h3>
              <p className="text-gray-600 text-sm">
                Giao diện mang đậm chất văn hóa truyền thống với màu sắc và font
                chữ cổ điển.
              </p>
            </div>
          </div>
        </section>

        {/* Technology */}
        <section className="bg-surface rounded-lg shadow-ancient p-8 border-2 border-accent mb-8">
          <h2 className="text-2xl font-bold text-ancient-ink mb-6 font-traditional flex items-center">
            <span className="text-3xl mr-3">🛠️</span>
            Công nghệ sử dụng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Next.js", icon: "⚛️" },
              { name: "React", icon: "⚛️" },
              { name: "TypeScript", icon: "📘" },
              { name: "Tailwind CSS", icon: "🎨" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-white rounded-lg p-4 text-center border border-accent"
              >
                <div className="text-2xl mb-2">{tech.icon}</div>
                <div className="text-sm font-medium text-ancient-ink">
                  {tech.name}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-gradient-to-r from-primary-50 to-accent rounded-lg p-8 border-2 border-primary-200 text-center">
          <h2 className="text-2xl font-bold text-ancient-ink mb-4 font-traditional">
            Liên hệ và đóng góp
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi luôn chào đón những đóng góp từ cộng đồng để làm phong phú
            thêm cơ sở dữ liệu và cải thiện chất lượng hệ thống.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@cheo-ontology.vn"
              className="bg-primary-500 text-black-400 font-medium py-3 px-6 rounded-traditional hover:bg-primary-600 transition-colors duration-200"
            >
              📧 Gửi email
            </a>
            <a
              href="#"
              className="border-2 border-primary-500 text-primary-600 font-medium py-3 px-6 rounded-traditional hover:bg-primary-50 transition-colors duration-200"
            >
              📱 Liên hệ trực tiếp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
