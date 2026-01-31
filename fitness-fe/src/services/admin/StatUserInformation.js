import api from "../../api.js";

export const getGenderUser = (params) => {
    return api.get("/genderStat",{ params });
};
export const getAgeUser = () => {
    return api.get("/BirthStat");
}