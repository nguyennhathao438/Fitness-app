import api from "../../api.js";

export const getPTMembers = () => {
  return api.get("/pt/members");
};
export const getMemberDetail = (id) => {
  return api.get(`/pt/members/${id}`);
};