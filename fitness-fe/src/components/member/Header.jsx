import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../storages/authSlice.js";
import defaultAvatar from "../../assets/default-avatar.jpg";

export default function Header() {
  const { member, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#000000] border-b border-[#2a2435]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="shrink-0">
              <img className="w-40 h-16" src="https://fight100.vn/wp-content/uploads/2024/02/logo.png" alt="" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link to="" className="text-gray-300 font-bold hover:text-white transition-colors text-md">
                Giới thiệu
              </Link>

              {/* LOGIC THAY ĐỔI MENU */}
              {isAuthenticated ? (
                <Link 
                  to="/upgrade" 
                  className="text-gray-300 font-bold hover:text-white transition-colors text-md"
                >
                  Nâng cấp & Gia hạn
                </Link>
              ) : (
                <Link to="/pricing-packages" className="text-gray-300 font-bold hover:text-white transition-colors text-md">
                  Đăng ký gói tập
                </Link>
              )}

              <Link to="/bmi" className="text-gray-300 hover:text-white transition-colors font-bold text-md ">
                BMI
              </Link>
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3">
                    {member?.avatar ? (
                      <Link to="/profile">
                        <img
                          src={member.avatar || defaultAvatar}
                          alt="avatar"
                          className="w-9 h-9 rounded-full object-cover border-2 border-purple-400"
                        />
                      </Link>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center border-2 border-purple-400">
                        <Link to="/profile">
                          <User className="w-5 h-5 text-gray-300" />
                        </Link>
                      </div>
                    )}
                    <span className="text-sm text-gray-200 font-medium">
                      {member?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-500 text-white text-sm px-5 py-2 rounded-full transition-all duration-300 border border-gray-500 hover:border-gray-400"
                  >
                    Đăng Xuất
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Guest User</span>
                  </div>
                  <Link
                    to="/login"
                    className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-5 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Đăng Nhập
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="pb-4 border-t border-[#2a2435] mt-2 pt-4">
              <nav className="flex flex-col gap-2">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm py-2 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Giới thiệu
                </Link>

                {/*  LOGIC THAY ĐỔI MENU (MOBILE) */}
                {isAuthenticated ? (
                   <Link
                   to="/upgrade"
                   className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm py-2 px-3 rounded-lg"
                   onClick={() => setIsMenuOpen(false)}
                 >
                    Nâng cấp & Gia hạn
                 </Link>
                ) : (
                  <Link
                    to="/pricing-packages"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm py-2 px-3 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký gói tập
                  </Link>
                )}
              </nav>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#2a2435]">
                 {isAuthenticated ? (
                    <>
                        <div className="flex items-center gap-3 px-3">
                             <img src={member?.avatar || defaultAvatar} className="w-9 h-9 rounded-full object-cover border-2 border-purple-400"/>
                             <span className="text-sm text-gray-200 font-medium">{member?.name}</span>
                        </div>
                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center justify-center gap-2 bg-gray-600 text-white text-sm px-4 py-2.5 rounded-full">
                            <LogOut className="w-4 h-4" /> <span>Đăng Xuất</span>
                        </button>
                    </>
                 ) : (
                    <>
                        <div className="flex items-center gap-2 text-gray-300 px-3">
                            <User className="w-4 h-4" /> <span className="text-sm">Guest User</span>
                        </div>
                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-purple-600 text-white text-sm px-4 py-2.5 rounded-full text-center">Đăng Nhập</Link>
                    </>
                 )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}