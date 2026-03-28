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
    quantity: data.quantity ?? null,
    unit: data.unit ?? null,
    meal_date: data.meal_date,
    meal_time: data.meal_time || null,
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
    meals: (data.meals || []).map((meal) => ({
      meal_name: meal.meal_name,
      calories: meal.calories,
      quantity: meal.quantity ?? null,
      unit: meal.unit ?? null,
      meal_time: meal.meal_time || null,
      image_url: meal.image_url || null,
      source: meal.source || "manual",
      note: meal.note || "",
    })),
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
 */
export const getMyProfile = () => {
  return api.get("/auth/me");
};

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

/**
 * =========================
 * NUTRITION STATISTICS
 * =========================
 */

export const getNutritionSummary = (params = {}) => {
  return api.get("/calories/summary", {
    params: {
      member_id: params.member_id,
      from: params.from,
      to: params.to,
    },
  });
};

export const getNutritionChart = (params = {}) => {
  return api.get("/calories/chart", {
    params: {
      member_id: params.member_id,
      from: params.from,
      to: params.to,
      type: params.type || "day",
    },
  });
};

export const getNutritionSourceStats = (params = {}) => {
  return api.get("/calories/source-stats", {
    params: {
      member_id: params.member_id,
      from: params.from,
      to: params.to,
    },
  });
};

export const getNutritionTopMeals = (params = {}) => {
  return api.get("/calories/top-meals", {
    params: {
      member_id: params.member_id,
      from: params.from,
      to: params.to,
      limit: params.limit || 10,
    },
  });
};