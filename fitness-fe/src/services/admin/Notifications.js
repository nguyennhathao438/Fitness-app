import api from "../../api.js"; 

export const getNotifications = () => {
    return api.get("/admin/notifications");
}
export const deleteNotification = (id) => {
    return api.delete(`/admin/notifications/${id}`);
}