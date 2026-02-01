import api from "../../api.js";

export const getPersonalTrainers = (params) => {
    return api.get("/personal-trainers",{ params });
};
export const deletedUser = (memberID) => {
    return api.put(`/deleted/${memberID}`);
}
export const updatedUser = (memberID,data) => {
    return api.put(`/update/${memberID}`,data);
}
export const createdUser = (data) => {
    return api.post(`/personal-trainers`,data);
}