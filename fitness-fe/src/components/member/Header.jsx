import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../storages/authSlice.js";
import defaultAvatar from "../../assets/default-avatar.jpg";
import { Bell, BellDot } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/notificationService";
export default function Header() {
  const navigate = useNavigate();
  const { member, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications();
    }
  }, [isAuthenticated]);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-[#000000] border-b border-[#2a2435] relative z-[1000]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                className="w-40 h-16"
                src="https://fight100.vn/wp-content/uploads/2024/02/logo.png"
                alt=""
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              <Link
                to=""
                className="text-gray-300 font-bold hover:text-white transition-colors text-md"
              >
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
                <Link
                  to="/pricing-packages"
                  className="text-gray-300 font-bold hover:text-white transition-colors text-md"
                >
                  Đăng ký gói tập
                </Link>
              )}

              <Link
                to="/bmi"
                className="text-gray-300 hover:text-white transition-colors font-bold text-md "
              >
                BMI
              </Link>
              {isAuthenticated && (
                <Link
                  to="/workout"
                  className="text-gray-300 hover:text-white transition-colors font-bold text-md "
                >
                  Workout
                </Link>
              )}
                  {isAuthenticated && (
                <Link
                  to="/CaloAI"
                  className="text-gray-300 hover:text-white transition-colors font-bold text-md "
                >
                  Dinh Dưỡng
                </Link>
              )}
            </nav>

            {/* Desktop Right Section */}
            <div className="hidden lg:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  {/* Notification */}
                  {isAuthenticated && (
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenNotification(!openNotification)}
                        className="relative p-2 rounded-full bg-gray-800 border-2 border-purple-400 text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                      >
                        {unreadCount > 0 ? (
                          <BellDot className="w-5 h-5 text-purple-400 animate-pulse" />
                        ) : (
                          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        )}

                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white px-1">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </button>

                      {openNotification && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenNotification(false)}
                          />

                          <div className="absolute right-0 mt-3 w-80 z-[2000] overflow-hidden bg-white rounded-[24px] shadow-xl shadow-slate-200/60 border border-slate-200">
                            {/* Header */}

                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                              <h3 className="font-bold text-slate-900">
                                Notifications
                              </h3>

                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-600 rounded-lg">
                                  {unreadCount} New
                                </span>

                                {unreadCount > 0 && (
                                  <button
                                    onClick={async () => {
                                      await notificationService.markAllRead();
                                      loadNotifications();
                                    }}
                                    className="text-xs text-purple-600 font-semibold hover:underline"
                                  >
                                    Mark all
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* List */}

                            <div className="max-h-[400px] overflow-y-auto">
                              {notifications.length > 0 ? (
                                notifications.slice(0, 5).map((noti) => {
                                  const isUnread = !noti.is_read;

                                  return (
                                    <div
                                      key={noti.id}
                                      onClick={async () => {
                                        await notificationService.markAsRead(
                                          noti.id,
                                        );
                                        loadNotifications();
                                        setOpenNotification(false);
                                      }}
                                      className={`px-6 py-4 border-b border-slate-50 transition-colors cursor-pointer
                    ${
                      isUnread
                        ? "bg-purple-50 hover:bg-purple-100"
                        : "bg-white hover:bg-slate-50"
                    }`}
                                    >
                                      <div className="flex gap-3">
                                        <div
                                          className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${
                                            isUnread
                                              ? "bg-purple-600"
                                              : "bg-slate-300"
                                          }`}
                                        />

                                        <div>
                                          <p
                                            className={`text-sm leading-snug ${
                                              isUnread
                                                ? "text-slate-900 font-semibold"
                                                : "text-slate-500"
                                            }`}
                                          >
                                            {noti.message || "New activity"}
                                          </p>

                                          <p className="text-xs text-slate-400 mt-1 font-medium">
                                            {new Date(
                                              noti.created_at,
                                            ).toLocaleString("vi-VN")}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className="text-center py-12 px-6">
                                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                  </div>

                                  <p className="text-slate-500 font-medium">
                                    No notifications yet
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Footer */}

                            <div className="p-3 bg-slate-50 border-t border-slate-100">
                              <Link
                                to="/notifications"
                                onClick={() => setOpenNotification(false)}
                                className="block w-full py-2 text-sm font-semibold text-slate-600 hover:text-purple-600 text-center transition-colors"
                              >
                                View all activity
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
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
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation - visible below lg (1024px) */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
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

                <Link
                  to="/bmi"
                  className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm py-2 px-3 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  BMI
                </Link>
                {isAuthenticated && (
                  <Link
                    to="/workout"
                    className="text-gray-300 hover:text-white hover:bg-gray-800 transition-colors text-sm py-2 px-3 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Workout
                  </Link>
                )}
              </nav>

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-[#2a2435]">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-3">
                      <img
                        src={member?.avatar || defaultAvatar}
                        className="w-9 h-9 rounded-full object-cover border-2 border-purple-400"
                      />
                      <span className="text-sm text-gray-200 font-medium">
                        {member?.name}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 bg-gray-600 text-white text-sm px-4 py-2.5 rounded-full"
                    >
                      <LogOut className="w-4 h-4" /> <span>Đăng Xuất</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-gray-300 px-3">
                      <User className="w-4 h-4" />{" "}
                      <span className="text-sm">Guest User</span>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-purple-600 text-white text-sm px-4 py-2.5 rounded-full text-center"
                    >
                      Đăng Nhập
                    </Link>
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
