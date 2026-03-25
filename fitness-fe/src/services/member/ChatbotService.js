import api from "../../api";

export const sendMessageToChatbot = (data) => {
  return api.post(`/chatbot`, data);
};
