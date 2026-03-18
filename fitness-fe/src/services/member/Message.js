import api from "@/api";
export const getPTChat = () => {
    return api.get("/getChatPt");
}