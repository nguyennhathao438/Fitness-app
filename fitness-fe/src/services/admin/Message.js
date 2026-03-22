import api from "../../api.js";

export const sendMessage = (receiverId, content) => {
    return api.post("/messages", {
        receiver_id: receiverId,
        content: content
    });
};
export const getMessages = (userId) => {
    return api.get(`/messages/${userId}`);
};
export const getPTListChat = (keyword) => {
    return api.get("/chatWithPt", {
        params: {
            keyword: keyword
        }
    });
}
export const getAdminAndMemberListChat = (keyword) => {
    return api.get(`/chatFromPt`, {
        params: {
            keyword: keyword
        }
    });
}
export const sendTyping = (receiverId, isTyping) => {
    return api.post("/messages/typing", {
        receiver_id: receiverId,
        is_typing: isTyping
    });
}