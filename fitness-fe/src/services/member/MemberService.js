import api from "../../api.js";

export const register = (data) => {
  return api.post(`/register`, data);
};
export const loginService = (data) => {
  return api.post(`/login`, data);
};
