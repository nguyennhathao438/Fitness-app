import api from "../../api.js";

export const register = (data) => {
  return api.post(`/register`, data);
};
export const loginService = (data) => {
  return api.post(`/login`, data);
};
export const updateProfile = (data) => {
  return api.put(`/profile`, data);
};
export const submitSurvey = async (surveyData) => {
  const payload = {
    target_type: surveyData.targetType,
    has_trained: surveyData.hasTrained,
    training_times: surveyData.selectedDays.map((item) => ({
      day_of_week: item.day,
      time_slot: item.time,
    })),
  };

  return await api.post("/surveys", payload);
};
export const createBodyMetric = (data) => {
  return api.post("/body-metrics", data);
};
export const checkEmail = (email) => {
  return api.post("/check-email", { email });
};
export const getBodyMetric = () => {
  return api.get("/body-metrics");
};
export const getLatestBodyMetric = () => {
  return api.get("/body-metrics/latest");
};
export const changePassword = (data) => {
  return api.put("change-password", data);
};
export const upgradePackage = (data) => {
  return api.post("/member/upgrade", data);
};
export const getMyInfo = () => {
  return api.get("/me");
};

// ===== PT =====
export const getMyPT = () => {
  return api.get("/member/my-pt");
};

export const getPTList = () => {
  return api.get("/member/pts");
};

export const choosePT = (pt_id) => {
  return api.post("/member/choose-pt", { pt_id });
};

// ===== SCHEDULE =====
export const getMemberSchedules = (start, end) => {
  return api.get("/member/schedules", {
    params: { start, end },
  });
};

export const registerSchedule = (scheduleId) => {
  return api.post(`/member/register/${scheduleId}`);
};

export const getMySchedules = () => {
  return api.get("/member/my-schedules");
};

export const cancelMySchedule = (scheduleId) => {
  return api.delete(`/member/${scheduleId}/cancel`);
};
