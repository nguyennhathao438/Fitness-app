import api from "../api.js";


/**
 * =========================
 * FOOD AI
 * =========================
 */

// Nhận diện món ăn từ ảnh
// truyền vào FormData, field phải là "image"
export const predictFoodFromImage = (formData) => {
  return api.post("/food/predict", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * =========================
 * NUTRITION / CALORIES
 * =========================
 */

// Lấy danh sách món ăn theo ngày
// ví dụ: getCaloriesByDay("2026-03-25", 1)
export const getCaloriesByDay = (date, memberId) => {
  return api.get(`/calories/day/${date}`, {
    params: {
      member_id: memberId,
    },
  });
};

// Thêm 1 món ăn vào nhật ký calo
export const addMeal = (data) => {
  return api.post("/calories/add-meal", {
    member_id: data.member_id,
    meal_name: data.meal_name,
    calories: data.calories,
    meal_date: data.meal_date,
    meal_time: data.meal_time,
    image_url: data.image_url || null,
    source: data.source || "manual",
    note: data.note || "",
  });
};

// Thêm nhiều món ăn cùng lúc
export const addManyMeals = (data) => {
  return api.post("/calories/add-many-meals", {
    member_id: data.member_id,
    meal_date: data.meal_date,
    meals: data.meals || [],
  });
};


// Lấy lịch sử calo theo khoảng ngày
export const getCaloriesHistory = (memberId, from, to) => {
  return api.get("/calories/history", {
    params: {
      member_id: memberId,
      from,
      to,
    },
  });
};

// Xóa 1 món ăn khỏi nhật ký
export const deleteMeal = (id) => {
  return api.delete(`/calories/meal/${id}`);
};

/**
 * =========================
 * CURRENT ACCOUNT / PROFILE
 * =========================
 * Ưu tiên dùng API profile hiện có của project.
 * Nếu project bạn đã có service auth/profile riêng rồi,
 * có thể bỏ hàm này và import từ service có sẵn.
 */
export const getMyProfile = () => {
  return api.get("/auth/me");
};

/**
 * Helper: map response account về format chuẩn frontend cần dùng
 * response.data.member.id
 * response.data.member.name
 * response.data.member.email
 * response.data.member.phone
 * response.data.member.avatar
 */
export const mapCurrentUserFromProfile = (response) => {
  const member = response?.data?.member || null;

  if (!member) return null;

  return {
    id: member.id ?? null,
    name: member.name ?? "",
    email: member.email ?? "",
    phone: member.phone ?? "",
    avatar: member.avatar ?? null,
    roles: response?.data?.roles || [],
    permissions: response?.data?.permissions || [],
    service_ids: response?.data?.service_ids || [],
    valid_until: response?.data?.valid_until ?? null,
  };
};
export const getRecentMeals = (memberId, limit = 8) => {
  return api.get("/calories/recent", {
    params: {
      member_id: memberId,
      limit,
    },
  });
};