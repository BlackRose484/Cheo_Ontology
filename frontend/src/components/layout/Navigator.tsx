"use client";

import Link from "next/link";
import Image from "next/image";
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
      ? "block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
      : "px-3 py-2 rounded-md text-sm font-medium transition-all duration-300";

    if (isActive(path)) {
      return `${baseClasses} bg-amber-400 text-black shadow-md font-bold border border-red-900`;
    }
    return `${baseClasses} text-white hover:text-black hover:bg-amber-400 hover:shadow-md`;
  };

  const getNavbarTheme = () => {
    return "bg-gradient-to-r from-red-800 via-red-900 to-red-800";
  };

  return (
    <nav
      className={`${getNavbarTheme()} border-b-4 border-amber-400 shadow-lg relative overflow-hidden`}
    >
      {/* Vietnamese cultural pattern overlay */}
      <div className="absolute inset-0 bg-[url('/cheo-1.jpg')] opacity-5 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-800/90 via-red-900/90 to-red-800/90"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 flex-row">
              {/* Company Logo */}
              <div className="relative w-8 h-8 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Chèo Google Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-xl font-bold text-white font-traditional drop-shadow-md leading-none flex items-center h-8">
                Chèo Google
              </div>
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
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-black hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 transition-all duration-300"
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
        <div className="md:hidden relative">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-800/95 backdrop-blur-sm border-t-2 border-yellow-400">
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
