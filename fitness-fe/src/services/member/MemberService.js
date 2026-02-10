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