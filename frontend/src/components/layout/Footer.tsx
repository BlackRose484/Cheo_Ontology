import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-red-800 via-red-900 to-red-800 border-t-4 border-amber-400 mt-auto relative">
      {/* Subtle cultural background */}
      <div className="absolute inset-0 bg-[url('/trong-dong.jpg')] opacity-3 bg-cover bg-center"></div>

      <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 font-traditional">
              Về Chèo Google
            </h3>
            <p className="text-sm text-white/90 leading-relaxed">
              Hệ thống tra cứu thông tin về nghệ thuật Chèo truyền thống Việt
              Nam, lưu giữ và chia sẻ di sản văn hóa dân tộc.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 font-traditional">
              Liên kết nhanh
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/search"
                  className="text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 px-2 py-1 rounded"
                >
                  Tìm kiếm
                </a>
              </li>
              <li>
                <a
                  href="/library"
                  className="text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 px-2 py-1 rounded"
                >
                  Thư viện video
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-4 font-traditional">
              Thông tin liên hệ
            </h3>
            <div className="text-sm text-white/90 space-y-2">
              <p>Email: hungnbc2@gmail.com</p>
              <p>Điện thoại: 0848014259</p>
              <p>Địa chỉ: Hà Nội, Việt Nam</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 pt-8 border-t border-yellow-400/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              {/* Company Logo */}
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Chèo Google Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-sm text-white/90 leading-none">
                © 2024 Chèo Google. Tất cả quyền được bảo lưu.
              </span>
            </div>

            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 p-2 rounded"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 p-2 rounded"
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
