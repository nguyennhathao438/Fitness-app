
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  predictFoodFromImage,
  getCaloriesByDay,
  addMeal,
  addManyMeals,
  getRecentMeals,
  getCaloriesHistory,
  deleteMeal,
} from "../../services/calo";
import {
  FOOD_CALORIES_MAP,
  getDefaultCaloriesByLabel,
  getDisplayFoodName,
} from "../../services/foodCaloriesMap";
/**
 * =========================
 * HELPERS
 * =========================
 */

const mapReduxAuthToUser = (authData) => {
  const member = authData?.member;
  if (!member?.id) return null;

  return {
    id: member.id,
    name: member.name || "",
    email: member.email || "",
    phone: member.phone || "",
    avatar: member.avatar || null,
    roles: authData?.roles || [],
    permissions: authData?.permissions || [],
    service_ids: authData?.service_ids || [],
    valid_until: authData?.valid_until ?? null,
  };
};
const formatDateInput = (date = new Date()) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const normalizeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};
const normalizeTimeValue = (value) => {
  if (!value && value !== 0) return "";

  const raw = String(value).trim();

  // 1700 -> 17:00
  if (/^\d{4}$/.test(raw)) {
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
  }

  // 170000 -> 17:00
  if (/^\d{6}$/.test(raw)) {
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
  }

  // 17:00:00 -> 17:00
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
    return raw.slice(0, 5);
  }

  // 17:00 -> 17:00
  if (/^\d{2}:\d{2}$/.test(raw)) {
    return raw;
  }

  return "";
};


const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const today = formatDateInput(new Date());
  return dateString > today;
};

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  return [];
};

const pickFirstArray = (...candidates) => {
  for (const item of candidates) {
    if (Array.isArray(item)) return item;
  }
  return [];
};

const pickFirstObject = (...candidates) => {
  for (const item of candidates) {
    if (item && typeof item === "object" && !Array.isArray(item)) return item;
  }
  return {};
};

const parseCaloriesDayResponse = (response) => {
  const root = response?.data ?? response ?? {};
  const payload = root?.data ?? root;

  const meals = pickFirstArray(
    payload?.meals,
    payload?.items,
    payload?.logs,
    payload?.meal_logs,
    payload?.records,
    root?.meals,
    root?.items,
    root?.logs
  );

  const totalCalories = normalizeNumber(
    payload?.total_calories ??
      payload?.totalCalories ??
      payload?.calories_total ??
      payload?.summary?.total_calories ??
      root?.total_calories ??
      meals.reduce(
        (sum, item) =>
          sum +
          normalizeNumber(
            item?.calories ?? item?.kcal ?? item?.energy ?? item?.total_calories
          ),
        0
      ),
    0
  );

  return {
    meals: safeArray(meals).map((item, index) => ({
      id: item?.id ?? item?.meal_id ?? `meal-${index}`,
      meal_name:
        item?.meal_name ||
        item?.name ||
        item?.food_name ||
        item?.predicted_label ||
        "Món ăn chưa đặt tên",
      calories: normalizeNumber(
        item?.calories ?? item?.kcal ?? item?.energy ?? item?.total_calories,
        0
      ),
    meal_time: normalizeTimeValue(
  item?.meal_time || item?.time || item?.eaten_at || ""
),
      source: item?.source || item?.meal_source || "manual",
      notes: item?.notes || item?.note || item?.description || "",
      meal_date: item?.meal_date || item?.date || payload?.date || "",
      raw: item,
    })),
    totalCalories,
  };
};

const parseRecentMealsResponse = (response) => {
  const root = response?.data ?? response ?? {};
  const payload = root?.data ?? root;

  const items = pickFirstArray(
    payload?.meals,
    payload?.items,
    payload?.recent_meals,
    payload?.data,
    root?.meals,
    root?.items
  );

  const normalizedItems = safeArray(items).map((item, index) => ({
    id: item?.id ?? item?.meal_id ?? `recent-${index}`,
    meal_name:
      item?.meal_name || item?.name || item?.food_name || "Món ăn chưa đặt tên",
    calories: normalizeNumber(
      item?.calories ?? item?.kcal ?? item?.energy ?? item?.total_calories,
      0
    ),
meal_time: normalizeTimeValue(item?.meal_time || item?.time || ""),    source: item?.source || "recent",
    notes: item?.notes || item?.note || "",
    raw: item,
  }));

  const uniqueMeals = [];
  const seenNames = new Set();

  for (const meal of normalizedItems) {
    const normalizedName = (meal.meal_name || "").trim().toLowerCase();
    if (!normalizedName || seenNames.has(normalizedName)) continue;
    seenNames.add(normalizedName);
    uniqueMeals.push(meal);
  }

  return uniqueMeals;
};

const parseHistoryResponse = (response) => {
  const root = response?.data ?? response ?? {};
  const payload = root?.data ?? root;

  const rows = pickFirstArray(
    payload?.history,
    payload?.items,
    payload?.days,
    payload?.records,
    payload?.data,
    root?.history,
    root?.items
  );

  return safeArray(rows).map((item, index) => ({
    date: item?.date || item?.meal_date || item?.day || `day-${index}`,
    total_calories: normalizeNumber(
      item?.total_calories ?? item?.totalCalories ?? item?.calories ?? item?.total,
      0
    ),
    meal_count: normalizeNumber(
      item?.meal_count ?? item?.count ?? item?.total_meals ?? item?.items_count,
      0
    ),
    raw: item,
  }));
};

const parseAiResponse = (response) => {
  const root = response?.data ?? response ?? {};
  const payload = root?.data ?? root;

  const predictedLabel =
    payload?.predicted_label ||
    payload?.label ||
    payload?.prediction ||
    payload?.class_name ||
    "";

  const confidence = normalizeNumber(
    payload?.confidence ?? payload?.score ?? payload?.probability,
    0
  );

  const topPredictionsRaw = pickFirstArray(
    payload?.top_predictions,
    payload?.top5,
    payload?.predictions,
    root?.top_predictions
  );

  const topPredictions = safeArray(topPredictionsRaw).map((item, index) => {
    if (typeof item === "string") {
      return {
        label: item,
        confidence: 0,
        id: `pred-${index}`,
      };
    }

    return {
      label:
        item?.label ||
        item?.predicted_label ||
        item?.class_name ||
        item?.name ||
        `Dự đoán ${index + 1}`,
      confidence: normalizeNumber(
        item?.confidence ?? item?.score ?? item?.probability,
        0
      ),
      id: `pred-${index}`,
    };
  });

  return {
    predictedLabel,
    confidence,
    topPredictions,
    raw: payload,
  };
};

const getLast7DaysRange = () => {
  const today = new Date();
  const to = formatDateInput(today);
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - 6);
  const from = formatDateInput(fromDate);

  return { from, to };
};

const initialManualForm = {
  meal_name: "",
  calories: "",
  meal_time: "",
  notes: "",
};

const initialAiMealForm = {
  meal_name: "",
  calories: "",
  meal_time: "",
  notes: "",
};

/**
 * =========================
 * COMPONENT
 * =========================
 */

export default function NutritionManager() {
  const authState = useSelector((state) => state.auth);
  const currentUser = useMemo(() => mapReduxAuthToUser(authState), [authState]);
  const memberId = currentUser?.id || null;
const [recentMealTime, setRecentMealTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()));
const [entryMode, setEntryMode] = useState("manual");
  const [dayMeals, setDayMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [recentMeals, setRecentMeals] = useState([]);
  const [historyDays, setHistoryDays] = useState([]);
  const [selectedRecentMeals, setSelectedRecentMeals] = useState([]);

  const [manualForm, setManualForm] = useState(initialManualForm);

  const [aiImageFile, setAiImageFile] = useState(null);
  const [aiPreview, setAiPreview] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiMealForm, setAiMealForm] = useState(initialAiMealForm);
const dayMealsSectionRef = useRef(null);
  const [loadingDay, setLoadingDay] = useState(false);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [submittingRecent, setSubmittingRecent] = useState(false);
  const [recognizingAI, setRecognizingAI] = useState(false);
  const [submittingAI, setSubmittingAI] = useState(false);
  const [deletingMealId, setDeletingMealId] = useState(null);

  const isPlanningMode = useMemo(
    () => isFutureDate(selectedDate),
    [selectedDate]
  );

  const canLoadNutrition = !!memberId;
const scrollToDayMealsSection = () => {
  const top =
    dayMealsSectionRef.current?.getBoundingClientRect().top +
      window.scrollY -
      80 || 0;

  window.scrollTo({
    top,
    behavior: "smooth",
  });
};const handleChangeDayMealsPage = (page) => {
  setDayMealsPage(page);

  requestAnimationFrame(() => {
    scrollToDayMealsSection();
  });
};
  const refreshDayData = useCallback(async () => {
    if (!memberId || !selectedDate) return;

    try {
      setLoadingDay(true);
      const response = await getCaloriesByDay(selectedDate, memberId);
      const parsed = parseCaloriesDayResponse(response);
      setDayMeals(parsed.meals);
      setTotalCalories(parsed.totalCalories);
    } catch (error) {
      console.error("Lỗi load dữ liệu calo theo ngày:", error);
      setDayMeals([]);
      setTotalCalories(0);
      toast.error("Không thể tải dữ liệu calo theo ngày.");
    } finally {
      setLoadingDay(false);
    }
  }, [memberId, selectedDate]);

  const refreshRecentMeals = useCallback(async () => {
    if (!memberId) return;

    try {
      setLoadingRecent(true);
      const response = await getRecentMeals(memberId, 8);
      const parsed = parseRecentMealsResponse(response);
      setRecentMeals(parsed);
    } catch (error) {
      console.error("Lỗi load món gần đây:", error);
      setRecentMeals([]);
      toast.error("Không thể tải danh sách món gần đây.");
    } finally {
      setLoadingRecent(false);
    }
  }, [memberId]);

  const refreshHistory = useCallback(async () => {
    if (!memberId) return;

    const { from, to } = getLast7DaysRange();

    try {
      setLoadingHistory(true);
      const response = await getCaloriesHistory(memberId, from, to);
      const parsed = parseHistoryResponse(response);
      setHistoryDays(parsed);
    } catch (error) {
      console.error("Lỗi load lịch sử calo:", error);
      setHistoryDays([]);
      toast.error("Không thể tải lịch sử calo gần đây.");
    } finally {
      setLoadingHistory(false);
    }
  }, [memberId]);

  const refreshAllNutritionData = useCallback(async () => {
    if (!memberId) return;
    await Promise.all([refreshDayData(), refreshRecentMeals(), refreshHistory()]);
  }, [memberId, refreshDayData, refreshRecentMeals, refreshHistory]);

  useEffect(() => {
    if (!canLoadNutrition) return;
    refreshAllNutritionData();
  }, [canLoadNutrition, refreshAllNutritionData]);

  useEffect(() => {
    if (!memberId || !selectedDate) return;
    refreshDayData();
    setDayMealsPage(1);
  }, [memberId, selectedDate, refreshDayData]);

  useEffect(() => {
    return () => {
      if (aiPreview) URL.revokeObjectURL(aiPreview);
    };
  }, [aiPreview]);

  const handleChangeManualForm = (field, value) => {
    setManualForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleChangeAiMealForm = (field, value) => {
    setAiMealForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleAddManualMeal = async () => {
  if (!memberId) {
    toast.error("Không tìm thấy member_id từ Redux.");
    return;
  }

  if (!manualForm.meal_name.trim()) {
    toast.error("Vui lòng nhập tên món.");
    return;
  }

  if (!manualForm.calories || normalizeNumber(manualForm.calories) <= 0) {
    toast.error("Vui lòng nhập calories hợp lệ.");
    return;
  }

  if (!normalizeTimeValue(manualForm.meal_time)) {
    toast.error("Vui lòng nhập giờ ăn.");
    return;
  }

  try {
    setSubmittingManual(true);

    const payload = {
      member_id: memberId,
      meal_name: manualForm.meal_name.trim(),
      calories: normalizeNumber(manualForm.calories),
      meal_date: selectedDate,
      meal_time: normalizeTimeValue(manualForm.meal_time),
      note: manualForm.notes?.trim() || "",
      source: isPlanningMode ? "schedule" : "manual",
    };

    await addMeal(payload);

    toast.success(
      isPlanningMode
        ? "Đã thêm món vào kế hoạch ăn uống."
        : "Đã thêm món vào nhật ký calo."
    );

    setManualForm(initialManualForm);
    await refreshAllNutritionData();
  } catch (error) {
    console.error("Lỗi thêm món thủ công:", error);
    toast.error("Không thể thêm món thủ công.");
  } finally {
    setSubmittingManual(false);
  }
};

  const handleToggleRecentMeal = (meal) => {
    setSelectedRecentMeals((prev) => {
      const exists = prev.some((item) => item.id === meal.id);
      if (exists) return prev.filter((item) => item.id !== meal.id);
      return [...prev, meal];
    });
  };
const [recentMealNote, setRecentMealNote] = useState("");
 const handleAddSelectedRecentMeals = async () => {
  if (!memberId) {
    toast.error("Không tìm thấy member_id từ Redux.");
    return;
  }

  if (!selectedRecentMeals.length) {
    toast.error("Bạn chưa chọn món nào.");
    return;
  }

  if (!normalizeTimeValue(recentMealTime)) {
    toast.error("Vui lòng nhập giờ ăn.");
    return;
  }

  try {
    setSubmittingRecent(true);

    const payload = {
      member_id: memberId,
      meal_date: selectedDate,
      meals: selectedRecentMeals.map((item) => ({
        meal_name: item.meal_name,
        calories: normalizeNumber(item.calories),
        meal_time: normalizeTimeValue(recentMealTime),
        note: recentMealNote || "",
        source: isPlanningMode ? "schedule" : "recent",
      })),
    };

    await addManyMeals(payload);

    toast.success(
      isPlanningMode
        ? "Đã thêm các món đã chọn vào kế hoạch."
        : "Đã thêm các món đã chọn vào nhật ký."
    );

    setSelectedRecentMeals([]);
    setRecentMealTime("");
    setRecentMealNote("");
    await refreshAllNutritionData();
  } catch (error) {
    console.error("Lỗi thêm nhiều món:", error);
    toast.error("Không thể thêm các món đã chọn.");
  } finally {
    setSubmittingRecent(false);
  }
};

  const handleChangeAiFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (aiPreview) URL.revokeObjectURL(aiPreview);

    setAiImageFile(file);
    setAiPreview(URL.createObjectURL(file));
    setAiResult(null);
    setAiMealForm(initialAiMealForm);
  };

  const handlePredictFood = async () => {
  if (!aiImageFile) {
    toast.error("Vui lòng chọn ảnh món ăn.");
    return;
  }

  try {
    setRecognizingAI(true);

    const formData = new FormData();
    formData.append("image", aiImageFile);

    const response = await predictFoodFromImage(formData);
    const parsed = parseAiResponse(response);

    const defaultCalories = getDefaultCaloriesByLabel(parsed.predictedLabel);
    const displayName = getDisplayFoodName(parsed.predictedLabel);

    setAiResult(parsed);
    setAiMealForm((prev) => ({
      ...prev,
      meal_name: displayName || prev.meal_name,
      calories: defaultCalories || prev.calories,
    }));

    toast.success("Nhận diện món ăn thành công.");
  } catch (error) {
    console.error("Lỗi nhận diện món ăn:", error);
    toast.error("Không thể nhận diện món ăn từ ảnh.");
  } finally {
    setRecognizingAI(false);
  }
};
const [dayMealsPage, setDayMealsPage] = useState(1);
const dayMealsPerPage = 10;
  const handleAddAiMeal = async () => {
    if (!memberId) {
      toast.error("Không tìm thấy member_id từ Redux.");
      return;
    }

    const mealName = aiMealForm.meal_name?.trim() || aiResult?.predictedLabel || "";

    if (!mealName) {
      toast.error("Vui lòng nhập tên món sau khi AI nhận diện.");
      return;
    }

    if (!aiMealForm.calories || normalizeNumber(aiMealForm.calories) <= 0) {
      toast.error("Vui lòng nhập calories hợp lệ.");
      return;
    }

    try {
      setSubmittingAI(true);

      const payload = {
        member_id: memberId,
        meal_name: mealName,
        calories: normalizeNumber(aiMealForm.calories),
        meal_date: selectedDate,
        meal_time: aiMealForm.meal_time || null,
        note: aiMealForm.notes?.trim() || "",
        source: isPlanningMode ? "schedule" : "ai",
      };

      await addMeal(payload);

      toast.success(
        isPlanningMode
          ? "Đã thêm món AI vào kế hoạch."
          : "Đã thêm món AI vào nhật ký calo."
      );

      setAiImageFile(null);
      if (aiPreview) URL.revokeObjectURL(aiPreview);
      setAiPreview("");
      setAiResult(null);
      setAiMealForm(initialAiMealForm);

      await refreshAllNutritionData();
    } catch (error) {
      console.error("Lỗi thêm món từ AI:", error);
      toast.error("Không thể thêm món từ kết quả AI.");
    } finally {
      setSubmittingAI(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!mealId) {
      toast.error("Không xác định được món cần xóa.");
      return;
    }

    if (typeof deleteMeal !== "function") {
      toast.error("Backend chưa hỗ trợ API xóa món.");
      return;
    }

    try {
      setDeletingMealId(mealId);
      await deleteMeal(mealId);
      toast.success("Đã xóa món ăn.");
      await refreshAllNutritionData();
    } catch (error) {
      console.error("Lỗi xóa món:", error);
      toast.error("Không thể xóa món ăn.");
    } finally {
      setDeletingMealId(null);
    }
  };

  const selectedRecentMealIds = useMemo(
    () => selectedRecentMeals.map((item) => item.id),
    [selectedRecentMeals]
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-400/20 bg-white/5 p-6 text-white shadow-2xl backdrop-blur">
            <h1 className="text-2xl font-bold">Nhật ký dinh dưỡng</h1>
            <p className="mt-3 text-sm text-red-200">
              Không tìm thấy thông tin tài khoản hiện tại trong Redux.
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Hãy kiểm tra lại luồng `App.js getMyInfo() dispatch(login(response.data))`.
            </p>
          </div>
        </div>
      </div>
    );
  }
const totalDayMealsPages = Math.ceil(dayMeals.length / dayMealsPerPage) || 1;

const paginatedDayMeals = dayMeals.slice(
  (dayMealsPage - 1) * dayMealsPerPage,
  dayMealsPage * dayMealsPerPage
);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-2xl backdrop-blur md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
                Fight100 • Nutrition AI
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-4xl">
                Nhật ký dinh dưỡng
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Theo dõi calo mỗi ngày, thêm món thủ công, chọn từ món gần đây,
                nhận diện món ăn bằng AI và lưu toàn bộ dữ liệu theo đúng tài khoản
                đang đăng nhập từ Redux.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Tài khoản hiện tại
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Tên</span>
                  <span className="font-medium">{currentUser.name || "--"}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Email</span>
                  <span className="truncate font-medium">
                    {currentUser.email || "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-400">Member ID</span>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
                    #{currentUser.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Date + Summary */}
        <section className="grid gap-4 md:grid-cols-3">
<div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
        <label className="mb-2 block text-sm font-medium text-slate-300">
              Chọn ngày
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-purple-400"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="mt-4 rounded-2xl border border-purple-400/20 bg-purple-500/10 p-3 text-sm text-purple-100">
              {isPlanningMode
                ? "Bạn đang chọn ngày tương lai. Hệ thống sẽ chuyển sang chế độ lên kế hoạch ăn uống."
                : "Bạn đang xem nhật ký calo của ngày đã chọn."}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
            <p className="text-sm text-slate-400">Tổng calo trong ngày</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-purple-300">
                {loadingDay ? "..." : totalCalories}
              </span>
              <span className="pb-1 text-sm text-slate-400">kcal</span>
            </div>
          
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
            <p className="text-sm text-slate-400">Số món đã thêm</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-white">
                {loadingDay ? "..." : dayMeals.length}
              </span>
              <span className="pb-1 text-sm text-slate-400">món</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              Chế độ hiện tại:{" "}
              <strong>{isPlanningMode ? "Lên kế hoạch" : "Nhật ký thực tế"}</strong>
            </p>
          </div>
        </section>

        {/* Main content */}
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            
          {/* Left side */}
          <div className="space-y-6">
            {/* Meal list */}
       <div
  ref={dayMealsSectionRef}
  className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur"
>
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <h2 className="text-xl font-semibold">Danh sách món ăn trong ngày</h2>
      <p className="mt-1 text-sm text-slate-400">
        Hiển thị món ăn theo ngày đã chọn.
      </p>
    </div>

    <button
      onClick={refreshDayData}
      className="rounded-2xl border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-200 transition hover:bg-purple-500/20"
    >
      Tải lại
    </button>
  </div>

  {loadingDay ? (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-slate-300">
      Đang tải dữ liệu calo...
    </div>
  ) : dayMeals.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-slate-400">
      Chưa có món ăn nào cho ngày này.
    </div>
  ) : (
    <>
      <div className="grid gap-4">
        {paginatedDayMeals.map((meal) => (
          <div
            key={meal.id}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition hover:border-purple-400/30"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {meal.meal_name}
                  </h3>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200">
                    {meal.calories} kcal
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-300">
                    {meal.source || "manual"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                  <span>Giờ ăn: {normalizeTimeValue(meal.meal_time) || "--:--"}</span>
                </div>

                {meal.notes ? (
                  <p className="text-sm leading-6 text-slate-300">
                    Ghi chú: {meal.notes}
                  </p>
                ) : null}
              </div>

              {typeof deleteMeal === "function" ? (
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
                  disabled={deletingMealId === meal.id}
                  className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingMealId === meal.id ? "Đang xóa..." : "Xóa món"}
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {dayMeals.length > dayMealsPerPage ? (
        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-400">
            Trang {dayMealsPage}/{totalDayMealsPages} • Tổng {dayMeals.length} món
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleChangeDayMealsPage(1)}
              disabled={dayMealsPage === 1}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Đầu
            </button>

            <button
              type="button"
              onClick={() => handleChangeDayMealsPage(Math.max(dayMealsPage - 1, 1))}
              disabled={dayMealsPage === 1}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Trước
            </button>

            <button
              type="button"
              onClick={() =>
                handleChangeDayMealsPage(Math.min(dayMealsPage + 1, totalDayMealsPages))
              }
              disabled={dayMealsPage === totalDayMealsPages}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sau
            </button>

            <button
              type="button"
              onClick={() => handleChangeDayMealsPage(totalDayMealsPages)}
              disabled={dayMealsPage === totalDayMealsPages}
              className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cuối
            </button>
          </div>
        </div>
      ) : null}
    </>
  )}
</div>
            {/* Recent meals */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
  <div className="mb-4 flex items-center justify-between gap-3">
    <div>
      <h2 className="text-xl font-semibold">Thêm từ món gần đây</h2>
      <p className="mt-1 text-sm text-slate-400">
        Chọn nhiều món và thêm nhanh vào ngày đang xem.
      </p>
    </div>
  </div>

  <div className="mb-4 grid gap-4 md:grid-cols-2">
    <div>
      <label className="mb-2 block text-sm text-slate-300">Giờ ăn</label>
      <input
        type="time"
        value={recentMealTime}
        onChange={(e) => setRecentMealTime(e.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
      />
    </div>

    <div>
      <label className="mb-2 block text-sm text-slate-300">Ghi chú mới</label>
      <input
        type="text"
        value={recentMealNote}
        onChange={(e) => setRecentMealNote(e.target.value)}
        placeholder="Ví dụ: ăn sau tập, ít cơm, thêm rau..."
        className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-purple-400"
      />
    </div>
  </div>

  <div className="mb-4">
    <button
      onClick={handleAddSelectedRecentMeals}
      disabled={submittingRecent || !selectedRecentMeals.length}
      className="rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {submittingRecent ? "Đang thêm..." : "Thêm món đã chọn"}
    </button>
  </div>

  {loadingRecent ? (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-slate-300">
      Đang tải món gần đây...
    </div>
  ) : recentMeals.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-slate-400">
      Chưa có dữ liệu món gần đây.
    </div>
  ) : (
    <div className="grid gap-3 md:grid-cols-2">
      {recentMeals.map((meal) => {
        const checked = selectedRecentMealIds.includes(meal.id);

        return (
          <button
            key={meal.id}
            type="button"
            onClick={() => handleToggleRecentMeal(meal)}
            className={`rounded-2xl border p-4 text-left transition ${
              checked
                ? "border-purple-400 bg-purple-500/10"
                : "border-white/10 bg-slate-950/50 hover:border-white/20"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-white">{meal.meal_name}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>{meal.calories} kcal</span>
                  <span>{normalizeTimeValue(meal.meal_time) || "--:--"}</span>
                  <span>{meal.source || "recent"}</span>
                </div>
              </div>

              <span
                className={`mt-1 h-5 w-5 rounded-full border ${
                  checked
                    ? "border-purple-300 bg-purple-400"
                    : "border-slate-500 bg-transparent"
                }`}
              />
            </div>

            {meal.notes ? (
              <p className="mt-3 text-sm text-slate-300">{meal.notes}</p>
            ) : null}
          </button>
        );
      })}
    </div>
  )}
</div>

           
  </div>
          {/* Right side */}
          <div className="space-y-6">
            {/* AI section */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
  <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h2 className="text-xl font-semibold">Thêm món ăn</h2>
      <p className="mt-1 text-sm text-slate-400">
        Chuyển giữa chế độ nhập thủ công và AI nhận diện từ ảnh.
      </p>
    </div>

    <div className="inline-flex rounded-2xl border border-white/10 bg-slate-950/60 p-1">
      <button
        type="button"
        onClick={() => setEntryMode("manual")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          entryMode === "manual"
            ? "bg-purple-600 text-white"
            : "text-slate-300 hover:bg-white/5"
        }`}
      >
        Thủ công
      </button>

      <button
        type="button"
        onClick={() => setEntryMode("ai")}
        className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
          entryMode === "ai"
            ? "bg-purple-600 text-white"
            : "text-slate-300 hover:bg-white/5"
        }`}
      >
        AI từ ảnh
      </button>
    </div>
  </div>

  {entryMode === "manual" ? (
    <div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Thêm món thủ công</h3>
        <p className="mt-1 text-sm text-slate-400">
          Nhập trực tiếp tên món, calories, giờ ăn và ghi chú.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">Tên món</label>
          <input
            type="text"
            value={manualForm.meal_name}
            onChange={(e) => handleChangeManualForm("meal_name", e.target.value)}
            placeholder="Ví dụ: Ức gà áp chảo"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Calories</label>
          <input
            type="number"
            min="0"
            value={manualForm.calories}
            onChange={(e) => handleChangeManualForm("calories", e.target.value)}
            placeholder="Ví dụ: 350"
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-300">Giờ ăn</label>
          <input
            type="time"
            value={manualForm.meal_time}
            onChange={(e) => handleChangeManualForm("meal_time", e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-slate-300">Ghi chú</label>
          <textarea
            rows="4"
            value={manualForm.notes}
            onChange={(e) => handleChangeManualForm("notes", e.target.value)}
            placeholder="Ví dụ: Ít dầu, ăn sau tập, tăng protein..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAddManualMeal}
          disabled={submittingManual}
          className="rounded-2xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submittingManual
            ? "Đang xử lý..."
            : isPlanningMode
            ? "Thêm vào kế hoạch"
            : "Xác nhận thêm món"}
        </button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">AI nhận diện món ăn từ ảnh</h3>
        <p className="mt-1 text-sm text-slate-400">
          Upload ảnh món ăn, nhận diện bằng AI rồi thêm vào nhật ký hoặc kế hoạch.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm text-slate-300">
          Chọn ảnh món ăn
        </label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleChangeAiFile}
          className="block w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-purple-500"
        />
      </div>

      {aiPreview ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <img
            src={aiPreview}
            alt="Preview món ăn"
            className="h-64 w-full object-cover"
          />
        </div>
      ) : null}

      <button
        onClick={handlePredictFood}
        disabled={recognizingAI || !aiImageFile}
        className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {recognizingAI ? "Đang nhận diện..." : "Nhận diện món ăn"}
      </button>

      {aiResult ? (
        <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 p-4">
          <h3 className="text-base font-semibold text-purple-100">Kết quả AI</h3>

          <div className="mt-3 space-y-2 text-sm text-slate-200">
            <p>
              <strong>Predicted label:</strong> {aiResult.predictedLabel || "--"}
            </p>
            <p>
              <strong>Confidence:</strong>{" "}
              {(aiResult.confidence * 100).toFixed(2)}%
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-200">
              Top 5 predictions
            </p>
            <div className="space-y-2">
              {aiResult.topPredictions.length ? (
                aiResult.topPredictions.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm"
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-300">
                      {(normalizeNumber(item.confidence) * 100).toFixed(2)}%
                    </span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-300">
                  Không có dữ liệu top predictions.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4">
            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Tên món
              </label>
              <input
                type="text"
                value={aiMealForm.meal_name}
                onChange={(e) =>
                  handleChangeAiMealForm("meal_name", e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Calories
              </label>
              <input
                type="number"
                min="0"
                value={aiMealForm.calories}
                onChange={(e) =>
                  handleChangeAiMealForm("calories", e.target.value)
                }
                placeholder="Nhập calories để lưu"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Giờ ăn
              </label>
              <input
                type="time"
                value={aiMealForm.meal_time}
                onChange={(e) =>
                  handleChangeAiMealForm("meal_time", e.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">
                Ghi chú
              </label>
              <textarea
                rows="3"
                value={aiMealForm.notes}
                onChange={(e) =>
                  handleChangeAiMealForm("notes", e.target.value)
                }
                placeholder="Ví dụ: AI nhận diện từ ảnh sau bữa trưa"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
              />
            </div>

            <button
              onClick={handleAddAiMeal}
              disabled={submittingAI}
              className="w-full rounded-2xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submittingAI
                ? "Đang thêm..."
                : isPlanningMode
                ? "Thêm món AI vào kế hoạch"
                : "Thêm món từ kết quả AI"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )}
</div>

            {/* History */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">Lịch sử calo gần đây</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    7 ngày gần nhất. Bấm vào một ngày để xem chi tiết.
                  </p>
                </div>

                <button
                  onClick={refreshHistory}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                >
                  Làm mới
                </button>
              </div>

              {loadingHistory ? (
                <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-center text-slate-300">
                  Đang tải lịch sử...
                </div>
              ) : historyDays.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-slate-400">
                  Chưa có dữ liệu lịch sử calo.
                </div>
              ) : (
                <div className="space-y-3">
                  {historyDays.map((item) => {
                    const active = item.date === selectedDate;

                    return (
                      <button
                        key={item.date}
                        onClick={() => setSelectedDate(item.date)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          active
                            ? "border-purple-400 bg-purple-500/10"
                            : "border-white/10 bg-slate-950/50 hover:border-white/20"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{item.date}</p>
                            <p className="mt-1 text-sm text-slate-400">
                              {item.meal_count} món
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-purple-300">
                              {item.total_calories} kcal
                            </p>
                            <p className="text-xs text-slate-400">Tổng calo</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}