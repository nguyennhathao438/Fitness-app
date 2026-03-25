import api from "@/api";

// Lấy workout của ngày hôm nay
export const getWorkoutHistoryToday = () => {
  return api.get("/workout-history/today");
};

// Lấy tất cả workout history của user
export const getWorkoutHistories = () => {
  return api.get("/workout-history");
};

export const getLatestWorkoutHistory = () => {
  return api.get("/workout-history/latest");
};

// Lấy workout history theo id
export const getWorkoutHistoryById = (id) => {
  return api.get(`/workout-history/${id}`);
};

// Tạo workout mới (khi bấm bắt đầu tập)
export const createWorkoutHistory = (data) => {
  return api.post("/workout-history", data);
};

// Cập nhật workout (ví dụ % hoàn thành hoặc trạng thái)
export const updateWorkoutHistory = (id, data) => {
  return api.put(`/workout-history/${id}`, data);
};

// Thêm bài tập vào workout
export const addExerciseToWorkout = (workoutId, data) => {
  return api.post(`/workout-history/${workoutId}/exercises`, data);
};

// Cập nhật trạng thái bài tập
export const updateWorkoutExercise = (workoutExerciseId, data) => {
  return api.put(`/workout-exercises/${workoutExerciseId}`, data);
};

// Xóa bài tập khỏi workout
export const removeWorkoutExercise = (workoutExerciseId) => {
  return api.delete(`/workout-exercises/${workoutExerciseId}`);
};

// Lấy chi tiết bài tập của workout
export const getWorkoutHistoryDetail = (workoutId) => {
  return api.get(`/workout-history/${workoutId}`);
};