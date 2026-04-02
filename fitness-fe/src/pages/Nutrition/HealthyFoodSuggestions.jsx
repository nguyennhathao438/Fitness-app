import { useMemo, useState } from "react";
import { getHealthyFoodSuggestions } from "../../services/foodCaloriesMap";

const ITEMS_PER_PAGE = 4;

export default function HealthyFoodSuggestions({
  onQuickAddFood,
  onSelectFood,
  title = "Món ăn gợi ý tốt cho sức khỏe",
  description = "",
}) {
  const foods = useMemo(() => {
    const result = getHealthyFoodSuggestions?.();
    return Array.isArray(result) ? result : [];
  }, []);

  const [page, setPage] = useState(0);
  const [selectedFoodId, setSelectedFoodId] = useState(null);
  const [selectedFoodForm, setSelectedFoodForm] = useState({
    meal_name: "",
    calories: "",
    quantity: "",
    unit: "",
    meal_time: "",
    note: "",
  });

  const totalPages = Math.max(1, Math.ceil(foods.length / ITEMS_PER_PAGE));

  const currentItems = useMemo(() => {
    const start = page * ITEMS_PER_PAGE;
    return foods.slice(start, start + ITEMS_PER_PAGE);
  }, [foods, page]);

  const selectedFood = useMemo(() => {
    if (!selectedFoodId) return null;
    return foods.find((item) => item.id === selectedFoodId) || null;
  }, [foods, selectedFoodId]);

  const handlePrev = () => {
    setPage((prev) => (prev <= 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev >= totalPages - 1 ? 0 : prev + 1));
  };

  const handleSelectFood = (food) => {
    if (!food) return;
    setSelectedFoodId(food.id);
    onSelectFood?.({
      ...food,
      name: food.name || "",
      calories: food.calories ?? "",
      defaultQuantity:
        food.defaultQuantity !== null && food.defaultQuantity !== undefined
          ? food.defaultQuantity
          : null,
      defaultUnit: food.defaultUnit || food.unitBase || "",
    });
  };

  const handleChangeSelectedFoodForm = (field, value) => {
    setSelectedFoodForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSelectedFood = async () => {
    if (!selectedFood) return;

    const success = await onQuickAddFood?.(
      {
        ...selectedFood,
        name: selectedFoodForm.meal_name,
        calories: Number(selectedFoodForm.calories) || 0,
        defaultQuantity:
          selectedFoodForm.quantity !== ""
            ? Number(selectedFoodForm.quantity)
            : null,
        defaultUnit: selectedFoodForm.unit || null,
      },
      {
        meal_time: selectedFoodForm.meal_time || null,
        note: selectedFoodForm.note.trim(),
      },
    );

    if (success) {
      setSelectedFoodId(null);
      setSelectedFoodForm({
        meal_name: "",
        calories: "",
        quantity: "",
        unit: "",
        meal_time: "",
        note: "",
      });
    }
  };

  return (
    <section className="mx-auto mt-6 max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm md:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
            Gợi ý dinh dưỡng
          </div>

          <h2 className="mt-3 text-xl font-bold md:text-2xl">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            Trang {page + 1}/{totalPages}
          </span>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Chưa có dữ liệu món ăn gợi ý.
        </div>
      ) : (
        <>
          <div className="relative">
            <button
              type="button"
              onClick={handlePrev}
              className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:bg-slate-50 md:flex"
              aria-label="Trang trước"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:bg-slate-50 md:flex"
              aria-label="Trang sau"
            >
              ›
            </button>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {currentItems.map((food) => {
                const isSelected = selectedFoodId === food.id;

                return (
                  <div
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className={`cursor-pointer rounded-3xl border p-5 transition ${
                      isSelected
                        ? "border-blue-400 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectFood(food);
                        }}
                        className="mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 bg-white"
                        aria-label={`Chọn ${food.name}`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full ${
                            isSelected ? "bg-blue-600" : "bg-transparent"
                          }`}
                        />
                      </button>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm ring-1 ring-slate-200">
                            {food.icon || "🍽️"}
                          </div>

                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">
                              {food.name || "Món ăn"}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              {food.calories ?? 0} kcal /{" "}
                              {food.unitBase || "100g"}
                            </p>
                          </div>
                        </div>

                        {food.description ? (
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {food.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
              <button
                type="button"
                onClick={handlePrev}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Trước
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sau
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
