import {
  CircleUserRoundIcon,
  HouseIcon,
  MessageCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarIcon,
  TextAlignJustifyIcon,
  LogOutIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../storages/authSlice.js";
import { useSelector } from "react-redux";
export default function SideBar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const permissions = useSelector((state) => state.auth.permissions);
  const hasPermission = (code) => {
    return permissions?.includes(code);
  };
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white transition-all duration-300 ${collapsed ? "w-24" : "w-64"}`}
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
          PT Panel
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
            to="/pt"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500 hover:translate-x-1
                            ${isActive ? "bg-purple-600" : ""}`
            }
          >
            <HouseIcon className="text-white inline-block mr-2 size-5"></HouseIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Trang chủ
            </span>
          </NavLink>
          {hasPermission("member.read") && (
            <NavLink
              to="/pt/member"
              end
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500 hover:translate-x-1
                            ${isActive ? "bg-purple-600" : ""}`
              }
            >
              <HouseIcon className="text-white inline-block mr-2 size-5"></HouseIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Member
              </span>
            </NavLink>
          )}

          <NavLink
            to="/pt/schedules/create"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500 hover:translate-x-1
                            ${isActive ? "bg-purple-600" : ""}`
            }
          >
            <CircleUserRoundIcon className="mr-2 size-5" />
            {!collapsed && <span className="text-lg">Lịch tập</span>}
          </NavLink>
          {/* <NavLink
  to="/pt/schedules/create"
  className={({ isActive }) =>
    `flex items-center px-4 py-2 rounded-md cursor-pointer transition
     hover:bg-purple-500 hover:translate-x-1
     ${isActive ? "bg-purple-600" : ""}`
  }
>
  <Plus className="text-white inline-block mr-2 size-5" />
  <span
    className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
  >
    Schedules
  </span>
</NavLink> */}
          {hasPermission("message_pt.read") && (
            <NavLink
              to="/pt/message-pt"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500
                            ${isActive ? "bg-purple-600" : ""}`
              }
            >
              <MessageCircleIcon className=" text-white inline-block mr-2 size-5"></MessageCircleIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Nhắn tin
              </span>
            </NavLink>
          )}
          {hasPermission("exercise.read") && (
            <NavLink
              to="/pt/exercise"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500
                            ${isActive ? "bg-purple-600" : ""}`
              }
            >
              <ShieldCheckIcon className=" text-white inline-block mr-2 size-5"></ShieldCheckIcon>
              <span
                className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
              >
                Bài tập
              </span>
            </NavLink>
          )}

          <NavLink
            className="flex items-center px-4 py-2 rounded-md cursor-pointer transition hover:bg-purple-500"
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
