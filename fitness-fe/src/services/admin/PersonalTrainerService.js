import api from "../../api.js";

export const getPersonalTrainers = (params) => {
  return api.get("/personal-trainers", { params });
};
export const deletedUser = (memberID) => {
  return api.put(`/deleted/${memberID}`);
};
export const deletedPT = (ptID) => {
  return api.put(`/deleted_pt/${ptID}`);
};
export const updatedUser = (memberID, data) => {
  return api.put(`/update/${memberID}`, data);
};
export const createdUser = (data) => {
  return api.post(`/personal-trainers`, data);
};
export const getMembers = (params) => {
  return api.get("/members", { params });
};
export const getPTActice = () => {
  return api.get("/all_pt");
};
export const getAllforPT = (ptId) => {
  return api.get(`/allMember/${ptId}`);
};
export const selectedPTForMember = (data) => {
  return api.post(`/ptclient`, data);
};
export const cancelPTForMember = (data) => {
  return api.put(`/cancel_pt`, data);
};
export const updatedPTForMember = (data) => {
  return api.put(`/change_pt`, data);
};
export const getTopPT = () => {
  return api.get("/session");
};
export const getMe = () => {
  return api.get(`/me`);
};
