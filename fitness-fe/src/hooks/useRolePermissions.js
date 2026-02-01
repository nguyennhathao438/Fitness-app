import { useEffect, useState } from "react";
import { getAllPermissions, getRoleById } from "@/services/admin/Role";

export function useRolePermissions(open, roleId) {
  const [permissionRows, setPermissionRows] = useState([]);
  const [roleDetail, setRoleDetail] = useState(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [editingRoleData, setEditingRoleData] = useState({
    name: "",
    description: "",
  });
  useEffect(() => {
    if (!open || !roleId) return;

    Promise.all([getAllPermissions(), getRoleById(roleId)]).then(
      ([perRes, roleRes]) => {
        setPermissionRows(perRes.data.data);
        setRoleDetail(roleRes.data.data);
        setEditingRoleData({
          name: roleRes.data.data.name,
          description: roleRes.data.data.description,
        });
        const permissionCodes = roleRes.data.data.permissions || [];

        // Convert codes to IDs
        const ids = permissionCodes
          .map((code) => {
            const permission = perRes.data.data.find((p) => p.code === code);
            return permission?.id;
          })
          .filter(Boolean);
        setSelectedPermissionIds(ids);
      },
    );
  }, [open, roleId]);

  const reset = () => {
    setPermissionRows([]);
    setRoleDetail(null);
    setSelectedPermissionIds([]);
    setEditingRoleData({ name: "", description: "" });
  };

  return {
    permissionRows,
    roleDetail,
    selectedPermissionIds,
    setSelectedPermissionIds,
    editingRoleData,
    setEditingRoleData,
    setRoleDetail,
    setPermissionRows,
    reset,
  };
}
