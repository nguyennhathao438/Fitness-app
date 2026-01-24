import api from "../../api";

export const sendEmailForPasswordReset = (data) => {
  return api.post(`/send-otp`, data);
};
export const verifyOtp = (data) => {
  return api.post(`/verify-otp`, data);
};
export const resetPassword = (data) => {
  return api.post(`/reset-password`, data);
};
