import api from "../../api.js"; 

export const getPackages = (params) => {
  return api.get("/packages", { params }); 
};

export const getPackageById = (id) => {
  return api.get(`/packages/${id}`);
};

export const createPackage = (data) => {
  return api.post("/packages", data);
};

export const updatePackage = (id, data) => {
  return api.put(`/packages/${id}`, data);
};

export const deletePackage = (id) => {
  return api.delete(`/packages/${id}`);
};

export const getPackageTypes = () => {
  return api.get("/package-type");
};

export const getPackageStats = () => {
  return api.get("/packages/stats");
};