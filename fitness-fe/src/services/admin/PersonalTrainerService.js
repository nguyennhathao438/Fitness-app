import api from "../../api.js";

export const getPersonalTrainers = (params) => {
    return api.get("/personal-trainers",{ params });
};
export const deletedUser = (memberID) => {
    return api.put(`/deleted/${memberID}`);
}
export const updatedUser = (memberID, formData) => {
  return api.put(`/update/${memberID}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const createdUser = (data) => {
    return api.post(`/personal-trainers`,data);
}