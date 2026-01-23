import api from "../../api.js";

export const register = (data) => {
  return api.post(`/register`, data);
};
