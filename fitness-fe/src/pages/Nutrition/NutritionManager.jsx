import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  predictFoodFromImage,
  getCaloriesByDay,
  addMeal,
  deleteMeal,
} from "../../services/calo";
import {
  getDefaultCaloriesByLabel,
  getDisplayFoodName,
  getDefaultQuantityByLabel,
  getDefaultUnitByLabel,
} from "../../services/foodCaloriesMap";
import UpgradeModal from "../../components/utils/UpgradeModal.jsx";
import HealthyFoodSuggestions from "../Nutrition/HealthyFoodSuggestions";

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

const normalizeNullableNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeTimeValue = (value) => {
  if (!value && value !== 0) return "";

  const raw = String(value).trim();

  if (/^\d{4}$/.test(raw)) {
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
  }

  if (/^\d{6}$/.test(raw)) {
    return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;
  }

  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) {
    return raw.slice(0, 5);
  }

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

const getDisplayQuantityText = (quantity, unit) => {
  const hasQuantity =
    quantity !== null && quantity !== undefined && quantity !== "";
  const hasUnit =
    unit !== null && unit !== undefined && String(unit).trim() !== "";

  if (!hasQuantity && !hasUnit) return "";

  let cleanQuantity = "";

  if (hasQuantity) {
    const numberValue = Number(quantity);

    cleanQuantity = Number.isFinite(numberValue)
      ? Number.isInteger(numberValue)
        ? String(numberValue)
        : String(parseFloat(numberValue.toFixed(2)))
      : String(quantity);
  }

  if (hasQuantity && hasUnit) {
    return `${cleanQuantity} ${unit}`;
  }

  if (hasQuantity) {
    return `${cleanQuantity}`;
  }

  return `${unit}`;
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
    root?.logs,
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
            item?.calories ??
              item?.kcal ??
              item?.energy ??
              item?.total_calories,
          ),
        0,
      ),
    0,
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
        0,
      ),
      quantity:
        item?.quantity !== undefined && item?.quantity !== null
          ? item.quantity
          : item?.amount !== undefined && item?.amount !== null
            ? item.amount
            : null,
      unit:
        item?.unit ||
        item?.quantity_unit ||
        item?.measure_unit ||
        item?.serving_unit ||
        "",
      meal_time: normalizeTimeValue(
        item?.meal_time || item?.time || item?.eaten_at || "",
      ),
      source: item?.source || item?.meal_source || "manual",
      notes: item?.notes || item?.note || item?.description || "",
      meal_date: item?.meal_date || item?.date || payload?.date || "",
      raw: item,
    })),
    totalCalories,
  };
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
    0,
  );

  const topPredictionsRaw = pickFirstArray(
    payload?.top_predictions,
    payload?.top5,
    payload?.predictions,
    root?.top_predictions,
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
        0,
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

const initialManualForm = {
  meal_name: "",
  calories: "",
  quantity: "",
  unit: "",
  meal_time: "",
  notes: "",
};

const initialAiMealForm = {
  meal_name: "",
  calories: "",
  quantity: "",
  unit: "",
  meal_time: "",
  notes: "",
};

/**
 * =========================
 * COMPONENT
 * =========================
 */

export default function NutritionManager() {
  const permissions = useSelector((state) => state.auth.permissions);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const authState = useSelector((state) => state.auth);
  const currentUser = useMemo(() => mapReduxAuthToUser(authState), [authState]);
  const memberId = currentUser?.id || null;

  const [selectedDate, setSelectedDate] = useState(formatDateInput(new Date()));
  const [entryMode, setEntryMode] = useState("manual");
  const [dayMeals, setDayMeals] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [manualForm, setManualForm] = useState(initialManualForm);

  const [aiImageFile, setAiImageFile] = useState(null);
  const [aiPreview, setAiPreview] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [aiMealForm, setAiMealForm] = useState(initialAiMealForm);

  const dayMealsSectionRef = useRef(null);

  const [loadingDay, setLoadingDay] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);
  const [recognizingAI, setRecognizingAI] = useState(false);
  const [submittingAI, setSubmittingAI] = useState(false);
  const [deletingMealId, setDeletingMealId] = useState(null);

  const [dayMealsPage, setDayMealsPage] = useState(1);
  const dayMealsPerPage = 5;

  const isPlanningMode = useMemo(
    () => isFutureDate(selectedDate),
    [selectedDate],
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
  };

  const handleChangeDayMealsPage = (page) => {
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

  const refreshAllNutritionData = useCallback(async () => {
    if (!memberId) return;
    await refreshDayData();
  }, [memberId, refreshDayData]);

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
    const totalPages = Math.max(
      1,
      Math.ceil(dayMeals.length / dayMealsPerPage),
    );

    if (dayMealsPage > totalPages) {
      setDayMealsPage(totalPages);
    }

    if (dayMealsPage < 1) {
      setDayMealsPage(1);
    }
  }, [dayMeals.length, dayMealsPage]);

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
        quantity: normalizeNullableNumber(manualForm.quantity),
        unit: manualForm.unit?.trim() || null,
        meal_date: selectedDate,
        meal_time: normalizeTimeValue(manualForm.meal_time),
        note: manualForm.notes?.trim() || "",
        source: "manual",
      };

      await addMeal(payload);

      toast.success(
        isPlanningMode
          ? "Đã thêm món vào kế hoạch ăn uống."
          : "Đã thêm món vào nhật ký calo.",
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

  const handleQuickAddSuggestedFood = async (food, extraData = {}) => {
    if (!memberId) {
      toast.error("Không tìm thấy member_id từ Redux.");
      return false;
    }

    if (!food) {
      toast.error("Bạn chưa chọn món ăn.");
      return false;
    }

    try {
      const payload = {
        member_id: memberId,
        meal_name: food.name || "",
        calories: normalizeNumber(food.calories, 0),
        quantity:
          food.defaultQuantity !== null && food.defaultQuantity !== undefined
            ? food.defaultQuantity
            : null,
        unit: food.defaultUnit || food.unitBase || null,
        meal_date: selectedDate,
        meal_time: normalizeTimeValue(extraData.meal_time) || null,
        note: extraData.note?.trim() || "",
        source: "manual",
      };

      await addMeal(payload);

      toast.success(
        isPlanningMode
          ? "Đã thêm món vào kế hoạch."
          : "Đã thêm món vào khẩu phần.",
      );

      await refreshAllNutritionData();
      setDayMealsPage(1);

      setTimeout(() => {
        scrollToDayMealsSection();
      }, 150);

      return true;
    } catch (error) {
      console.error("Lỗi thêm món gợi ý:", error);
      toast.error("Không thể thêm món gợi ý.");
      return false;
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
      const defaultQuantity = getDefaultQuantityByLabel(parsed.predictedLabel);
      const defaultUnit = getDefaultUnitByLabel(parsed.predictedLabel);

      setAiResult(parsed);
      setAiMealForm((prev) => ({
        ...prev,
        meal_name: displayName || prev.meal_name,
        calories: defaultCalories || prev.calories,
        quantity:
          defaultQuantity !== null && defaultQuantity !== undefined
            ? String(defaultQuantity)
            : prev.quantity,
        unit: defaultUnit || prev.unit,
      }));

      toast.success("Nhận diện món ăn thành công.");
    } catch (error) {
      console.error("Lỗi nhận diện món ăn:", error);
      toast.error("Không thể nhận diện món ăn từ ảnh.");
    } finally {
      setRecognizingAI(false);
    }
  };

  const handleAddAiMeal = async () => {
    if (!memberId) {
      toast.error("Không tìm thấy member_id từ Redux.");
      return;
    }

    const mealName =
      aiMealForm.meal_name?.trim() || aiResult?.predictedLabel || "";

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
        quantity: normalizeNullableNumber(aiMealForm.quantity),
        unit: aiMealForm.unit?.trim() || null,
        meal_date: selectedDate,
        meal_time: normalizeTimeValue(aiMealForm.meal_time) || null,
        note: aiMealForm.notes?.trim() || "",
        source: "ai",
      };

      await addMeal(payload);

      toast.success(
        isPlanningMode
          ? "Đã thêm món AI vào kế hoạch."
          : "Đã thêm món AI vào nhật ký calo.",
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-white p-6 text-slate-900 shadow-sm">
            <h1 className="text-2xl font-bold">Nhật ký dinh dưỡng</h1>
            <p className="mt-3 text-sm text-red-600">
              Không tìm thấy thông tin tài khoản hiện tại trong Redux.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Hãy kiểm tra lại luồng `App.js getMyInfo()
              dispatch(login(response.data))`.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalDayMealsPages = Math.max(
    1,
    Math.ceil(dayMeals.length / dayMealsPerPage),
  );
  const safeDayMealsPage = Math.min(dayMealsPage, totalDayMealsPages);

  const paginatedDayMeals = dayMeals.slice(
    (safeDayMealsPage - 1) * dayMealsPerPage,
    safeDayMealsPage * dayMealsPerPage,
  );

  const fixedDayMealCards = Array.from(
    { length: dayMealsPerPage },
    (_, index) => paginatedDayMeals[index] || null,
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                FitnesIT • Nutrition AI
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-4xl">
                Nhật ký dinh dưỡng
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Theo dõi calo mỗi ngày, thêm món thủ công, nhận diện món ăn bằng
                AI và lưu toàn bộ dữ liệu theo đúng tài khoản đang đăng nhập từ
                Redux.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Tài khoản hiện tại
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Tên</span>
                  <span className="font-medium text-slate-900">
                    {currentUser.name || "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Email</span>
                  <span className="truncate font-medium text-slate-900">
                    {currentUser.email || "--"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Member ID</span>
                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    #{currentUser.id}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Date + Summary */}
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Chọn ngày
            </label>
            <input
              type="date"
              className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-100 p-3 text-sm text-purple-700">
              {isPlanningMode
                ? "Bạn đang chọn ngày tương lai. Hệ thống sẽ chuyển sang chế độ lên kế hoạch ăn uống."
                : "Bạn đang xem nhật ký calo của ngày đã chọn."}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
            <p className="text-sm text-slate-500">Tổng calo trong ngày</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-purple-700">
                {loadingDay ? "..." : totalCalories}
              </span>
              <span className="pb-1 text-sm text-slate-500">kcal</span>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
            <p className="text-sm text-slate-500">Số món đã thêm</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="text-4xl font-bold text-purple-700">
                {loadingDay ? "..." : dayMeals.length}
              </span>
              <span className="pb-1 text-sm text-slate-500">món</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              Chế độ hiện tại:{" "}
              <strong>
                {isPlanningMode ? "Lên kế hoạch" : "Nhật ký thực tế"}
              </strong>
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
              className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    Danh sách món ăn trong ngày
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Hiển thị món ăn theo ngày đã chọn.
                  </p>
                </div>

                <button
                  onClick={refreshDayData}
                  className="rounded-2xl border border-purple-200 bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 transition hover:bg-blue-100"
                >
                  Tải lại
                </button>
              </div>

              {loadingDay ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center text-slate-600">
                  Đang tải dữ liệu calo...
                </div>
              ) : dayMeals.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                  Chưa có món ăn nào cho ngày này.
                </div>
              ) : (
                <>
                  <div className="grid gap-4">
                    {fixedDayMealCards.map((meal, index) => {
                      if (!meal) {
                        return (
                          <div
                            key={`empty-card-${index}`}
                            className="min-h-[140px] rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4"
                          />
                        );
                      }

                      const quantityText = getDisplayQuantityText(
                        meal.quantity,
                        meal.unit,
                      );

                      return (
                        <div
                          key={meal.id}
                          className="min-h-[140px] rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300"
                        >
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {meal.meal_name}
                                </h3>
                                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                                  {meal.calories} kcal
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-600 border border-slate-200">
                                  {meal.source || "manual"}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                <span>
                                  Giờ ăn:{" "}
                                  {normalizeTimeValue(meal.meal_time) ||
                                    "--:--"}
                                </span>
                              </div>

                              {quantityText ? (
                                <p className="text-sm leading-6 text-slate-600">
                                  Định lượng: {quantityText}
                                </p>
                              ) : null}

                              {meal.notes ? (
                                <p className="text-sm leading-6 text-slate-600">
                                  Ghi chú: {meal.notes}
                                </p>
                              ) : null}
                            </div>

                            {typeof deleteMeal === "function" ? (
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                disabled={deletingMealId === meal.id}
                                className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {deletingMealId === meal.id
                                  ? "Đang xóa..."
                                  : "Xóa món"}
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {dayMeals.length > dayMealsPerPage ? (
                    <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <p className="text-sm text-slate-500">
                        Trang {safeDayMealsPage}/{totalDayMealsPages} • Tổng{" "}
                        {dayMeals.length} món
                      </p>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleChangeDayMealsPage(1)}
                          disabled={safeDayMealsPage === 1}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Đầu
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleChangeDayMealsPage(
                              Math.max(safeDayMealsPage - 1, 1),
                            )
                          }
                          disabled={safeDayMealsPage === 1}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Trước
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleChangeDayMealsPage(
                              Math.min(
                                safeDayMealsPage + 1,
                                totalDayMealsPages,
                              ),
                            )
                          }
                          disabled={safeDayMealsPage === totalDayMealsPages}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Sau
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleChangeDayMealsPage(totalDayMealsPages)
                          }
                          disabled={safeDayMealsPage === totalDayMealsPages}
                          className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Cuối
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            {/* AI section */}
            <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
              <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Thêm món ăn</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Chuyển giữa chế độ nhập thủ công và AI nhận diện từ ảnh.
                  </p>
                </div>

                <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setEntryMode("manual")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      entryMode === "manual"
                        ? "bg-purple-700 text-white"
                        : "text-slate-600 hover:bg-white"
                    }`}
                  >
                    Thủ công
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (permissions.includes("nutrition.create")) {
                        setEntryMode("ai");
                      } else {
                        setShowUpgrade(true);
                      }
                    }}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      entryMode === "ai"
                        ? "bg-purple-700 text-white"
                        : "text-slate-600 hover:bg-white"
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
                    <p className="mt-1 text-sm text-slate-500">
                      Nhập trực tiếp tên món, calories, định lượng, giờ ăn và
                      ghi chú.
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm text-slate-600">
                        Tên món
                      </label>
                      <input
                        type="text"
                        value={manualForm.meal_name}
                        onChange={(e) =>
                          handleChangeManualForm("meal_name", e.target.value)
                        }
                        placeholder="Ví dụ: Ức gà áp chảo"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Calories
                      </label>

                      <input
                        min="0"
                        value={manualForm.calories}
                        placeholder="Ví dụ: 350"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Giờ ăn
                      </label>
                      <input
                        type="time"
                        value={manualForm.meal_time}
                        onChange={(e) =>
                          handleChangeManualForm("meal_time", e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Định lượng / số lượng
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={manualForm.quantity}
                        onChange={(e) =>
                          handleChangeManualForm("quantity", e.target.value)
                        }
                        placeholder="Ví dụ: 150 hoặc 2 hoặc 1"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm text-slate-600">
                        Đơn vị
                      </label>
                      <input
                        type="text"
                        value={manualForm.unit}
                        onChange={(e) =>
                          handleChangeManualForm("unit", e.target.value)
                        }
                        placeholder="Ví dụ: gram, phần, quả, chén, ml"
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm text-slate-600">
                        Ghi chú
                      </label>
                      <textarea
                        rows="4"
                        value={manualForm.notes}
                        onChange={(e) =>
                          handleChangeManualForm("notes", e.target.value)
                        }
                        placeholder="Ví dụ: Ít dầu, ăn sau tập, tăng protein..."
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleAddManualMeal}
                      disabled={submittingManual}
                      className="rounded-2xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-50"
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
                    <h3 className="text-lg font-semibold">
                      AI nhận diện món ăn từ ảnh
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Upload ảnh món ăn, nhận diện bằng AI rồi thêm vào nhật ký
                      hoặc kế hoạch.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm text-slate-600">
                      Chọn ảnh món ăn
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleChangeAiFile}
                      className="block w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-500"
                    />
                  </div>

                  {aiPreview ? (
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
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
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {recognizingAI ? "Đang nhận diện..." : "Nhận diện món ăn"}
                  </button>

                  {aiResult ? (
                    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                      <h3 className="text-base font-semibold text-blue-700">
                        Kết quả AI
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p>
                          <strong>Predicted label:</strong>{" "}
                          {aiResult.predictedLabel || "--"}
                        </p>
                        <p>
                          <strong>Confidence:</strong>{" "}
                          {(aiResult.confidence * 100).toFixed(2)}%
                        </p>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-slate-700">
                          Top 5 predictions
                        </p>
                        <div className="space-y-2">
                          {aiResult.topPredictions.length ? (
                            aiResult.topPredictions.slice(0, 5).map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                              >
                                <span className="text-slate-800">
                                  {item.label}
                                </span>
                                <span className="text-slate-500">
                                  {(
                                    normalizeNumber(item.confidence) * 100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500">
                              Không có dữ liệu top predictions.
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm text-slate-600">
                            Tên món
                          </label>
                          <input
                            type="text"
                            value={aiMealForm.meal_name}
                            onChange={(e) =>
                              handleChangeAiMealForm(
                                "meal_name",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-600">
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
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-600">
                            Giờ ăn
                          </label>
                          <input
                            type="time"
                            value={aiMealForm.meal_time}
                            onChange={(e) =>
                              handleChangeAiMealForm(
                                "meal_time",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-600">
                            Định lượng / số lượng
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={aiMealForm.quantity}
                            onChange={(e) =>
                              handleChangeAiMealForm("quantity", e.target.value)
                            }
                            placeholder="Ví dụ: 150 hoặc 2 hoặc 1"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-slate-600">
                            Đơn vị
                          </label>
                          <input
                            type="text"
                            value={aiMealForm.unit}
                            onChange={(e) =>
                              handleChangeAiMealForm("unit", e.target.value)
                            }
                            placeholder="Ví dụ: gram, phần, quả, chén, ml"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-2 block text-sm text-slate-600">
                            Ghi chú
                          </label>
                          <textarea
                            rows="3"
                            value={aiMealForm.notes}
                            onChange={(e) =>
                              handleChangeAiMealForm("notes", e.target.value)
                            }
                            placeholder="Ví dụ: AI nhận diện từ ảnh sau bữa trưa"
                            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <button
                            onClick={handleAddAiMeal}
                            disabled={submittingAI}
                            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {submittingAI
                              ? "Đang thêm..."
                              : isPlanningMode
                                ? "Thêm món AI vào kế hoạch"
                                : "Thêm món từ kết quả AI"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            {showUpgrade && (
              <UpgradeModal
                isOpen={showUpgrade}
                onClose={() => setShowUpgrade(false)}
              />
            )}
          </div>
        </section>
      </div>

      <HealthyFoodSuggestions onQuickAddFood={handleQuickAddSuggestedFood} />
    </div>
  );
}
