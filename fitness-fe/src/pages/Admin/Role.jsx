import { useEffect, useState } from "react";
import { MoveRight } from "lucide-react";
import { getAllRoles } from "../../services/admin/Role.js";
import RolePermissionModal from "@/components/admin/RolePermissionModal.jsx";
import AddRoleModal from "@/components/admin/AddRoleModal.jsx";
// ================= MAIN PAGE =================
export default function RoleAccessPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [roleIdelected, setRoleIdSelected] = useState(null);
  const [openAdd, setOpenAdd] = useState(false);
  useEffect(() => {
    getAllRoles()
      .then((res) => setRoles(res.data.data))
      .finally(() => setLoading(false));
  }, []);
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="min-h-screen bg-purple-50 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-purple-800">Role & Access</h1>
        <p className="text-purple-500">Manage system roles and permissions</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Roles</h2>
          <button
            onClick={() => setOpenAdd(true)}
            className="
    relative
    flex items-center gap-2
    rounded-xl
    px-5 py-2.5
    font-semibold text-white
    transition-all duration-200 ease-out

    bg-gradient-to-r from-purple-600 to-indigo-600
    hover:from-purple-700 hover:to-indigo-700
    hover:scale-105 hover:-translate-y-[1px]
    hover:shadow-xl hover:shadow-purple-300/40

    active:scale-95 active:translate-y-0
  "
          >
            <span className="text-lg leading-none">＋</span>
            Add Role
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-hidden">
          <table className="w-full text-left">
            <thead className="bg-purple-50 text-gray-600">
              <tr>
                <th className="px-6 py-3">Role name</th>
                <th className="px-6 py-3">Created at</th>
                <th className="px-6 py-3">Updated at</th>
                <th className="px-6 py-3">Users</th>
                <th className="px-6 py-3">
                  <div className="flex justify-end">Action</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-center">
                    Loading...
                  </td>
                </tr>
              )}

              {!loading &&
                roles.map((role, id) => (
                  <tr
                    key={id}
                    className="border-t transition-all duration-200 hover:bg-purple-50/50 hover:translate-x-1"
                  >
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {role.name}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDateTime(role.created_at)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {formatDateTime(role.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700">
                        {role.users_count || 0}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4"
                      onClick={() => {
                        setOpen(true);
                        setRoleIdSelected(role.id);
                      }}
                    >
                      <div className="flex justify-end">
                        <MoveRight className="text-purple-600 hover:text-purple-800 cursor-pointer" />
                      </div>
                    </td>
                  </tr>
                ))}
              <RolePermissionModal
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
                roleId={roleIdelected}
                onDeleted={(deletedId) =>
                  setRoles((prev) => prev.filter((r) => r.id !== deletedId))
                }
              />
              <AddRoleModal
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onCreated={(newRole) => setRoles((prev) => [...prev, newRole])}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
