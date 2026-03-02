import api from "../../api.js";

export const getPTMembers = () => {
  return api.get("/pt/members");
};