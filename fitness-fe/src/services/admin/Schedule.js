import api from "../../api.js";

export const getScheduleOfPT = (ptId) => {
    return api.get(`/ScheduleOfPT/${ptId}`);
}
export const getScheduleOfMember = (memberId) => {
    return api.get(`/ScheduleOfMember/${memberId}`);
}