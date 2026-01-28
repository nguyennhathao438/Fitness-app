import api from "../../api";

/**
 * =========================
 * PT – SCHEDULE SERVICES
 * =========================
 */

// Lấy toàn bộ lịch của PT (đang login)
export const getMySchedules = (params = {}) => {
  // params ví dụ: { week: '2026-01-22' }
  return api.get("/pt/schedules", { params });
};

// Tạo lịch mới
export const createSchedule = (data) => {
  return api.post("/pt/schedules", {
    day_of_week: Number(data.day_of_week),
    start_time: data.start_time,
    end_time: data.end_time,
  });
};

// Xem danh sách member đã book 1 slot
export const getScheduleMembers = (scheduleId) => {
  return api.get(`/pt/schedules/${scheduleId}/members`);
};

// Khoá slot (không cho book thêm)
export const lockSchedule = (scheduleId) => {
  return api.post(`/pt/schedules/${scheduleId}/lock`);
};

// (Optional) Mở khoá slot
export const unlockSchedule = (scheduleId) => {
  return api.post(`/pt/schedules/${scheduleId}/unlock`);
};
