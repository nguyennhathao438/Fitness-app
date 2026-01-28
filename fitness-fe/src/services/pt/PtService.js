import api from "../../api.js";

export const getMembersOfPT = () => {
  return api.get("/pt/members");
};