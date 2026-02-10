import api from "../../api.js";

// --- API LOẠI GÓI (PACKAGE TYPES) ---
export const getPackageTypes = (params) => {
  return api.get("/package-types", { params }); 
};

export const createPackageType = (data) => {
  return api.post("/package-types", data);
};

export const updatePackageType = (id, data) => {
  return api.put(`/package-types/${id}`, data);
};

export const deletePackageType = (id) => {
  return api.delete(`/package-types/${id}`);
};

export const getAllServiceForForm = () => {
  return api.get("/services"); 
};

export const getAllServices = (params) => {
  return api.get("/services-manage", { params }); 
};

export const getServices = () => api.get("/services-manage");
export const createService = (data) => api.post("/services-manage", data);
export const updateService = (id, data) => api.put(`/services-manage/${id}`, data);
export const deleteService = (id) => api.delete(`/services-manage/${id}`);