import api from "@/api";

export const createExercise = (data) => {
    return api.post("/exercises", data)
};
export const getAllExcercise = () => {
    return api.get("/exercises")
}
export const getExercisesByMuscleGroup = (muscleGroupId) => {
  return api.get(`/exercises/by-muscle-group/${muscleGroupId}`);
};
export const updateExercise = (id, data) => {
  return api.put(`/exercises/${id}`, data);
};