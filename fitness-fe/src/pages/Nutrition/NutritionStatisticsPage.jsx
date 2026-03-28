import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import {
  getCaloriesByDay,
  getCaloriesHistory,
  getNutritionChart,
  getNutritionSummary,
  getNutritionTopMeals,
} from "../../services/calo";

const DEFAULT_DAYS = 30;
const TABLE_ITEMS_PER_PAGE = 5;

const sourceLabelMap = {
  manual: "Thủ công",
  ai: "AI",
  recent: "Gần đây",
  schedule: "Lịch ăn",
};

const sourceBadgeMap = {
  manual: "bg-blue-50 text-blue-700 border border-blue-200",
  ai: "bg-violet-50 text-violet-700 border border-violet-200",
  recent: "bg-amber-50 text-amber-700 border border-amber-200",
  schedule: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

const formatNumber = (value) => {
  const number = Number(value || 0);
  return new Intl.NumberFormat("vi-VN").format(number);
};

const formatDecimal = (value, digits = 2) => {
  const number = Number(value || 0);
  if (Number.isNaN(number)) return "0";
  return Number.isInteger(number)
    ? String(number)
    : number.toFixed(digits).replace(/\.?0+$/, "");
};

const formatDateInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateDisplay = (dateString) => {
  if (!dateString) return "--";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString("vi-VN");
};

const formatTimeDisplay = (timeString) => {
  if (!timeString) return "--:--";
  const raw = String(timeString).trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw.slice(0, 5);
  if (/^\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^\d{4}$/.test(raw)) return `${raw.slice(0, 2)}:${raw.slice(2, 4)}`;

  return raw.slice(0, 5) || "--:--";
};

const getDateRange = (days = 30) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));

  return {
    from: formatDateInput(start),
    to: formatDateInput(end),
  };
};

const normalizeChartItems = (response) => {
  const raw = response?.data?.data || response?.data?.chart || response?.data || [];
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => ({
    id: item.date || item.label || index,
    label: item.label || item.date || `M${index + 1}`,
    value:
      Number(
        item.total_calories ??
          item.calories ??
          item.total ??
          item.value ??
          0
      ) || 0,
    rawDate: item.date || null,
  }));
};

const normalizeTopMeals = (response) => {
  const raw = response?.data?.data || response?.data?.meals || response?.data || [];
  if (!Array.isArray(raw)) return [];

  return raw.map((item, index) => ({
    id: item.id || item.meal_name || index,
    meal_name: item.meal_name || "Món ăn",
    total_calories: Number(item.total_calories ?? item.calories ?? 0) || 0,
    total_times: Number(item.total_times ?? item.count ?? 0) || 0,
    avg_calories: Number(item.avg_calories ?? 0) || 0,
  }));
};

const normalizeHistoryMeals = (response) => {
  const root = response?.data || {};
  const raw =
    root?.data ||
    root?.history ||
    root?.meals ||
    response?.data ||
    [];

  if (!Array.isArray(raw)) return [];

  const meals = [];

  raw.forEach((item, index) => {
    if (Array.isArray(item?.meals)) {
      item.meals.forEach((meal, mealIndex) => {
        meals.push({
          id: meal.id || `${item.date || "date"}-${mealIndex}`,
          meal_name: meal.meal_name || meal.name || "Món ăn",
          calories: Number(meal.calories ?? 0) || 0,
          quantity: meal.quantity ?? null,
          unit: meal.unit || "",
          note: meal.note || meal.notes || "",
          meal_date: meal.meal_date || item.date || "",
          meal_time: meal.meal_time || "",
          source: meal.source || "manual",
          hasRealDetail: true,
        });
      });
      return;
    }

    const looksLikeMeal =
      item?.meal_name ||
      item?.meal_time ||
      item?.source ||
      item?.quantity !== undefined ||
      item?.unit;

    if (looksLikeMeal) {
      meals.push({
        id: item.id || `meal-${index}`,
        meal_name: item.meal_name || item.name || "Món ăn",
        calories: Number(item.calories ?? item.total_calories ?? 0) || 0,
        quantity: item.quantity ?? null,
        unit: item.unit || "",
        note: item.note || item.notes || "",
        meal_date: item.meal_date || item.date || "",
        meal_time: item.meal_time || "",
        source: item.source || "manual",
        hasRealDetail: true,
      });
      return;
    }

    meals.push({
      id: item.id || `summary-${index}`,
      meal_name: `Tổng ${Number(item.total_meals || 0)} món trong ngày`,
      calories: Number(item.total_calories ?? 0) || 0,
      quantity: null,
      unit: "",
      note: "",
      meal_date: item.date || "",
      meal_time: "",
      source: "manual",
      hasRealDetail: false,
    });
  });

  return meals.sort((a, b) => {
    const aDateTime = `${a.meal_date || ""} ${a.meal_time || "00:00:00"}`;
    const bDateTime = `${b.meal_date || ""} ${b.meal_time || "00:00:00"}`;
    return bDateTime.localeCompare(aDateTime);
  });
};

export default function NutritionStatisticsPage() {
  const memberId = useSelector((state) => state?.auth?.member?.id || null);

  const [rangeType, setRangeType] = useState(DEFAULT_DAYS);
  const [dateRange, setDateRange] = useState(getDateRange(DEFAULT_DAYS));
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState(null);
  const [chartItems, setChartItems] = useState([]);
  const [topMeals, setTopMeals] = useState([]);
  const [historyMeals, setHistoryMeals] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredBar, setHoveredBar] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetailLoading, setDayDetailLoading] = useState(false);
  const [selectedDayMeals, setSelectedDayMeals] = useState([]);
  const [selectedDayTotalCalories, setSelectedDayTotalCalories] = useState(0);

  useEffect(() => {
    if (rangeType === "custom") return;
    setDateRange(getDateRange(rangeType));
  }, [rangeType]);

  useEffect(() => {
    let mounted = true;

    const fetchStatistics = async () => {
      if (!memberId) {
        setSummary(null);
        setChartItems([]);
        setTopMeals([]);
        setHistoryMeals([]);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = {
          member_id: memberId,
          from: dateRange.from,
          to: dateRange.to,
        };

        const [summaryRes, chartRes, topMealsRes, historyRes] =
          await Promise.all([
            getNutritionSummary(params),
            getNutritionChart({ ...params, type: "day" }),
            getNutritionTopMeals({ ...params, limit: 5 }),
            getCaloriesHistory(memberId, dateRange.from, dateRange.to),
          ]);

        if (!mounted) return;

        setSummary(summaryRes?.data || null);
        setChartItems(normalizeChartItems(chartRes));
        setTopMeals(normalizeTopMeals(topMealsRes));
        setHistoryMeals(normalizeHistoryMeals(historyRes));
        setCurrentPage(1);
        setHoveredBar(null);
        setSelectedDay(null);
        setSelectedDayMeals([]);
        setSelectedDayTotalCalories(0);
      } catch (error) {
        console.error("Lỗi khi tải thống kê dinh dưỡng:", error);

        if (!mounted) return;

        setSummary(null);
        setChartItems([]);
        setTopMeals([]);
        setHistoryMeals([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchStatistics();

    return () => {
      mounted = false;
    };
  }, [memberId, dateRange.from, dateRange.to]);

  const totalCalories = useMemo(() => {
    const fromSummary = Number(summary?.total_calories ?? 0);
    if (fromSummary > 0) return fromSummary;

    return historyMeals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
  }, [summary, historyMeals]);

  const totalMeals = useMemo(() => {
    const fromSummary = Number(summary?.total_meals ?? 0);
    if (fromSummary > 0) return fromSummary;

    return historyMeals.filter((meal) => meal.hasRealDetail).length || historyMeals.length;
  }, [summary, historyMeals]);

  const totalDays = useMemo(() => {
    const fromSummary = Number(summary?.days_with_meals ?? 0);
    if (fromSummary > 0) return fromSummary;

    if (chartItems.length > 0) return chartItems.length;

    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);
    const diffTime = Math.abs(to.getTime() - from.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [summary, chartItems, dateRange.from, dateRange.to]);

  const avgCaloriesPerDay = useMemo(() => {
    if (totalDays <= 0) return 0;
    return Math.round(totalCalories / totalDays);
  }, [totalCalories, totalDays]);

  const avgCaloriesPerMeal = useMemo(() => {
    if (totalMeals <= 0) return 0;
    return Math.round(totalCalories / totalMeals);
  }, [totalCalories, totalMeals]);

  const maxChartValue = useMemo(() => {
    const max = Math.max(...chartItems.map((item) => Number(item.value || 0)), 0);
    return max <= 0 ? 1 : max;
  }, [chartItems]);

  const paginatedHistory = useMemo(() => {
    const start = (currentPage - 1) * TABLE_ITEMS_PER_PAGE;
    return historyMeals.slice(start, start + TABLE_ITEMS_PER_PAGE);
  }, [historyMeals, currentPage]);

  const totalPages = Math.max(1, Math.ceil(historyMeals.length / TABLE_ITEMS_PER_PAGE));

  const mealsGroupedByDay = useMemo(() => {
    const grouped = {};

    historyMeals.forEach((meal) => {
      const key = meal.meal_date || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(meal);
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date] = grouped[date].sort((a, b) => {
        const aTime = a.meal_time || "00:00:00";
        const bTime = b.meal_time || "00:00:00";
        return aTime.localeCompare(bTime);
      });
    });

    return grouped;
  }, [historyMeals]);

  const chartRangeLabel = useMemo(() => {
    return `${formatDateDisplay(dateRange.from)} - ${formatDateDisplay(dateRange.to)}`;
  }, [dateRange.from, dateRange.to]);

  const topMealsForHoveredDay = useMemo(() => {
    if (!hoveredBar?.rawDate) return [];
    const mealsOfDay = mealsGroupedByDay[hoveredBar.rawDate] || [];

    return mealsOfDay.map((meal) => ({
      id: meal.id,
      meal_name: meal.meal_name,
      total_calories: meal.calories,
      meal_time: meal.meal_time,
    }));
  }, [hoveredBar, mealsGroupedByDay]);

  const handleChangeCustomDate = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyCustomRange = () => {
    if (!dateRange.from || !dateRange.to) return;
    setRangeType("custom");
  };

  const openDayDetail = async (date) => {
    if (!date || !memberId) return;

    setSelectedDay(date);
    setDayDetailLoading(true);
    setSelectedDayMeals([]);
    setSelectedDayTotalCalories(0);

    try {
      const response = await getCaloriesByDay(date, memberId);
      const data = response?.data || {};

      const meals = Array.isArray(data?.meals) ? data.meals : [];

      const normalizedMeals = meals.map((meal, index) => ({
        id: meal.id || `${date}-${index}`,
        meal_name: meal.meal_name || meal.name || "Món ăn",
        calories: Number(meal.calories ?? 0) || 0,
        quantity: meal.quantity ?? null,
        unit: meal.unit || "",
        note: meal.note || meal.notes || "",
        meal_date: meal.meal_date || date,
        meal_time: meal.meal_time || "",
        source: meal.source || "manual",
      }));

      setSelectedDayMeals(normalizedMeals);
      setSelectedDayTotalCalories(Number(data?.total_calories ?? 0) || 0);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết ngày:", error);
      setSelectedDayMeals([]);
      setSelectedDayTotalCalories(0);
    } finally {
      setDayDetailLoading(false);
    }
  };

  const closeDayDetail = () => {
    setSelectedDay(null);
    setSelectedDayMeals([]);
    setSelectedDayTotalCalories(0);
    setDayDetailLoading(false);
  };

  const exportReport = () => {
    const reportData = {
      from: dateRange.from,
      to: dateRange.to,
      total_calories: totalCalories,
      total_meals: totalMeals,
      total_days: totalDays,
      avg_calories_per_day: avgCaloriesPerDay,
      avg_calories_per_meal: avgCaloriesPerMeal,
      top_meals: topMeals,
      history: historyMeals,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nutrition-statistics-${dateRange.from}-to-${dateRange.to}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!memberId) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-red-200 bg-white p-6 text-slate-900 shadow-sm">
            <h1 className="text-2xl font-bold">Thống kê dinh dưỡng</h1>
            <p className="mt-3 text-sm text-red-600">
              Không tìm thấy member_id từ Redux.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
            <div>
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                FitnesIT • Nutrition Statistics
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-4xl">
                Báo cáo dinh dưỡng
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
                Theo dõi xu hướng calo và lịch sử món ăn trong khoảng thời gian đã chọn.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Bộ lọc thời gian
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {[7, 14, 30].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setRangeType(day)}
                    className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                      rangeType === day
                        ? "bg-blue-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day} ngày
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setRangeType("custom")}
                  className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                    rangeType === "custom"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Tùy chọn
                </button>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => handleChangeCustomDate("from", e.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                />

                <span className="text-center text-sm text-slate-400">đến</span>

                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => handleChangeCustomDate("to", e.target.value)}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500"
                />

                <button
                  type="button"
                  onClick={handleApplyCustomRange}
                  className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Áp dụng
                </button>
              </div>
            </div>
          </div>
        </section>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            Đang tải thống kê dinh dưỡng...
          </div>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                <p className="text-sm text-slate-500">Tổng calo</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-blue-700">
                    {formatNumber(totalCalories)}
                  </span>
                  <span className="pb-1 text-sm text-slate-500">kcal</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                <p className="text-sm text-slate-500">Trung bình / ngày</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {formatNumber(avgCaloriesPerDay)}
                  </span>
                  <span className="pb-1 text-sm text-slate-500">kcal</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                <p className="text-sm text-slate-500">Tổng số món</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {formatNumber(totalMeals)}
                  </span>
                  <span className="pb-1 text-sm text-slate-500">món</span>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                <p className="text-sm text-slate-500">Trung bình / món</p>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    {formatNumber(avgCaloriesPerMeal)}
                  </span>
                  <span className="pb-1 text-sm text-slate-500">kcal</span>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6">
              <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">Xu hướng calo</h2>
                   
                  </div>

                  <div className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    {chartRangeLabel}
                  </div>
                </div>

                <div className="relative mt-6 flex h-[260px] items-end gap-3 overflow-visible rounded-3xl border border-slate-200 bg-slate-50 px-4 pb-6 pt-8">
                  {chartItems.length === 0 ? (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      Chưa có dữ liệu biểu đồ.
                    </div>
                  ) : (
                    <>
                      {chartItems.map((item, index) => {
                        const height = Math.max(
                          36,
                          Math.round((Number(item.value || 0) / maxChartValue) * 170)
                        );

                        const barClass =
                          index === chartItems.length - 1
                            ? "bg-blue-600"
                            : "bg-slate-800";

                        return (
                          <div
                            key={item.id}
                            className="group relative flex flex-1 flex-col items-center justify-end gap-3"
                            onMouseEnter={() => setHoveredBar(item)}
                            onMouseLeave={() => setHoveredBar(null)}
                          >
                            <div
                              className={`w-full rounded-t-2xl ${barClass} transition-all duration-200 group-hover:opacity-90`}
                              style={{ height }}
                            />
                            <span className="text-center text-xs font-medium text-slate-500">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}

                      {hoveredBar ? (
                        <div className="pointer-events-none absolute left-4 top-4 z-10 w-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
                          <div className="mb-2">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Chi tiết ngày
                            </p>
                            <h3 className="mt-1 text-sm font-bold text-slate-900">
                              {hoveredBar.label}
                            </h3>
                          </div>

                          <div className="space-y-1 text-sm text-slate-600">
                            <div>
                              Tổng calo ngày này:{" "}
                              <span className="font-semibold text-slate-900">
                                {formatNumber(hoveredBar.value)} kcal
                              </span>
                            </div>
                            <div>
                              Tổng calo giai đoạn:{" "}
                              <span className="font-semibold text-blue-700">
                                {formatNumber(totalCalories)} kcal
                              </span>
                            </div>
                          </div>

                         
                        
            
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Lịch sử chi tiết</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Nhật ký món ăn trong giai đoạn đã chọn
                  </p>
                </div>

                <button
                  type="button"
                  onClick={exportReport}
                  className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  Xuất báo cáo
                </button>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                        <th className="px-5 py-4">Ngày</th>
                        <th className="px-5 py-4">Món ăn</th>
                        <th className="px-5 py-4">Nguồn</th>
                        <th className="px-5 py-4">Xem</th>
                      </tr>
                    </thead>

                    <tbody>
                      {paginatedHistory.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-5 py-8 text-center text-sm text-slate-400"
                          >
                            Chưa có dữ liệu lịch sử.
                          </td>
                        </tr>
                      ) : (
                        paginatedHistory.map((meal) => (
                          <tr
                            key={meal.id}
                            className="border-t border-slate-100 text-sm text-slate-600"
                          >
                            <td className="px-5 py-4 font-medium text-slate-700">
                              {formatDateDisplay(meal.meal_date)}
                            </td>

                            <td className="px-5 py-4">
                              <div className="font-semibold text-slate-800">
                                {meal.meal_name}
                              </div>

                              <div className="mt-1 text-xs text-slate-400">
                                {formatNumber(meal.calories)} kcal
                                {meal.quantity !== null && meal.quantity !== undefined
                                  ? ` • ${formatDecimal(meal.quantity)} ${meal.unit || ""}`
                                  : ""}
                              </div>
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                  sourceBadgeMap[meal.source] ||
                                  "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {sourceLabelMap[meal.source] || meal.source}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => openDayDetail(meal.meal_date)}
                                className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                              >
                                Xem
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {historyMeals.length > TABLE_ITEMS_PER_PAGE ? (
                <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <p className="text-sm text-slate-500">
                    Trang {currentPage}/{totalPages} • Tổng {historyMeals.length} dòng
                  </p>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                        currentPage === 1
                          ? "cursor-not-allowed bg-slate-100 text-slate-300"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Trước
                    </button>

                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1;
                      const active = page === currentPage;

                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`h-10 w-10 rounded-2xl text-sm font-bold transition ${
                            active
                              ? "bg-blue-600 text-white"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                        currentPage === totalPages
                          ? "cursor-not-allowed bg-slate-100 text-slate-300"
                          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      Sau
                    </button>
                  </div>
                </div>
              ) : null}
            </section>
          </>
        )}
      </div>

      {selectedDay ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl md:p-6">
            <button
              type="button"
              onClick={closeDayDetail}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100"
            >
              ×
            </button>

            <div className="pr-10">
              <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                Chi tiết ngày
              </div>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {formatDateDisplay(selectedDay)}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Tổng calo ngày này:{" "}
                <span className="font-semibold text-blue-700">
                  {formatNumber(selectedDayTotalCalories)} kcal
                </span>
              </p>
            </div>

            <div className="mt-5 max-h-[65vh] overflow-y-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
              {dayDetailLoading ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  Đang tải chi tiết ngày...
                </div>
              ) : selectedDayMeals.length === 0 ? (
                <div className="py-10 text-center text-sm text-slate-400">
                  Không có món ăn trong ngày này.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-slate-900">
                              {meal.meal_name}
                            </h3>

                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                sourceBadgeMap[meal.source] ||
                                "bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              {sourceLabelMap[meal.source] || meal.source}
                            </span>
                          </div>

                          <div className="mt-2 grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                            <div>
                              Giờ:{" "}
                              <span className="font-medium text-slate-800">
                                {formatTimeDisplay(meal.meal_time)}
                              </span>
                            </div>

                            <div>
                              Calo:{" "}
                              <span className="font-medium text-slate-800">
                                {formatNumber(meal.calories)} kcal
                              </span>
                            </div>

                            <div>
                              Định lượng:{" "}
                              <span className="font-medium text-slate-800">
                                {meal.quantity !== null && meal.quantity !== undefined
                                  ? `${formatDecimal(meal.quantity)} ${meal.unit || ""}`
                                  : "--"}
                              </span>
                            </div>

                            <div>
                              Ghi chú:{" "}
                              <span className="font-medium text-slate-800">
                                {meal.note?.trim() ? meal.note : "Không có ghi chú"}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <div className="text-xs uppercase tracking-wide text-slate-400">
                            Giá trị
                          </div>
                          <div className="mt-1 text-lg font-bold text-blue-700">
                            {formatNumber(meal.calories)} kcal
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={closeDayDetail}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}