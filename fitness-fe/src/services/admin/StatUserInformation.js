import api from "../../api.js";

export const getGenderUser = (params) => {
    return api.get("/genderStat",{ params });
};
export const getAgeUser = () => {
    return api.get("/BirthStat");
}
export const getMemberThisMonth = () => {
    return api.get("/member-thismonth");
}
export const getUserChart = (params) => {
    return api.get("/userchart",{params});
}