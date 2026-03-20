import api from "../../api.js";

// Lấy danh sách bài tập yêu thích
export const getFavoriteExercises = () => {
  return api.get("/favorite-exercises");
};

// Thêm bài tập vào yêu thích
export const createFavoriteExercise = (exercise_id) => {
  return api.post("/favorite-exercises", {
    exercise_id,
  });
};

// Xóa bài tập khỏi yêu thích
export const deleteFavoriteExercise = (exerciseId) => {
  return api.delete(`/favorite-exercises/${exerciseId}`);
};