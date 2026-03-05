import api from "@/api";

export const createExercise = (data) => {
  return api.post("/exercises", data);
};
export const getAllExcercise = () => {
  return api.get("/exercises");
};
export const getExercisesByMuscleGroup = (muscleGroupId) => {
  return api.get(`/exercises/by-muscle-group/${muscleGroupId}`);
};
export const updateExercise = (id, data) => {
  return api.put(`/exercises/${id}`, data);
};
export const getExercises = (params = {}) => {
  return api.get("/exercises", {
    params: {
      muscles: params.muscles || "",
      search: params.search || "",
      page: params.page || 1,
      per_page: params.per_page || 8,
    },
  });
};
