import api from "@/api";

export const createMuscleGroup = (data) => {
    return api.post("/muscle-groups", data)
};
export const getAllMuscleGroup = () => {
    return api.get("/muscle-groups")
}
export const updateMuscleGroup = (data) => {
    return api.put(`/muscle-groups/${data.id}`,data)
}