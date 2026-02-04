import { X, Edit } from "lucide-react";
import { useState } from "react";
import { ACTIONS, buildPermissionMatrix } from "../utils/permissionMatrix.js";
import { useRolePermissions } from "../../hooks/useRolePermissions.js";
import { updateRoles, deleteRole } from "../../services/admin/Role.js";
import { toast } from "react-toastify";
import { confirmDelete } from "../utils/confirmDelete.js";
export default function RolePermissionModal({
  open,
  onClose,
  roleId,
  onDeleted,
}) {
  const {
    permissionRows,
    roleDetail,
    selectedPermissionIds,
    setSelectedPermissionIds,
    editingRoleData,
    setEditingRoleData,
    setRoleDetail,
    reset,
  } = useRolePermissions(open, roleId);

  const [loading, setLoading] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  if (!open) return null;

  const rows = buildPermissionMatrix(permissionRows);

  const handleClose = () => {
    reset();
    setIsEditingInfo(false);
    onClose();
  };

  const handleStartEdit = () => setIsEditingInfo(true);

  const handleCancelEdit = () => {
    setIsEditingInfo(false);
    if (roleDetail) {
      setEditingRoleData({
        name: roleDetail.name,
        description: roleDetail.description,
      });
    }
  };

  const handleInfoChange = (field, value) => {
    setEditingRoleData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionToggle = (id) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateRoles(roleId, {
        name: editingRoleData.name,
        description: editingRoleData.description,
        permissions: selectedPermissionIds,
      });

      toast.success("Cập nhật role thành công");

      setRoleDetail((prev) => ({
        ...prev,
        name: editingRoleData.name,
        description: editingRoleData.description,
      }));
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi kết nối sever");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete({
      title: "Xóa role?",
      text: "Role sẽ bị xóa vĩnh viễn nếu không có user sở hữu",
    });

    if (!ok) return;

    setLoading(true);
    try {
      await deleteRole(roleId);
      toast.success("Xóa role thành công");
      if (typeof onDeleted === "function") onDeleted(roleId);
      reset();
      onClose();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Lỗi khi xóa role");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      {/* modal */}
      <div className="relative w-[900px] rounded-xl bg-white shadow-lg">
        {/* header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex-1">
            {isEditingInfo ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editingRoleData.name}
                  onChange={(e) => handleInfoChange("name", e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-xl font-semibold"
                />
                <textarea
                  value={editingRoleData.description}
                  onChange={(e) =>
                    handleInfoChange("description", e.target.value)
                  }
                  className="w-full rounded-lg border px-3 py-2 text-sm text-gray-500"
                  rows="2"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">
                  {roleDetail?.name || "Loading..."}
                </h2>
                <p className="text-sm text-gray-500">
                  {roleDetail?.description || ""}
                </p>
              </div>
            )}
          </div>

          {/* edit / cancel control placed at top-right */}
          {isEditingInfo ? (
            <button
              onClick={handleCancelEdit}
              className="ml-4 rounded p-1 hover:bg-gray-100 text-gray-500"
              aria-label="Cancel edit"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <button
              onClick={handleStartEdit}
              className="ml-4 rounded p-1 hover:bg-gray-100 text-gray-500"
              aria-label="Edit role"
            >
              <Edit className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* table */}
        <div className="max-h-[420px] overflow-y-auto px-6 py-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 text-left">Permission</th>
                <th className="py-3 text-center">Create</th>
                <th className="py-3 text-center">Read</th>
                <th className="py-3 text-center">Update</th>
                <th className="py-3 text-center">Delete</th>
              </tr>
            </thead>

            <tbody>
              {permissionRows.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Loading permissions...
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.name}
                    className="border-b last:border-0 hover:bg-purple-50/40"
                  >
                    <td className="py-4 font-medium text-gray-800">
                      {row.name}
                    </td>

                    {ACTIONS.map((action) => {
                      const permission = row[action];
                      const id = permission?.id;
                      const checked = id && selectedPermissionIds.includes(id);

                      return (
                        <td key={action} className="py-4 text-center">
                          {id && (
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handlePermissionToggle(id)}
                              className="h-5 w-5 accent-purple-600 cursor-pointer"
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4 bg-white/80 backdrop-blur">
          {/* Cancel */}
          <button
            onClick={handleClose}
            className="
      rounded-xl
      border border-gray-300
      bg-white
      px-5 py-2
      text-gray-700 font-medium
      transition-all duration-200 ease-out
      hover:bg-gray-50 hover:scale-105 hover:-translate-y-[1px]
      hover:shadow-md
      active:scale-95 active:translate-y-0
    "
          >
            Cancel
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="
      rounded-xl
      border border-red-200
      bg-gradient-to-r from-red-50 to-rose-50
      px-5 py-2
      text-red-600 font-medium
      transition-all duration-200 ease-out
      hover:from-red-100 hover:to-rose-100
      hover:scale-105 hover:-translate-y-[1px]
      hover:shadow-lg hover:shadow-red-200/40
      active:scale-95 active:translate-y-0
      disabled:opacity-50 disabled:cursor-not-allowed
      disabled:hover:scale-100 disabled:hover:shadow-none
    "
          >
            Delete
          </button>

          {/* Update */}
          <button
            onClick={handleUpdate}
            disabled={loading}
            className={`
      relative
      flex items-center justify-center gap-2
      rounded-xl px-6 py-2.5
      font-semibold text-white
      transition-all duration-200 ease-out
      active:scale-95
      ${
        loading
          ? "bg-purple-400 cursor-not-allowed"
          : `
            bg-gradient-to-r from-purple-600 to-indigo-600
            hover:from-purple-700 hover:to-indigo-700
            hover:scale-105 hover:-translate-y-[1px]
            hover:shadow-xl hover:shadow-purple-300/40
          `
      }
    `}
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
