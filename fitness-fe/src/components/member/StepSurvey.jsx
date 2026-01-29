import { useState } from "react";
import { submitSurvey } from "../../services/member/MemberService";
import { toast } from "react-toastify";
/* ================== CONSTANTS ================== */

const GOALS = [
  { id: "gain_muscle", label: "Tăng cân / Tăng cơ bắp" },
  { id: "lose_weight", label: "Giảm cân" },
  { id: "maintain_health", label: "Duy trì sức khỏe" },
  { id: "other", label: "Khác" },
];

const DAYS_OF_WEEK = [
  { id: "mon", label: "Thứ 2" },
  { id: "tue", label: "Thứ 3" },
  { id: "wed", label: "Thứ 4" },
  { id: "thu", label: "Thứ 5" },
  { id: "fri", label: "Thứ 6" },
  { id: "sat", label: "Thứ 7" },
  { id: "sun", label: "Chủ nhật" },
];

const TIME_SLOTS = [
  { id: "early_morning", label: "Sáng sớm (5h - 8h)" },
  { id: "morning", label: "Sáng (8h - 11h)" },
  { id: "afternoon", label: "Chiều (12h - 17h)" },
  { id: "evening", label: "Tối (17h - 21h)" },
  { id: "all", label: "Cả ngày" },
];

/* ================== COMPONENT ================== */

export default function StepSurvey({ next }) {
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState({});
  const [expandedDay, setExpandedDay] = useState(null);

  /* ================== HANDLERS ================== */

  const toggleDay = (dayId) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId],
    );
  };

  const selectTimeSlot = (dayId, slotId) => {
    setTimeSlots((prev) => ({ ...prev, [dayId]: slotId }));
    setExpandedDay(null);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const trainingTimes = selectedDays.map((day) => ({
        day,
        time: timeSlots[day],
      }));

      const data = await submitSurvey({
        targetType: goal,
        selectedDays: trainingTimes,
      });

      toast.success(data.message || "Lưu khảo sát thành công ");
      next(); // sang step 4
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("Bạn đã tạo khảo sát rồi");
      } else {
        toast.error("Lưu khảo sát thất bại");
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = goal && selectedDays.length > 0;

  /* ================== RENDER ================== */

  return (
    <div className="space-y-8 text-center">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Khảo sát</h2>
        <p className="text-gray-400">
          Giúp chúng tôi xây dựng lộ trình phù hợp cho bạn
        </p>
      </div>

      {/* ================== GOAL ================== */}
      <div>
        <p className="text-white font-semibold mb-4">
          Mục tiêu luyện tập của bạn là gì?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-center">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`py-4 px-3 rounded-xl border-2 transition-all text-sm font-medium
                ${
                  goal === g.id
                    ? "border-yellow-400 bg-yellow-400/20 text-yellow-300"
                    : "border-gray-600 text-white hover:border-yellow-300"
                }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================== DAYS ================== */}
      <div>
        <p className="text-white font-semibold mb-4">
          Bạn thường tập vào ngày nào?
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.id}
              onClick={() => toggleDay(day.id)}
              className={`px-4 py-2 rounded-full border text-sm font-medium transition
                ${
                  selectedDays.includes(day.id)
                    ? "bg-yellow-400 text-gray-900 border-yellow-400"
                    : "border-gray-600 text-white hover:border-yellow-300"
                }`}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================== TIME SLOTS ================== */}
      {selectedDays.length > 0 && (
        <div className="space-y-4">
          <p className="text-white font-semibold">
            Chọn khung giờ cho từng ngày
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center">
            {selectedDays.map((dayId) => {
              const dayLabel = DAYS_OF_WEEK.find((d) => d.id === dayId)?.label;
              const selectedTime = timeSlots[dayId];
              const isExpanded = expandedDay === dayId;

              return (
                <div
                  key={dayId}
                  className="bg-gray-800/50 p-4 rounded-xl border border-gray-700"
                >
                  {/* Combobox header */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? null : dayId)}
                    className={`w-full py-3 rounded-lg border text-sm font-medium transition
                      ${
                        selectedTime
                          ? "border-yellow-400 bg-yellow-400/15 text-yellow-300"
                          : "border-gray-500 bg-gray-700/50 text-white hover:border-yellow-300"
                      }`}
                  >
                    {dayLabel}
                    {selectedTime && (
                      <div className="text-xs text-gray-300 mt-1">
                        {TIME_SLOTS.find((t) => t.id === selectedTime)?.label}
                      </div>
                    )}
                  </button>

                  {/* Options */}
                  {isExpanded && (
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => selectTimeSlot(dayId, slot.id)}
                          className={`py-2 px-3 rounded-md border text-xs transition
                            ${
                              selectedTime === slot.id
                                ? "border-yellow-400 bg-yellow-400/25 text-yellow-300"
                                : "border-gray-500 bg-gray-700/40 text-gray-200 hover:border-yellow-300"
                            }`}
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================== BUTTONS ================== */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={() => next()}
          className="flex-1 py-3 rounded-full border-2 border-yellow-400 text-yellow-400 
      hover:bg-yellow-400 hover:scale-105 hover:text-gray-900 hover:font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/30"
        >
          Bỏ qua
        </button>

        <button
          disabled={!isValid || loading}
          onClick={handleSubmit}
          className={`flex-1 py-3 rounded-full font-semibold transition
            ${
              isValid && !loading
                ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/30"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          )}
          {loading ? "Đang lưu..." : "Lưu và tiếp tục"}
        </button>
      </div>
    </div>
  );
}
