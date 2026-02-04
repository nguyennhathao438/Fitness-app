import api from "@/api";

export const getAllRoles = () => {
  return api.get("/roles");
};
export const getRoleById = (roleId) => {
  return api.get(`/roles/${roleId}`);
};

export const getAllPermissions = () => {
  return api.get("/permissions");
};
export const updateRoles = (roleId, payload) => {
  return api.put(`/roles/${roleId}`, payload);
};
export const createRole = (data) => {
  return api.post("/roles", data);
};
export const deleteRole = (roleId) => {
  return api.delete(`/roles/${roleId}`);
};
