import api from "../api.js";

export const notificationService = {

  getNotifications: async () => {
    const res = await api.get("/notifications");
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await api.post(`/notifications/read/${id}`);
    return res.data;
  },

  markAllRead: async () => {
    const res = await api.post(`/notifications/read-all`);
    return res.data;
  }

};