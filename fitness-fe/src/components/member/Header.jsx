import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <>
      <header className="bg-[#1a1625] border-b border-[#2a2435]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-white">FIGHT</span>
                <span className="text-[#a78bfa]">I</span>
                <span className="text-[#c4b5fd]">CO</span>
              </span>
            </Link>

            {/* Desktop Navigation - hidden below lg (1024px) */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/gioi-thieu"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Giới thiệu
              </Link>
              <Link
                to="/pricing-packages"
                className="text-gray-300 hover:text-white transition-colors text-sm"
              >
                Đăng ký gói tập
              </Link>
            </nav>

            {/* Desktop Right Section - hidden below lg (1024px) */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <User className="w-5 h-5" />
                <span className="text-sm">Guest User</span>
              </div>
              <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm px-4 py-2 rounded-full">
                Đăng Nhập
              </button>
            </div>

            {/* Mobile menu button - visible below lg (1024px) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation - visible below lg (1024px) */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-[#2a2435] mt-2 pt-4">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/gioi-thieu"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thi ệu
                </Link>
                <Link
                  href="/dang-ky-goi-tap"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng ký gói tập
                </Link>
              </nav>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 pt-4 border-t border-[#2a2435]">
                <div className="flex items-center gap-2 text-gray-300">
                  <User className="w-5 h-5" />
                  <span className="text-sm">Guest User</span>
                </div>
                <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white text-sm px-4 py-2 rounded-full w-full sm:w-auto">
                  Đăng Nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
