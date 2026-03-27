import {
  CircleUserRoundIcon,
  HouseIcon,
  MessageCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarIcon,
  TextAlignJustifyIcon,
  ArrowLeftFromLineIcon,
  LogOutIcon,
} from "lucide-react";
import { logout } from "../../storages/authSlice.js";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function SideBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const permissions = useSelector((state) => state.auth.permissions);
  const roles = useSelector((state) => state.auth.roles);
  const hasPermission = (code) => {
    return permissions?.includes(code);
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-r from-[#56228d] to-[#2a125e] text-white transition-all duration-300 ${collapsed ? "w-24" : "w-64"}`}
    >
      <div
        className={`p-4 ${!collapsed ? "flex" : "items-center w-max space-y-2"} gap-2`}
      >
        <div className="max-sm:w-6 h-3 sm:w-9 h-8 bg-purple-700 rounded-lg justify-center">
          <StarIcon
            className={`max-sm:size-3 ml-1 text-white size-4 fill-white md:ml-2.5 mt-1.5 ${collapsed ? "mr-2 " : "inline"}`}
          ></StarIcon>
        </div>
        <h2
          className={`max-sm:hidden text-xl font-bold ${collapsed ? "hidden" : "inline"}`}
        >
          Trang Admin
        </h2>
        <div
          className="bg-fuchsia-100 p-1 rounded-lg max-sm:hidden h-6 sm:h-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          <TextAlignJustifyIcon className="max-sm:size-3 text-fuchsia-500 md:size-5 cursor-pointer"></TextAlignJustifyIcon>
        </div>
      </div>
      <nav className="mt-4 border-t border-gray-300 px-2">
        <ul className="mt-2 space-y-5">
          <NavLink
            to="/admin/"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                            ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
            }
          >
            <HouseIcon className="text-white inline-block mr-2 size-5"></HouseIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Trang tổng quan
            </span>
          </NavLink>
          {hasPermission("user.read") && (
            <NavLink
              to="/admin/user"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                            ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <CircleUserRoundIcon className="mr-2 size-5" />
              {!collapsed && <span className="text-lg">Người dùng</span>}
            </NavLink>
          )}
          {hasPermission("package.read") && (
            <NavLink
              to="/admin/packages"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                            ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <PackageIcon className="text-white inline-block mr-2 size-5"></PackageIcon>
              <span
                className={`${
                  collapsed ? "hidden" : "inline"
                } max-sm:hidden text-lg`}
              >
                Gói tập
              </span>
            </NavLink>
          )}
          {hasPermission("message_admin.read") && (
            <NavLink
              to="/admin/message"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                            ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <MessageCircleIcon className=" text-white inline-block mr-2 size-5"></MessageCircleIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Tin nhắn
              </span>
            </NavLink>
          )}

          {hasPermission("invoice.read") && (
            <NavLink
              to="/admin/order"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                            ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <ShoppingCartIcon className=" text-white inline-block mr-2 size-5"></ShoppingCartIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Đơn hàng
              </span>
            </NavLink>
          )}
          {hasPermission("permission.read") && (
            <NavLink
              to="/admin/role"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                                  hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                                  ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <ShieldCheckIcon className=" text-white inline-block mr-2 size-5"></ShieldCheckIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Phân quyền
              </span>
            </NavLink>
          )}
          {roles.includes("Member") && (
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                              hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1
                              ${isActive ? "bg-gradient-to-r from-[#56228d] to-[#dfd2fa]" : ""}`
              }
            >
              <ArrowLeftFromLineIcon className=" text-white inline-block mr-2 size-5"></ArrowLeftFromLineIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Trang hội viên
              </span>
            </NavLink>
          )}
          <NavLink
            className="flex items-center px-4 py-2 rounded-md cursor-pointer transition hover:bg-gradient-to-r from-[#56228d] to-[#dfd2fa] hover:translate-x-1"
            onClick={handleLogout}
          >
            <LogOutIcon className="text-white inline-block mr-2 size-5"></LogOutIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Đăng xuất
            </span>
          </NavLink>
        </ul>
      </nav>
    </div>
  );
}
