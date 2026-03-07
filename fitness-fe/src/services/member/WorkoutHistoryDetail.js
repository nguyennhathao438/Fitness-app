import api from "../../api.js";

// Lấy tất cả chi tiết của workout theo workoutId
export const getWorkoutHistoryDetails = (workoutHistoryId) => {
  return api.get(`/workout-history-details/history/${workoutHistoryId}`);
};

// Lấy chi tiết 1 bài tập trong workout
export const getWorkoutHistoryDetailById = (id) => {
  return api.get(`/workout-history-details/${id}`);
};

// Tạo chi tiết bài tập cho workout
export const createWorkoutHistoryDetail = (data) => {
  return api.post("/workout-history-details", data);
};

// Cập nhật chi tiết bài tập (set, rep, status, %)
export const updateWorkoutHistoryDetail = (id, data) => {
  return api.put(`/workout-history-details/${id}`, data);
};

//lấy tất cả chi tiết của workout
export const getAllWorkoutHistoryDetails = () => {
  return api.get("/workout-history-details");
};