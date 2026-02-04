import {
  CircleUserRoundIcon,
  HouseIcon,
  MessageCircleIcon,
  PackageIcon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  StarIcon,
  TextAlignJustifyIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function SideBar({ collapsed, setCollapsed }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ${collapsed ? "w-24" : "w-64"}`}
    >
      <div className="p-4 flex gap-2">
        <div className="max-sm:w-6 h-3 sm:w-9 h-8 bg-purple-700 rounded-lg justify-center">
          <StarIcon
            className={`max-sm:size-3 ml-1 text-white size-4 fill-white md:ml-2.5 mt-1.5 ${collapsed ? "mr-2" : "inline"}`}
          ></StarIcon>
        </div>
        <h2
          className={`max-sm:hidden text-xl font-bold ${collapsed ? "hidden" : "inline"}`}
        >
          Admin Panel
        </h2>
        <div
          className="bg-fuchsia-100 p-1 rounded-lg max-sm:hidden h-6 sm:h-8"
          onClick={() => setCollapsed(!collapsed)}
        >
          <TextAlignJustifyIcon className="max-sm:size-3 text-fuchsia-500 md:size-5 cursor-pointer"></TextAlignJustifyIcon>
        </div>
      </div>
      <nav className="mt-4 border-t border-gray-300">
        <ul className="mt-2 space-y-5">
          <li className="px-4 py-2 cursor-pointer rounded-md hover:bg-purple-500">
            <HouseIcon className="text-white inline-block mr-2 size-5"></HouseIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Dashboard
            </span>
          </li>
          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md cursor-pointer transition
                            hover:bg-purple-500
                            ${isActive ? "bg-purple-600" : ""}`
            }
          >
            <CircleUserRoundIcon className="mr-2 size-5" />
            {!collapsed && <span className="text-lg">Users</span>}
          </NavLink>
          <li className="px-4 py-2 cursor-pointer rounded-md hover:bg-purple-500">
            <PackageIcon className="text-white inline-block mr-2 size-5"></PackageIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Packages
            </span>
          </li>
          <li className="px-4 py-2 cursor-pointer rounded-md hover:bg-purple-500">
            <MessageCircleIcon className=" text-white inline-block mr-2 size-5"></MessageCircleIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Messages
            </span>
          </li>
          <li className="px-4 py-2 cursor-pointer rounded-md hover:bg-purple-500">
            <ShoppingCartIcon className=" text-white inline-block mr-2 size-5"></ShoppingCartIcon>
            <span
              className={`${collapsed ? "hidden" : "inline"} max-sm:hidden text-lg`}
            >
              Orders
            </span>
          </li>
          <NavLink
            to="/admin/role"
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
              RoleSet
            </span>
          </NavLink>

          <NavLink
            to="/admin/exercise"
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
              Exercise
            </span>
          </NavLink>

          <NavLink
            to="/admin/muscle"
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
              MuscleGroup
            </span>
          </NavLink>
        </ul>
      </nav>
    </div>
  );
}
