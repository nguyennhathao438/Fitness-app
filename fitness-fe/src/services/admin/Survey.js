import api from "@/api";

export const getSurveyMember = () => {
    return api.get("/survey-member");
}