"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Navigator = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const getLinkClasses = (path: string, isMobile = false) => {
    const baseClasses = isMobile
      ? "block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
      : "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";

    if (isActive(path)) {
      return `${baseClasses} bg-green-300 text-white shadow-md`;
    }
    return `${baseClasses} text-white hover:text-green-200 hover:bg-white/10`;
  };

  const getNavbarTheme = () => {
    switch (pathname) {
      // case "/":
      //   return "bg-gradient-to-r from-green-400 to-green-500";
      // case "/search":
      //   return "bg-gradient-to-r from-emerald-400 to-green-500";
      // case "/characters":
      //   return "bg-gradient-to-r from-green-300 to-emerald-400";
      // case "/quotes":
      //   return "bg-gradient-to-r from-lime-400 to-green-400";
      // case "/about":
      //   return "bg-gradient-to-r from-teal-400 to-green-400";
      default:
        return "bg-gradient-to-r from-teal-500 to-green-500";
    }
  };

  return (
    <nav className={`${getNavbarTheme()} border-b-2 border-white/20 shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <span className="text-2xl font-bold text-white font-traditional drop-shadow-md">
                Chèo Ontology
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className={getLinkClasses("/")}>
                Trang chủ
              </Link>
              <Link href="/search" className={getLinkClasses("/search")}>
                Tìm kiếm
              </Link>
              <Link href="/library" className={getLinkClasses("/library")}>
                Thư viện
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-green-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50"
            >
              <span className="sr-only">Mở menu chính</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/20 backdrop-blur-sm border-t border-white/20">
            <Link
              href="/"
              className={getLinkClasses("/", true)}
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/search"
              className={getLinkClasses("/search", true)}
              onClick={() => setIsMenuOpen(false)}
            >
              Tìm kiếm
            </Link>
            <Link
              href="/library"
              className={getLinkClasses("/library", true)}
              onClick={() => setIsMenuOpen(false)}
            >
              Thư viện
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigator;
