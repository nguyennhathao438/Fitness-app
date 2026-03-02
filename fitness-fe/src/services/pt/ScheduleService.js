import api from "../../api.js";

/**
 * =========================
 * PT – SCHEDULE
 * =========================
 */

// PT xem lịch của CHÍNH MÌNH
export const getMyPTSchedules = () => {
  return api.get("/pt/schedules");
};

// PT tạo lịch
export const createSchedule = (data) => {
  return api.post("/pt/schedule", {
    date: data.date,
    start_time: data.start_time,
    end_time: data.end_time,
  });
};
export const updateSchedule = (id, data) => {
  const payload = {};

  if (data.date !== undefined) payload.date = data.date;
  if (data.start_time !== undefined) payload.start_time = data.start_time;
  if (data.end_time !== undefined) payload.end_time = data.end_time;
  if (data.title !== undefined) payload.title = data.title;

  return api.put(`/pt/schedule/${id}`, payload);
};

// PT xoá lịch
export const deleteSchedule = (id) => {
  return api.delete(`/pt/schedule/${id}`);
};

/**
 * =========================
 * MEMBER – VIEW / BOOK
 * =========================
 */

// Member xem lịch của 1 PT (CẦN ptId)
export const getAvailableSchedules = (ptId) => {
  return api.get(`/pt/${ptId}/schedules`);
};

// Member book lịch
export const bookSchedule = (scheduleId) => {
  return api.post(`/schedules/${scheduleId}/book`);
};

/**
 * =========================
 * PT – VIEW MEMBERS OF SLOT
 * =========================
 */

// PT xem danh sách member đã book slot
export const getScheduleMembers = (scheduleId) => {
  return api.get(`/pt/schedules/${scheduleId}/members`);
};

/**
 * =========================
 * MEMBER – MY SCHEDULES
 * =========================
 */

// Member xem lịch của mình
export const getMySchedules = () => {
  return api.get("/member/schedules");
};

/**
 * PT lấy lịch của mình
 */
export const getSchedules = () => {
  return api.get("/pt/schedules");
};

