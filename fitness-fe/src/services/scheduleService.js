import api from "../api";

export const getAvailableSchedules = (ptId, dayOfWeek) => {
  return api.get(
    `/schedules/available?pt_id=${ptId}&day_of_week=${dayOfWeek}`
  );
};

export const bookSchedule = (scheduleId) => {
  return api.post(`/schedules/${scheduleId}/book`);
};

export const getMemberSchedules = () => {
  return api.get("/member/schedules");
};
